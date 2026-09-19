import { NextResponse } from 'next/server';
import { updateDeliveryDateInGoogleSheets } from '@/lib/googleSheets';

export async function POST(request) {
  try {
    const body = await request.json();
    const { usuarioId, nombre, fechaEntrega } = body;

    // Validación de campos requeridos
    if (!usuarioId || !nombre || !fechaEntrega) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son obligatorios (ID, Nombre y Fecha de Entrega).' },
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
      await updateDeliveryDateInGoogleSheets({
        usuarioId,
        fechaEntrega,
      });

      return NextResponse.json({
        success: true,
        message: `Entrega de motocicleta registrada exitosamente para ${nombre} (${usuarioId}) con fecha ${fechaEntrega}.`,
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
    console.error('Error al registrar entrega en API:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error interno del servidor al registrar la entrega.' },
      { status: 500 }
    );
  }
}
