import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Client from '@/models/Client';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  try {
    const clients = await Client.find({});
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = await request.json();
    const client = await Client.create(data);
    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create client' },
      { status: 400 }
    );
  }
}
