// Razorpay Configuration
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_S7c3q6b6elxF9D"; // Updated with env var

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

// Payment Configuration
export const PAYMENT_CONFIG = {
  currency: "INR",
  merchantName: "ShopNexa",
  description: "Purchase Products"
};
