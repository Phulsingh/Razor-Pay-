import { useState } from 'react';
import type { RazorpayOptions, RazorpayPaymentResponse } from '../types/razorpay';

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
}

interface CheckoutProps {
  amount: number;
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout({ amount }: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Check your internet connection.');
        return;
      }

      // Step 1: create order via backend
      const orderRes = await fetch(`${API_BASE}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const orderData: CreateOrderResponse = await orderRes.json();

      if (!orderData.success) {
        alert('Could not create order. Try again.');
        return;
      }

      // Step 2: open Razorpay Checkout
      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Deccansoft Test Store',
        description: 'Test Transaction',
        order_id: orderData.orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          // Step 3: verify payment with backend
          const verifyRes = await fetch(`${API_BASE}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData: VerifyResponse = await verifyRes.json();

          setStatus(verifyData.success ? 'success' : 'failed');
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', () => {
        setStatus('failed');
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
       <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-600 mb-20 cursor-pointer text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>

      {status === 'success' && (
        <p style={{ color: 'green', marginTop: '20px' }}>
          ✅ Payment successful and verified!
        </p>
      )}
      {status === 'failed' && (
        <p style={{ color: 'red', marginTop: '20px' }}>
          ❌ Payment failed or verification failed.
        </p>
      )}
    </div>
  );
}