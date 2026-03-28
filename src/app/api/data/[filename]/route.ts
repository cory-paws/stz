import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // Security check: Only allow .json files and prevent directory traversal
    if (!filename.endsWith('.json') || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    const fileContents = await fs.readFile(filePath, 'utf8');
    
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    console.error(`Failed to read game data file ${params.filename}:`, error);
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  }
}
