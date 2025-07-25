import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ['sales', 'purchase', 'receipt'], default: 'sales' },
  date: { type: Date, default: Date.now },
  dueDate: Date,
  sender: {
    name: String,
    address: String,
    gstin: String,
  },
  recipient: {
    name: String,
    address: String,
    gstin: String,
  },
  items: [{
    description: String,
    quantity: Number,
    price: Number,
    amount: Number,
  }],
  subtotal: Number,
  taxRate: Number,
  taxAmount: Number,
  total: Number,
  notes: String,
}, { timestamps: true });

// Pre-save hook to calculate amounts and totals
invoiceSchema.pre('save', function(next) {
  // Calculate item amounts
  this.items.forEach(item => {
    item.amount = item.quantity * item.price;
  });

  // Calculate subtotal (sum of item amounts)
  this.subtotal = this.items.reduce((sum, item) => sum + item.amount, 0);

  // Calculate tax amount (if taxRate is provided)
  if (this.taxRate) {
    this.taxAmount = this.subtotal * (this.taxRate / 100);
  } else {
    this.taxAmount = 0;
  }

  // Calculate total
  this.total = this.subtotal + this.taxAmount;

  next();
});

// Create the model if it doesn't exist, otherwise use the existing model
export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);