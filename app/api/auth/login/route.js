import { NextResponse } from 'next/server';
import { getTandaData } from '@/lib/dataFetcher';
import { authenticatePin } from '@/lib/authHelper';

export async function POST(request) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json(
        { success: false, error: 'Debe ingresar un PIN de 8 dígitos.' },
        { status: 400 }
      );
    }

    const data = await getTandaData();
    const adminPin = process.env.ADMIN_PIN || '12345678';

    const authResult = authenticatePin(pin, {
      adminPin,
      participants: data?.participants || [],
    });

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      role: authResult.role,
      user: authResult.user,
    });
  } catch (err) {
    console.error('Error al procesar autenticación:', err);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor al autenticar.' },
      { status: 500 }
    );
  }
}
