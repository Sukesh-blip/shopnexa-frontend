// ShopNexa Configuration - Re-trigger build for environment variables
// Razorpay Configuration
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Payment Configuration
export const PAYMENT_CONFIG = {
  currency: "INR",
  merchantName: "ShopNexa",
  description: "Purchase Products"
};
