Python  
import pandas as pd  
try:  
 xls \= pd.ExcelFile('San-2026-01.xlsx')  
 sheets \= xls.sheet_names  
 data \= {}  
 for sheet in sheets:  
 df \= pd.read_excel(xls, sheet_name=sheet)  
 data\[sheet\] \= df.head(3).to_dict()  
 print("Sheets:", sheets)  
 print("Data:", data)  
except Exception as e:  
 print("Error:", e)

Salida de código

Sheets: \['Config', 'DB_Usuarios', 'Registro_Pagos', 'Dashboard', 'KPIs_Globales', 'Log-Errores'\]  
Data: {'Config': {'Fecha Inicio': {0: Timestamp('2026-01-26 00:00:00')}, 'Total Semanas': {0: 40}, 'Semanas Transcurridas': {0: 26}, 'Semanas Restantes': {0: 14}, 'Semana Actual': {0: 27}}, 'DB_Usuarios': {'ID': {0: 'U001', 1: 'U002', 2: 'U003'}, 'Nombre': {0: 'Angel', 1: 'Reinaldo', 2: 'Luis'}, 'Telegram ID': {0: 1310003882, 1: 6372496183, 2: 4421684}, 'Modelo Moto': {0: 'EK New Horse', 1: 'EK Owen 200', 2: 'Bera SBR'}, 'Imagen': {0: 'https://i.postimg.cc/5NCbs9nD/ek\_new\_horse\_azul.jpg', 1: 'https://i.postimg.cc/q7kKSjVn/ek-new-owen-200s-negro.jpg', 2: 'https://i.postimg.cc/xjGW8kxw/bera-sbr-gris.jpg'}, 'Costo Moto': {0: 1385, 1: 1560, 2: 1070}, 'Comisión': {0: 140, 1: 160, 2: 130}, 'Total a Pagar': {0: 1525, 1: 1720, 2: 1200}, 'No. Asignado': {0: 1, 1: 2, 2: 3}, 'Cuota Semanal ': {0: 38.13, 1: 43.0, 2: 30.0}, 'Fecha de Entrega Calculada': {0: Timestamp('2026-02-23 00:00:00'), 1: Timestamp('2026-03-23 00:00:00'), 2: Timestamp('2026-04-20 00:00:00')}, 'Estatus Moto': {0: 'Entregada', 1: 'Entregada', 2: 'Entregada'}, 'Registro de Entrega': {0: Timestamp('2026-03-01 00:00:00'), 1: Timestamp('2026-03-25 00:00:00'), 2: Timestamp('2026-04-20 00:00:00')}, 'Comisión Acumulada': {0: 140.0, 1: nan, 2: nan}}, 'Registro_Pagos': {'Fecha': {0: datetime.datetime(2026, 1, 30, 0, 0), 1: datetime.datetime(2026, 2, 6, 0, 0), 2: datetime.datetime(2026, 2, 13, 0, 0)}, 'ID Usuario': {0: 'U003', 1: 'U003', 2: 'U003'}, 'Nombre': {0: 'Luis', 1: 'Luis', 2: 'Luis'}, 'Monto Pagado': {0: 30, 1: 30, 2: 30}}, 'Dashboard': {'ID': {0: 'U001', 1: 'U002', 2: 'U003'}, 'Nombre': {0: 'Angel', 1: 'Reinaldo', 2: 'Luis'}, 'Total Pagado': {0: 1200, 1: 950, 2: 695}, 'Deuda Total': {0: 325, 1: 770, 2: 505}, 'Target al Día': {0: 991.38, 1: 1118.0, 2: 780.0}, 'Saldo': {0: 208.62, 1: \-168.0, 2: \-85.0}, 'Estado': {0: 'Adelantado', 1: 'Atraso', 2: 'Atraso'}, 'Telegram ID': {0: 1310003882, 1: 6372496183, 2: 4421684}, 'Cuotas Completadas': {0: 31, 1: 22, 2: 23}, 'Cuotas Vencidas': {0: 0, 1: 4, 2: 3}, 'Costo Moto': {0: 1385, 1: 1560, 2: 1070}, 'Cuota Semanal': {0: 38.13, 1: 43.0, 2: 30.0}, 'Fecha de Entrega Calculada': {0: Timestamp('2026-02-23 00:00:00'), 1: Timestamp('2026-03-23 00:00:00'), 2: Timestamp('2026-04-20 00:00:00')}, 'Estatus Moto': {0: 'Entregada', 1: 'Entregada', 2: 'Entregada'}, 'Registro de Entrega': {0: Timestamp('2026-03-01 00:00:00'), 1: Timestamp('2026-03-25 00:00:00'), 2: Timestamp('2026-04-20 00:00:00')}, 'No. Asignado': {0: 1, 1: 2, 2: 3}}, 'KPIs_Globales': {'Semana Actual': {0: 27}, 'Semanas Transcurridas': {0: 26}, 'Semanas Restantes': {0: 14}, 'Próximo Participante': {0: 'Indira'}, 'Próxima Moto': {0: 'Toro Moka TR 150'}, 'Costo Próxima Moto': {0: 1300}, 'Fondo Próxima Moto': {0: 1220}, 'Faltante': {0: 80}, 'Caja Total': {0: 9555}, 'Saldo Actual': {0: \-915}, 'Al Día': {0: 0}, 'Adelantados': {0: 2}, 'En Mora': {0: 8}}, 'Log-Errores': {'Fecha \- Hora': {0: '17/03/2026 \- 01:10:47', 1: '17/03/2026 \- 17:56:48', 2: '17/03/2026 \- 18:07:16'}, 'Workflow': {0: 'Example Workflow', 1: '\[TANDA\] 📱 Bot Participantes \- Autogestión', 2: '\[TANDA\] 📱 Bot Participantes \- Autogestión'}, 'Nodo que Falló': {0: 'Node With Error', 1: 'Formatear Estado', 2: 'Formatear Estado'}, 'Modo': {0: 'manual', 1: 'webhook', 2: 'webhook'}, 'Execution ID': {0: 231, 1: 2145, 2: 2149}, 'Detalle del Error': {0: 'Example Error Message', 1: "Cannot read properties of undefined (reading 'Monto Pagado') \[line 257\]", 2: "Cannot read properties of undefined (reading 'Monto Pagado') \[line 257\]"}, 'URL del Error': {0: nan, 1: nan, 2: nan}}}

### **1\. Informe Ejecutivo y Enfoque de Arquitectura**

El ecosistema compuesto por **Next.js, Vercel y Google Sheets API** representa una solución arquitectónica altamente eficiente y sin servidores (serverless) para este caso de uso. Al tratarse de un dashboard administrativo de uso exclusivo móvil, la prioridad es la velocidad de carga, la precisión de los datos y el bajo consumo de recursos en el dispositivo cliente.  
Desde una perspectiva técnica, utilizar Google Sheets como base de datos de lectura es viable y robusto si se implementa a través de **React Server Components (RSC)** en Next.js (App Router). Esto significa que la solicitud a la API de Google ocurre exclusivamente en el backend (los servidores de Vercel). El teléfono móvil de la administradora recibe únicamente HTML pre-renderizado con los datos ya integrados, lo que elimina tiempos de carga (spinners) prolongados en conexiones móviles inestables y oculta por completo las credenciales de la base de datos. Además, se adapta perfectamente a flujos de automatización externos (como webhooks o bots de gestión) que ya estén escribiendo datos en hojas como Registro_Pagos o Log-Errores.

### **2\. Estrategia de Integración (Google Sheets API)**

Para lograr una conexión directa, transparente y de lectura en tiempo real sin que la administradora deba iniciar sesión en Google, se debe utilizar el protocolo de autenticación de servidor a servidor mediante **Cuentas de Servicio (Service Accounts)**.  
**Pasos de Integración:**

> 1. **Creación en GCP:** En Google Cloud Console, crea un proyecto, habilita la "Google Sheets API" y genera una Cuenta de Servicio. Esto emitirá un archivo JSON con un client_email y un private_key.
> 2. **Delegación de Acceso:** Toma el correo generado por la Cuenta de Servicio (ej. mi-app@mi-proyecto.iam.gserviceaccount.com) y compártele el archivo San-2026-01.xlsx con permisos de "Lector".
> 3. **Variables de Entorno:** En el panel de Vercel, configura las variables GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY y SPREADSHEET_ID.
> 4. **Implementación en Next.js:** Utiliza la librería oficial googleapis para realizar las consultas dentro de un componente de servidor.

**Fragmento de Código Clave (Server Component \- Lectura en Tiempo Real):**

JavaScript  
// lib/googleSheets.js  
import { google } from 'googleapis';

export async function getDashboardData() {  
 const auth \= new google.auth.JWT(  
 process.env.GOOGLE_CLIENT_EMAIL,  
 null,  
 process.env.GOOGLE_PRIVATE_KEY.replace(/\\\\n/g, '\\n'),  
 \['https://www.googleapis.com/auth/spreadsheets.readonly'\]  
 );

const sheets \= google.sheets({ version: 'v4', auth });

// Consulta directa a la hoja Dashboard  
 const response \= await sheets.spreadsheets.values.get({  
 spreadsheetId: process.env.SPREADSHEET_ID,  
 range: 'Dashboard\!A2:P', // Saltamos la cabecera  
 });

return response.data.values;  
}

Para asegurar que los datos estén siempre actualizados sin forzar una reconstrucción de la página, la ruta en Next.js debe configurarse para no almacenar caché:

JavaScript  
// app/page.jsx  
import { getDashboardData } from '@/lib/googleSheets';

export const dynamic \= 'force-dynamic'; // Asegura lectura en tiempo real

export default async function DashboardMobile() {  
 const data \= await getDashboardData();  
 // Renderizado de la UI con los datos  
}

### **3\. Seguridad y Control de Acceso**

La forma más sencilla, segura y efectiva de proteger el acceso exclusivo de la administradora sin añadir la complejidad y el peso de una base de datos de usuarios (como NextAuth) es utilizar el **Edge Middleware de Next.js configurado con Basic Authentication**.  
Esta estrategia intercepta la solicitud HTTP antes de que llegue a renderizar la página. Si no se detectan las credenciales correctas en las cabeceras, el navegador del teléfono mostrará un cuadro de diálogo nativo pidiendo usuario y contraseña.  
**Implementación (middleware.js en la raíz del proyecto):**

JavaScript  
import { NextResponse } from 'next/server';

export function middleware(req) {  
 const basicAuth \= req.headers.get('authorization');  
 const url \= req.nextUrl;

if (basicAuth) {  
 const authValue \= basicAuth.split(' ')\[1\];  
 const \[user, pwd\] \= atob(authValue).split(':');

    if (user \=== process.env.ADMIN\_USER && pwd \=== process.env.ADMIN\_PASSWORD) {
      return NextResponse.next();
    }

}

url.pathname \= '/api/auth';  
 return new NextResponse('Autenticación Requerida', {  
 status: 401,  
 headers: { 'WWW-Authenticate': 'Basic realm="Dashboard Admin"' },  
 });  
}

export const config \= {  
 matcher: '/(.\*)', // Protege toda la aplicación  
};

_Ventaja clave:_ Es inviolable desde el exterior, requiere cero mantenimiento a nivel de código una vez desplegado y ofrece una experiencia de acceso casi instantánea en dispositivos móviles.

### **4\. Opciones Innovadoras UI/UX (Móvil)**

Para una herramienta administrativa de consulta frecuente, el diseño debe prescindir de adornos innecesarios. Un enfoque basado en gráficos vectoriales planos de alto contraste y tipografía estructurada garantizará una lectura rápida bajo cualquier condición de luz.

> 1. **Panel de KPIs Globales Deslizable (Swipeable):**  
>    En lugar de apilar métricas y consumir espacio vertical, utiliza un contenedor horizontal deslizable en la parte superior. Las métricas críticas extraídas de la hoja KPIs*Globales (ej. \_Caja Total*, _Fondo Próxima Moto_, _Faltante_) se mostrarían en tarjetas negras de bordes rectos (flat design), con el valor numérico en texto blanco masivo y un ícono sutil de Lucide (Banknote o TrendingUp) en una esquina.  
>    _Clases Tailwind sugeridas:_ flex overflow-x-auto snap-x space-x-4 bg-black text-white p-4
> 2. **Lista de Participantes Acordeón con Indicadores Semánticos:**  
>    Los participantes en la hoja Dashboard deben mostrarse en formato de lista colapsada. Cada fila solo debe mostrar el _Nombre_ y un estado visual claro extraído de la columna _Estado_. Si está "Al Día" o "Adelantado", se utiliza el ícono CheckCircle2 (verde esmeralda). Si está en "Atraso", un AlertTriangle (rojo vibrante). Al tocar la fila, esta se despliega (acordeón) para revelar detalles secundarios estructurados sin necesidad de cambiar de pantalla: _Target al Día_, _Deuda Total_, _Cuotas Vencidas_.  
>    _Clases Tailwind sugeridas:_ border-b border-gray-200 py-3 active:bg-gray-50 transition-colors
> 3. **Navegación Inferior Fija (Bottom Tab Bar):**  
>    Para replicar la ergonomía de una aplicación móvil nativa, omite los menús de hamburguesa tradicionales. Implementa una barra inferior estática con tres o cuatro iconos planos de Lucide: LayoutDashboard (Resumen), Users (Participantes), History (Registro Pagos) y Activity (Log de Errores del bot). Esto mantiene el control principal siempre al alcance del pulgar de la administradora.  
>    _Clases Tailwind sugeridas:_ fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-safe

### **5\. Roadmap de Desarrollo**

**Fase 1: Configuración de Infraestructura e Integración**

- Generar la Cuenta de Servicio en Google Cloud Platform.
- Compartir San-2026-01.xlsx con el correo de la cuenta de servicio.
- Inicializar el proyecto: npx create-next-app@latest tanda-dashboard \--tailwind.
- Instalar dependencias clave: npm i googleapis lucide-react.

**Fase 2: Conexión de Datos (Backend)**

- Crear los archivos de configuración en lib/googleSheets.js.
- Programar funciones de extracción y formateo para las hojas objetivo (Dashboard, KPIs_Globales, Registro_Pagos).
- Mapear los arrays de Google Sheets a objetos JSON estructurados por sus nombres de columnas.

**Fase 3: Desarrollo de UI/UX Mobile-First**

- Construir el layout principal asegurando el uso de viewport: "width=device-width, initial-scale=1, maximum-scale=1" para evitar el zoom accidental en móviles.
- Desarrollar el componente de barra inferior nativa.
- Implementar las vistas consumiendo los datos generados por los Server Components.

**Fase 4: Seguridad y Pruebas**

- Escribir el middleware.js para la autenticación básica.
- Definir variables de entorno locales .env.local con un usuario y contraseña de prueba.
- Probar el rendimiento y la legibilidad del diseño forzando las vistas de desarrollo a resoluciones de dispositivos móviles (ej. iPhone 14 / Android genérico).

**Fase 5: Despliegue en Vercel**

- Vincular el repositorio de GitHub con un nuevo proyecto en Vercel.
- Cargar las variables de entorno de producción (incluyendo la llave privada de GCP formateada correctamente).
- Ejecutar el despliegue final y entregar el enlace seguro a la administradora.
