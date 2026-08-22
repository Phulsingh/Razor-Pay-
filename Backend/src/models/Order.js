const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true }, // in paise
    currency: { type: String, default: 'INR' },
    receipt: { type: String },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);