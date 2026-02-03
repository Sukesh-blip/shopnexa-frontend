import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import api from "./services/api";

// ✅ Build-time injected constant
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [username] = useState(localStorage.getItem("username") || "");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/cart/items").then((res) => {
      const products = res.data?.cart?.products || [];
      setCartItems(products);
      const total = products.reduce(
        (sum, item) => sum + Number(item.total_price || 0),
        0
      );
      setSubtotal(total.toFixed(2));
    });
  }, []);

  const handleCheckout = async () => {
    if (!RAZORPAY_KEY) {
      alert("❌ Razorpay key missing at build time.");
      return;
    }

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("❌ Failed to load Razorpay SDK.");
      return;
    }

    const orderRes = await api.post("/api/payment/create", {
      totalAmount: subtotal,
    });

    const orderId = orderRes.data;

    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(Number(subtotal) * 100),
      currency: "INR",
      name: "ShopNexa",
      description: "Official ShopNexa Purchase",
      order_id: orderId,
      handler: async (response) => {
        await api.post("/api/payment/verify", {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          username,
        });
        alert("✅ Payment successful!");
        navigate("/orders");
      },
      prefill: {
        name: username,
        email: "support@shopnexa.com",
      },
      theme: { color: "#6366f1" },
    };

    new window.Razorpay(options).open();
  };

  if (!cartItems.length) {
    return <div className="cart-empty">Your cart is empty</div>;
  }

  return (
    <div className="page-layout">
      <Header cartCount={cartItems.length} username={username} />
      <button onClick={handleCheckout}>Secure Checkout</button>
      <Footer />
    </div>
  );
};

export default CartPage;
