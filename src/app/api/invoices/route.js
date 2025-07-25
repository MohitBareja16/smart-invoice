
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Invoice from '@/models/Invoice';

export async function GET() {
  try {
    await dbConnect();
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: invoices,
      message: "Invoices retrieved successfully"
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: "Failed to fetch invoices"
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    
    // Find last invoice for today
    const lastInvoice = await Invoice.findOne({
      invoiceNumber: new RegExp(`^INV-${dateStr}-\\d{3}$`)
    }).sort({ createdAt: -1 });
    
    // Determine next sequence
    let sequenceNumber = 1;
    if (lastInvoice?.invoiceNumber) {
      const lastSeq = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      if (!isNaN(lastSeq)) sequenceNumber = lastSeq + 1;
    }
    
    // Generate invoice number
    const invoiceNumber = `INV-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
    
    // Create and save invoice
    const invoice = new Invoice({ ...data, invoiceNumber });
    await invoice.save();
    
    return NextResponse.json({ 
      success: true, 
      data: invoice,
      message: `Invoice ${invoiceNumber} created!`
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: "Invoice creation failed"
    }, { status: 400 });
  }
}