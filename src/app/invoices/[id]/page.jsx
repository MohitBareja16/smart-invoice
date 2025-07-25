'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from '@/components/InvoicePDF';
import React from 'react';

export default function InvoiceDetailPage({ params }) {
  const { id } = React.use(params);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setInvoice(result.data);
        } else {
          throw new Error(result.error || 'Invoice not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Invoice</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/invoices')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Invoice #{invoice.invoiceNumber}</h1>
          <p className="text-gray-600 mt-2">
            Created on {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <PDFDownloadLink 
            document={<InvoicePDF invoice={invoice} />}
            fileName={`invoice_${invoice.invoiceNumber}.pdf`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
          >
            Download PDF
          </PDFDownloadLink>
          
          <button
            onClick={() => router.push('/invoices')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium"
          >
            Back to List
          </button>
        </div>
      </div>
      
      {/* PDF Preview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Invoice PDF Preview</h2>
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg border border-gray-200 p-4 flex justify-center items-center min-h-[60vh] max-h-[80vh] overflow-auto">
          <PDFViewer
            width="100%"
            height="600"
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              minWidth: "320px",
              maxWidth: "100%",
              background: "#fff"
            }}
            showToolbar={true}
          >
            <InvoicePDF invoice={invoice} />
          </PDFViewer>
        </div>
      </div>
      
      {/* Invoice Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">From</h3>
            <p className="font-medium">{invoice.sender.name}</p>
            <p className="text-gray-600">{invoice.sender.address}</p>
            {invoice.sender.gstin && (
              <p className="text-gray-600">GSTIN: {invoice.sender.gstin}</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">To</h3>
            <p className="font-medium">{invoice.recipient.name}</p>
            <p className="text-gray-600">{invoice.recipient.address}</p>
            {invoice.recipient.gstin && (
              <p className="text-gray-600">GSTIN: {invoice.recipient.gstin}</p>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                <span className="font-medium">₹{invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2 text-lg font-bold">
                <span>Total:</span>
                <span>₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {invoice.notes && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-600">{invoice.notes}</p>
          </div>
        )}
      </div>
    </main>
  );
}