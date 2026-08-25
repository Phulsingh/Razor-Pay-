const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Capture raw body ONLY for the webhook route (needed for signature check)
app.use(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    req.rawBody = req.body; // raw buffer
    req.body = JSON.parse(req.body.toString()); // parse for controller use
    next();
  }
);

app.use(express.json()); // normal JSON parsing for everything else

app.use('/api/payment', paymentRoutes);

module.exports = app;