import { NextResponse } from 'next/server';
import { appendPaymentToGoogleSheets } from '@/lib/googleSheets';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fecha, usuarioId, nombre, monto } = body;

    // Validación de campos requeridos
    if (!usuarioId || !nombre || monto === undefined || monto === null || !fecha) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son obligatorios (ID, Nombre, Monto y Fecha).' },
        { status: 400 }
      );
    }

    const numMonto = Number(monto);
    if (isNaN(numMonto) || numMonto <= 0) {
      return NextResponse.json(
        { success: false, error: 'El monto ingresado debe ser un número mayor a 0.' },
        { status: 400 }
      );
    }

    // Verificar si hay credenciales de Google Sheets configuradas
    const useGoogleSheets = Boolean(
      process.env.SPREADSHEET_ID &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
    );

    if (useGoogleSheets) {
      await appendPaymentToGoogleSheets({
        fecha,
        usuarioId,
        nombre,
        monto: numMonto,
      });

      return NextResponse.json({
        success: true,
        message: `Abono de $${numMonto} registrado exitosamente para ${nombre} en Google Sheets.`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'No se encontraron las credenciales de Google Sheets API en el servidor.',
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('Error al registrar pago en API:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error interno del servidor al procesar el abono.' },
      { status: 500 }
    );
  }
}
