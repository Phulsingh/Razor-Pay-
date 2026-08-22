const crypto = require('crypto');

// Razorpay requires the RAW body for webhook signature verification,
// so this must run on the raw buffer, before express.json() parses it.
function verifyWebhookSignature(req, res, next) {
  const signature = req.headers['x-razorpay-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
  }
  next();
}

module.exports = verifyWebhookSignature;