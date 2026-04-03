import { NextResponse } from 'next/server';
import { allGameData } from '../../../../data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    const data = allGameData[filename];
    
    if (!data) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Failed to handle game data request:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
