const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const Order = require('../models/Order');

// Step 1: Create an order — called when user clicks "Pay Now"
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // ALWAYS validate/derive amount server-side.
    // Never trust an amount sent from the frontend for real products —
    // look it up from your cart/product collection instead.
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise (smallest unit)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const order = await Order.create({
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      status: 'created',
      userId: req.user?._id, // if you have auth middleware
      notes,
    });

    return res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // public key, safe to send
    });
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ success: false, message: 'Order creation failed' });
  }
};

// Step 2: Verify payment after checkout completes on frontend
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      return res.status(400).json({ success: false, message: 'Invalid signature — payment not verified' });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    // TODO: trigger your business logic here — mark order fulfilled,
    // send confirmation email, decrement inventory, etc.

    return res.status(200).json({ success: true, message: 'Payment verified', order });
  } catch (err) {
    console.error('verifyPayment error:', err);
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
};