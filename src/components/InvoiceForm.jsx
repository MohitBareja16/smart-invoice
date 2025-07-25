'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvoiceForm() {
  // State for invoice data
  const [invoice, setInvoice] = useState({
    type: 'sales',
    sender: { name: '', address: '', gstin: '' },
    recipient: { name: '', address: '', gstin: '' },
    items: [{ description: '', quantity: 1, price: 0 }],
    taxRate: 18,
    notes: '',
  });

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [createdInvoice, setCreatedInvoice] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (sender and recipient)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setInvoice(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setInvoice(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    
    // Convert to number for quantity and price
    if (field === 'quantity' || field === 'price') {
      value = field === 'quantity' 
        ? parseInt(value) || 0 
        : parseFloat(value) || 0;
    }
    
    newItems[index][field] = value;
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  // Add new item row
  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  // Remove item row
  const removeItem = (index) => {
    if (invoice.items.length <= 1) return; // Prevent removing all items
    
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  // Calculate invoice totals
  const calculateTotals = () => {
    // Calculate item amounts and subtotal
    const itemsWithAmounts = invoice.items.map(item => ({
      ...item,
      amount: item.quantity * item.price
    }));
    
    const subtotal = itemsWithAmounts.reduce(
      (sum, item) => sum + item.amount, 
      0
    );
    
    // Calculate tax and total
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount;
    
    return { itemsWithAmounts, subtotal, taxAmount, total };
  };

  // Get calculated values
  const { itemsWithAmounts, subtotal, taxAmount, total } = calculateTotals();

  // Form validation
  const validateForm = () => {
    // Validate sender details
    if (!invoice.sender.name.trim()) {
      return 'Please enter your company name';
    }
    
    // Validate recipient details
    if (!invoice.recipient.name.trim()) {
      return 'Please enter client name';
    }
    
    // Validate items
    for (const item of invoice.items) {
      if (!item.description.trim()) {
        return 'All items must have a description';
      }
      if (item.price <= 0) {
        return 'Item price must be greater than zero';
      }
    }
    
    return null;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({
        type: 'error',
        message: validationError,
      });
      return;
    }
  
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Prepare data with calculated values
      const payload = {
        ...invoice,
        subtotal,
        taxAmount,
        total,
        items: itemsWithAmounts,
      };
      
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error');
      }
      
      const result = await response.json();
      
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
          invoiceNumber: result.data.invoiceNumber,
        });
        setCreatedInvoice(result.data);
        
        // Reset form after successful submission
        setInvoice({
          type: 'sales',
          sender: { name: '', address: '', gstin: '' },
          recipient: { name: '', address: '', gstin: '' },
          items: [{ description: '', quantity: 1, price: 0 }],
          taxRate: 18,
          notes: '',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to create invoice. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear status messages after 5 seconds
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      {/* Invoice Type Selector */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Invoice Type</label>
        <div className="flex space-x-4">
          {['sales', 'purchase', 'receipt'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="type"
                value={type}
                checked={invoice.type === type}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sender and Recipient Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Sender Details */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="sender.name"
                placeholder="Your Company Name"
                className="w-full p-2 border rounded"
                value={invoice.sender.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Address</label>
              <textarea
                name="sender.address"
                placeholder="Full Address"
                className="w-full p-2 border rounded"
                value={invoice.sender.address}
                onChange={handleChange}
                rows="2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">GSTIN</label>
              <input
                type="text"
                name="sender.gstin"
                placeholder="GST Identification Number"
                className="w-full p-2 border rounded"
                value={invoice.sender.gstin}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Recipient Details */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Client Details</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="recipient.name"
                placeholder="Client or Company Name"
                className="w-full p-2 border rounded"
                value={invoice.recipient.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Address</label>
              <textarea
                name="recipient.address"
                placeholder="Client Address"
                className="w-full p-2 border rounded"
                value={invoice.recipient.address}
                onChange={handleChange}
                rows="2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">GSTIN</label>
              <input
                type="text"
                name="recipient.gstin"
                placeholder="Client GSTIN (if applicable)"
                className="w-full p-2 border rounded"
                value={invoice.recipient.gstin}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Items</h2>
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
            onClick={addItem}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-center w-24">Qty</th>
                <th className="border p-2 text-right w-32">Price (₹)</th>
                <th className="border p-2 text-right w-32">Amount (₹)</th>
                <th className="border p-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {itemsWithAmounts.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <input
                      type="text"
                      placeholder="Item description"
                      className="w-full p-1 border rounded"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="1"
                      className="w-full p-1 border rounded text-center"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full p-1 border rounded text-right"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    />
                  </td>
                  <td className="border p-2 text-right font-mono">
                    ₹{item.amount.toFixed(2)}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(index)}
                      disabled={invoice.items.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax and Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              className="w-full p-2 border rounded"
              value={invoice.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Payment terms, special instructions, etc."
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              className="w-full p-2 border rounded"
              value={invoice.taxRate}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-lg border">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
              <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-3 mt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-medium"
        >
          Save Draft
        </button>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : 'Create Invoice'}
        </button>
      </div>

      {/* Submission Status */}
      {submitStatus && (
        <div className={`mt-4 p-3 rounded ${
          submitStatus.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {submitStatus.message}
          {submitStatus.type === 'success' && submitStatus.invoiceNumber && (
            <div className="mt-2 font-medium">
              Invoice Number: {submitStatus.invoiceNumber}
            </div>
          )}
        </div>
      )}
    </form>
  );
}