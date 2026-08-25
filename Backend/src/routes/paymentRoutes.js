const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  handleWebhook,
} = require('../controllers/paymentController');
const verifyWebhookSignature = require('../middleware/verifyWebhookSignature');

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/webhook', verifyWebhookSignature, handleWebhook);

module.exports = router;