import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { fetchGoogleSheetsData } from './googleSheets.js';

/**
 * Convierte cualquier valor a un número válido (evitando NaN o null)
 */
export function cleanNumber(val) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'string') {
    let str = val.replace(/[\$\s]/g, '');
    if (!str) return 0;

    if (str.includes('.') && str.includes(',')) {
      if (str.indexOf('.') < str.indexOf(',')) {
        str = str.replace(/\./g, '').replace(',', '.');
      } else {
        str = str.replace(/,/g, '');
      }
    } else if (str.includes(',')) {
      const parts = str.split(',');
      if (parts.length === 2 && parts[1].length === 3 && parts[0].length >= 1) {
        str = str.replace(/,/g, '');
      } else if (parts.length > 2) {
        str = str.replace(/,/g, '');
      } else {
        str = str.replace(',', '.');
      }
    }

    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

/**
 * Formatea fechas de Excel (números de serie o cadenas ISO/Date) a YYYY-MM-DD
 */
function formatExcelDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'number') {
    const jsDate = new Date(Math.round((val - 25569) * 86400 * 1000));
    if (!isNaN(jsDate.getTime())) return jsDate.toISOString().split('T')[0];
  }
  const str = String(val).trim();
  if (str.includes('T')) return str.split('T')[0];
  return str;
}

/**
 * Lee datos desde Google Sheets API en la nube si hay credenciales configuradas en .env.local,
 * de lo contrario realiza fallback automático al archivo Excel local San-2026-01.xlsx.
 * Garantiza la devolución de objetos JSON planos sin clases ni instancias Date de JS.
 */
export async function getTandaData() {
  const useGoogleSheets = Boolean(
    process.env.SPREADSHEET_ID &&
    process.env.GOOGLE_CLIENT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );

  let rawData;

  if (useGoogleSheets) {
    try {
      console.log('🌐 Obteniendo datos en tiempo real desde Google Sheets API...');
      rawData = await fetchGoogleSheetsData();
    } catch (err) {
      console.warn('⚠️ Falló la conexión con Google Sheets API. Usando fallback a Excel local:', err.message);
      rawData = fetchFromLocalExcel();
    }
  } else {
    console.log('📁 Leyendo datos desde el archivo Excel local San-2026-01.xlsx...');
    rawData = fetchFromLocalExcel();
  }

  const formattedData = formatTandaData(rawData);

  // Serialización estricta para Next.js Server Components (convierte Date a String y elimina prototipos)
  return JSON.parse(JSON.stringify(formattedData));
}

/**
 * Parsea el archivo San-2026-01.xlsx local
 */
function fetchFromLocalExcel() {
  const filePath = path.join(process.cwd(), 'San-2026-01.xlsx');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`El archivo Excel no fue encontrado en: ${filePath}`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });

  const rawConfig = getSheetDataAsJson(workbook, 'Config');
  const rawDbUsuarios = getSheetDataAsJson(workbook, 'DB_Usuarios').filter(u => u.ID || u['ID Usuario'] || u.Nombre);
  const rawRegistroPagos = getSheetDataAsJson(workbook, 'Registro_Pagos').filter(p => p.Fecha || p['ID Usuario'] || p.Nombre);
  const rawDashboard = getSheetDataAsJson(workbook, 'Dashboard').filter(d => d.ID || d.Nombre);
  const rawKpis = getSheetDataAsJson(workbook, 'KPIs_Globales');
  const rawLogErrores = getSheetDataAsJson(workbook, 'Log-Errores').filter(l => l.Workflow || l['Nodo que Falló'] || l['Detalle del Error']);

  return {
    config: rawConfig,
    dbUsuarios: rawDbUsuarios,
    registroPagos: rawRegistroPagos,
    dashboard: rawDashboard,
    kpis: rawKpis,
    logErrores: rawLogErrores,
  };
}

/**
 * Convierte una hoja del workbook XLSX a JSON con raw: true para preservar tipos numéricos verdaderos
 */
function getSheetDataAsJson(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { defval: null, raw: true });
}

/**
 * Formatea y enriquece los datos procesados para su consumo directo en la UI
 */
function formatTandaData({ config = [], dbUsuarios = [], registroPagos = [], dashboard = [], kpis = [], logErrores = [] }) {
  // Mapa de usuarios por ID para obtener imagen y detalles adicionales
  const userMap = {};
  dbUsuarios.forEach(u => {
    const id = String(u.ID || u['ID Usuario'] || '').trim();
    if (id) {
      userMap[id] = u;
    }
  });

  // KPIs Globales (Fila 0 o combinación)
  const kpiRow = kpis[0] || {};
  const configRow = config[0] || {};

  const globalKpis = {
    semanaActual: cleanNumber(kpiRow['Semana Actual'] ?? configRow['Semana Actual'] ?? 0),
    semanasTranscurridas: cleanNumber(kpiRow['Semanas Transcurridas'] ?? configRow['Semanas Transcurridas'] ?? 0),
    semanasRestantes: cleanNumber(kpiRow['Semanas Restantes'] ?? configRow['Semanas Restantes'] ?? 0),
    totalSemanas: cleanNumber(configRow['Total Semanas'] ?? 40),
    proximoParticipante: String(kpiRow['Próximo Participante'] || 'N/A'),
    proximaMoto: String(kpiRow['Próximo iPhone'] || kpiRow['Próxima Moto'] || 'N/A'),
    costoProximaMoto: cleanNumber(kpiRow['Costo Próximo iPhone'] || kpiRow['Costo Próxima Moto']),
    fondoProximaMoto: cleanNumber(kpiRow['Fondo Próximo iPhone'] || kpiRow['Fondo Próxima Moto']),
    faltante: cleanNumber(kpiRow['Faltante']),
    cajaTotal: cleanNumber(kpiRow['Caja Total']),
    saldoActual: cleanNumber(kpiRow['Saldo Actual']),
    alDiaCount: cleanNumber(kpiRow['Al Día']),
    adelantadosCount: cleanNumber(kpiRow['Adelantados']),
    enMoraCount: cleanNumber(kpiRow['En Mora']),
  };

  // Dashboard de Participantes con ID único garantizado por índice
  const participants = dashboard.map((item, idx) => {
    const rawId = String(item.ID || userMap[item.Nombre]?.ID || '').trim();
    const id = rawId ? rawId : `U-${idx + 1}`;
    const userDetail = userMap[id] || userMap[item.Nombre] || {};

    const totalPagado = cleanNumber(item['Total Pagado']);
    const costoMoto = cleanNumber(item['Costo iPhone'] || userDetail['Costo iPhone'] || item['Costo Moto'] || userDetail['Costo Moto']);
    const comision = cleanNumber(userDetail['Comisión']);
    const totalAPagar = cleanNumber(userDetail['Total a Pagar']) || (costoMoto + comision);
    const cuotaSemanal = cleanNumber(item['Cuota Semanal'] ?? item['Cuota Semanal '] ?? userDetail['Cuota Semanal'] ?? userDetail['Cuota Semanal ']);
    const deudaTotal = cleanNumber(item['Deuda Total']);
    const targetAlDia = cleanNumber(item['Target al Día']);
    const saldo = cleanNumber(item['Saldo']);
    const cuotasCompletadas = cleanNumber(item['Cuotas Completadas']);
    const cuotasVencidas = cleanNumber(item['Cuotas Vencidas']);

    const porcentajeProgreso = totalAPagar > 0 
      ? Math.min(100, Math.round((totalPagado / totalAPagar) * 100))
      : (costoMoto > 0 ? Math.min(100, Math.round((totalPagado / costoMoto) * 100)) : 0);

    const rawPin = String(userDetail.PIN || userDetail.pin || userDetail['PIN'] || '').trim();
    const defaultPin = String(id.replace(/\D/g, '') || idx + 1).padStart(8, '0');
    const pin = rawPin ? rawPin : defaultPin;

    return {
      id,
      nombre: item.Nombre || userDetail.Nombre || `Participante ${idx + 1}`,
      pin,
      telegramId: item['Telegram ID'] || userDetail['Telegram ID'] || null,
      modeloMoto: userDetail['Modelo iPhone'] || userDetail['Modelo Moto'] || 'iPhone 18 Pro Max',
      imagenMoto: userDetail.Imagen || '/img/plateado.jpg',
      noAsignado: cleanNumber(item['No. Asignado'] || userDetail['No. Asignado'] || (idx + 1)),
      estado: item.Estado || 'Al Día',
      totalPagado,
      deudaTotal,
      targetAlDia,
      saldo,
      costoMoto,
      cuotaSemanal,
      cuotasCompletadas,
      cuotasVencidas,
      porcentajeProgreso,
      estatusMoto: item['Estatus Entrega'] || item['Estatus Moto'] || userDetail['Estatus Entrega'] || userDetail['Estatus Moto'] || 'Pendiente',
      fechaEntregaCalculada: formatExcelDate(item['Fecha de Entrega Calculada'] || userDetail['Fecha de Entrega Calculada']),
      registroEntrega: formatExcelDate(item['Registro de Entrega'] || userDetail['Registro de Entrega']),
    };
  });

  // Registro de Pagos
  const payments = registroPagos.map((p, idx) => ({
    id: `pay-${idx}`,
    fecha: formatExcelDate(p.Fecha) || 'N/A',
    usuarioId: p['ID Usuario'] || 'N/A',
    nombre: p.Nombre || 'N/A',
    monto: cleanNumber(p['Monto Pagado'] || p.Monto),
  })).reverse();

  // Log de Errores
  const logs = logErrores.map((log, idx) => ({
    id: `log-${idx}`,
    fechaHora: formatExcelDate(log['Fecha - Hora'] || log['Fecha-Hora']) || String(log['Fecha - Hora'] || log['Fecha-Hora'] || 'N/A'),
    workflow: log.Workflow || 'N/A',
    nodo: log['Nodo que Falló'] || 'N/A',
    modo: log.Modo || 'N/A',
    executionId: log['Execution ID'] || 'N/A',
    detalleError: log['Detalle del Error'] || 'Sin detalle',
  }));

  // Sanitización de rawConfig
  const sanitizedConfig = {};
  if (configRow) {
    Object.keys(configRow).forEach(key => {
      const val = configRow[key];
      sanitizedConfig[key] = val instanceof Date ? formatExcelDate(val) : val;
    });
  }

  return {
    kpis: globalKpis,
    participants,
    payments,
    logs,
    rawConfig: sanitizedConfig,
  };
}
