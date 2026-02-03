import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import api from "./services/api";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState("0.00");
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    api.get("/api/cart/items").then((res) => {
      const products = res.data?.cart?.products || [];
      setCartItems(products);
      const total = products.reduce(
        (sum, p) => sum + Number(p.total_price || 0),
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

    const sdkReady = await loadRazorpay();
    if (!sdkReady) {
      alert("❌ Razorpay SDK failed to load.");
      return;
    }

    const orderRes = await api.post("/api/payment/create", {
      totalAmount: subtotal,
    });

    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(Number(subtotal) * 100),
      currency: "INR",
      name: "ShopNexa",
      order_id: orderRes.data,
      handler: async (res) => {
        await api.post("/api/payment/verify", {
          razorpayOrderId: res.razorpay_order_id,
          razorpayPaymentId: res.razorpay_payment_id,
          razorpaySignature: res.razorpay_signature,
          username,
        });
        navigate("/orders");
      },
      theme: { color: "#6366f1" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="page-layout">
      <Header cartCount={cartItems.length} username={username} />

      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.product_id}>
              {item.name} × {item.quantity} — ₹{item.total_price}
            </div>
          ))}
        </div>

        <div className="checkout-section">
          <h3>Total: ₹{subtotal}</h3>
          <button onClick={handleCheckout}>Secure Checkout</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
