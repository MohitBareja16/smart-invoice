import dbConnect from '@/lib/dbConnect';
import Invoice from '@/models/Invoice';

export async function GET() {
  await dbConnect();

  // Create a test invoice
  const testInvoice = new Invoice({
    invoiceNumber: 'TEST-001',
    sender: {
      name: 'Test Sender',
      address: '123 Test St, Testville',
      gstin: 'GSTIN123',
    },
    recipient: {
      name: 'Test Recipient',
      address: '456 Test Ave, Test City',
      gstin: 'GSTIN456',
    },
    items: [
      {
        description: 'Test Item 1',
        quantity: 2,
        price: 100,
      },
      {
        description: 'Test Item 2',
        quantity: 1,
        price: 200,
      },
    ],
    taxRate: 18,
    notes: 'This is a test invoice.',
  });

  try {
    await testInvoice.save();
    return new Response(JSON.stringify({ success: true, data: testInvoice }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}