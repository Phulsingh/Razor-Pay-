const crypto = require('crypto');

const key_secret = '1IGZM0N5jb1ZzmTDxF4763ln'; // paste your actual RAZORPAY_KEY_SECRET here
const order_id = 'order_TSjAiPFkI6Vqyq';   // use the real order_id you got earlier
const payment_id = 'pay_test_manual123';   // any fake string is fine here

const signature = crypto
  .createHmac('sha256', key_secret)
  .update(`${order_id}|${payment_id}`)
  .digest('hex');

console.log('Generated signature:', signature);