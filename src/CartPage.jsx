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
        alert("Payment Error: Razorpay Key is not set in production.");
        return;
      }

      const orderRes = await api.post("/api/payment/create", {
        totalAmount: subtotal,
      });

      const orderId = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: Math.round(Number(subtotal) * 100),
        currency: "INR",
        name: "ShopNexa",
        description: "Official ShopNexa Purchase",
        order_id: orderId,
        handler: async (response) => {
          try {
            await api.post("/api/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              username,
            });

            alert("✨ Transaction Successful! Thank you for shopping.");
            navigate("/orders");
          } catch (err) {
            console.error("Verification failed", err);
          }
        },
        prefill: {
          name: username,
          email: "support@shopnexa.com",
        },
        theme: {
          color: "#6366f1", // Match our indigo primary
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout failed", err);
    }
  };

  const handleQuantityChange = async (productId, delta) => {
    // Optimistic UI update or API call logic would go here
    console.log("Change quantity for", productId, delta);
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete('/api/cart/delete', { data: { username, productId } });
      setCartItems(prev => prev.filter(item => item.product_id !== productId));
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-layout">
        <Header cartCount={0} username={username} />
        <div className="cart-empty">
          <h2 className="text-gradient">Your Cart is a bit lonely.</h2>
          <p style={{ color: 'var(--text-dim)' }}>Explore our latest collection and find something special.</p>
          <button onClick={() => navigate('/customerhome')}>Start Shopping</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Header cartCount={cartItems.length} username={username} />

      <div className="cart-container">
        <div className="cart-page">
          <div className="cart-header">
            <h2 className="text-gradient">Your Selection</h2>
            <p>Ready to bring these home?</p>
          </div>

          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product_id} className="cart-item glass-card">
                <img src={item.image_url || 'data:image/svg+xml;base64,...'} alt={item.name} />
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>SKU: SN-{item.product_id.toString().padStart(4, '0')}</p>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls luxe-controls">
                      <button className="qty-btn" onClick={() => handleQuantityChange(item.product_id, -1)}>−</button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => handleQuantityChange(item.product_id, 1)}>+</button>
                    </div>
                    <span className="price">₹{item.total_price}</span>
                    <button className="remove-btn luxe-remove" onClick={() => handleRemove(item.product_id)}>
                      <span style={{ fontSize: '1.2rem' }}>×</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="checkout-section glass-panel">
          <h2>Order Summary</h2>
          <div className="checkout-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span style={{ color: 'var(--success)' }}>FREE</span>
            </div>
            <div className="summary-row">
              <span>Tax (GST)</span>
              <span>₹0.00</span>
            </div>

            <div className="summary-row total">
              <span>Grand Total</span>
              <span>₹{subtotal}</span>
            </div>

            <button className="checkout-button primary-gradient" onClick={handleCheckout}>
              Secure Checkout
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🔒 Safe & Secure Payments via Razorpay
            </p>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
