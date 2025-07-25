import dbConnect from '@/lib/dbConnect';
import Invoice from '@/models/Invoice';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  
  try {
    const data = await request.json();
    
    // Generate invoice number (INV-YYYYMMDD-001)
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    
    // Find the latest invoice for today
    const lastInvoice = await Invoice.findOne({
      invoiceNumber: new RegExp(`^INV-${dateStr}-\\d{3}$`)
    }).sort({ createdAt: -1 });
    
    // Determine the next sequence number
    let sequenceNumber = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const lastSeq = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      sequenceNumber = lastSeq + 1;
    }
    
    // Format the invoice number with leading zeros
    const formattedSequence = sequenceNumber.toString().padStart(3, '0');
    const invoiceNumber = `INV-${dateStr}-${formattedSequence}`;
    
    // Create the invoice with generated number
    const invoice = new Invoice({
      ...data,
      invoiceNumber
    });
    
    await invoice.save();
    
    return NextResponse.json(
      { 
        success: true, 
        data: invoice,
        message: `Invoice ${invoiceNumber} created successfully!`
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving invoice:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create invoice',
        message: 'Please check your input and try again.'
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  await dbConnect();
  
  try {
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    
    // Ensure we always return valid JSON
    if (!invoices) {
      return NextResponse.json(
        { success: false, error: "No invoices found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        data: invoices,
        message: "Invoices retrieved successfully"
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to fetch invoices",
        message: "Please try again later"
      },
      { status: 500 }
    );
  }
}