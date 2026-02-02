// ShopNexa Configuration
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ Production Warning: VITE_API_BASE_URL is missing! Requests will fail.");
}

if (!RAZORPAY_KEY || RAZORPAY_KEY === 'undefined') {
  console.warn("⚠️ Production Warning: VITE_RAZORPAY_KEY is missing! Checkout will fail.");
}

// Payment Configuration
export const PAYMENT_CONFIG = {
  currency: "INR",
  merchantName: "ShopNexa",
  description: "Purchase Products"
};
