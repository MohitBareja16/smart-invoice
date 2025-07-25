import dbConnect from '@/lib/dbConnect';
import Invoice from '@/models/Invoice';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    const invoice = await Invoice.findById(params.id);
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        data: invoice,
        message: "Invoice retrieved successfully"
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to fetch invoice",
        message: "Please try again later"
      },
      { status: 500 }
    );
  }
}