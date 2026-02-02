import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import api from "./services/api";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Razorpay key (env):", import.meta.env.VITE_RAZORPAY_KEY);
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await api.get("/api/cart/items");
        const products = res.data?.cart?.products || [];

        setCartItems(products);
        const total = products.reduce(
          (sum, item) => sum + Number(item.total_price || 0),
          0
        );
        setSubtotal(total.toFixed(2));
      } catch (err) {
        console.error("Failed to load cart", err);
      }
    };

    fetchCartItems();
  }, []);

  const handleCheckout = async () => {
    try {
      if (!import.meta.env.VITE_RAZORPAY_KEY) {
        alert("Razorpay key missing. Check environment variables.");
        return;
      }

      const orderRes = await api.post("/api/payment/create", {
        totalAmount: subtotal,
      });

      const orderId = orderRes.data;
      console.log("Razorpay Order ID:", orderId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: Math.round(Number(subtotal) * 100),
        currency: "INR",
        name: "ShopNexa",
        description: "Order Payment",
        order_id: orderId,
        handler: async (response) => {
          try {
            await api.post("/api/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              username,
            });

            alert("Payment successful!");
            navigate("/orders");
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: username,
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Payment failed");
    }
  };

  return (
    <div style={{ width: "100vw" }}>
      <Header cartCount={cartItems.length} username={username} />

      <div className="cart-container">
        <div className="cart-page">
          <h2>Shopping Cart</h2>

          {cartItems.map((item) => (
            <div key={item.product_id} className="cart-item">
              <span>{item.name}</span>
              <span>₹{item.total_price}</span>
            </div>
          ))}
        </div>

        <div className="checkout-section">
          <h3>Subtotal: ₹{subtotal}</h3>
          <button className="checkout-button" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
