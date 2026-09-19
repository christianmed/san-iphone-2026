import { NextResponse } from 'next/server';
import { getTandaData } from '@/lib/dataFetcher';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getTandaData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al obtener datos de la tanda:', error);
    return NextResponse.json(
      { error: 'Error al procesar los datos de la tanda', details: error.message },
      { status: 500 }
    );
  }
}
