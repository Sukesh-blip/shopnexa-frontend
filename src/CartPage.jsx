import React, { useEffect, useState } from "react";
import "./CartPage.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import { RAZORPAY_KEY } from "./config";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [overallPrice, setOverallPrice] = useState(0);
  const [username, setUsername] = useState(localStorage.getItem('username') || "");
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate(); // To redirect users after successful payment

  // Fetch cart items on component load
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get('/api/cart/items');
        const data = response.data;

        const rawProducts = data?.cart?.products || data?.products || [];
        setCartItems(
          Array.isArray(rawProducts)
            ? rawProducts.map((item) => ({
              ...item,
              total_price: parseFloat(item.total_price || 0).toFixed(2),
              price_per_unit: parseFloat(item.price_per_unit || 0).toFixed(2),
            }))
            : []
        );
        setOverallPrice(parseFloat(data?.cart?.overall_total_price || 0).toFixed(2));
        if (data?.username) {
          setUsername(data.username);
          localStorage.setItem('username', data.username);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate subtotal whenever cart items change
  useEffect(() => {
    const total = cartItems
      .reduce((total, item) => total + parseFloat(item.total_price), 0)
      .toFixed(2);
    setSubtotal(total);
  }, [cartItems]);

  // Remove item from the cart
  const handleRemoveItem = async (productId) => {
    try {
      const response = await api.delete('/api/cart/delete', {
        data: { username, productId }
      });
      if (response.status === 204) {
        setCartItems((prevItems) => prevItems.filter((item) => (item.product_id || item.productId) !== productId));
      } else throw new Error("Failed to remove item");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Update quantity of an item
  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        handleRemoveItem(productId);
        return;
      }
      const response = await api.put('/api/cart/update', {
        username,
        productId,
        quantity: newQuantity
      });
      if (response.status === 200 || response.status === 204) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            (item.product_id || item.productId) === productId
              ? {
                ...item,
                quantity: newQuantity,
                total_price: (item.price_per_unit * newQuantity).toFixed(2),
              }
              : item
          )
        );
      } else throw new Error("Failed to update quantity");
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Razorpay integration for payment
  const handleCheckout = async () => {
    try {
      const requestBody = {
        totalAmount: subtotal,
        cartItems: cartItems.map((item) => ({
          productId: item.product_id || item.productId,
          quantity: item.quantity,
          price: item.price_per_unit,
        })),
      };

      // Create Razorpay order via backend
      const response = await api.post('/api/payment/create', requestBody);

      const razorpayOrderId = response.data;
      console.log("Razorpay Order ID received:", razorpayOrderId);

      // Open Razorpay checkout interface
      const options = {
        key: {VITE_RAZORPAY_KEY},
        amount: Math.round(parseFloat(subtotal) * 100), // Razorpay expects amount in paise
        currency: "INR",
        name: "ShopNexa",
        description: "Test Transaction",
        order_id: razorpayOrderId,
        handler: async function (payResponse) {
          try {
            // Payment success, verify on backend
            const verifyPayload = {
              username: username, // Pass username for backend cart processing
              razorpayOrderId: payResponse.razorpay_order_id,
              razorpayPaymentId: payResponse.razorpay_payment_id,
              razorpaySignature: payResponse.razorpay_signature,
              // Backup snake_case keys
              razorpay_order_id: payResponse.razorpay_order_id,
              razorpay_payment_id: payResponse.razorpay_payment_id,
              razorpay_signature: payResponse.razorpay_signature,
            };

            console.log("Sending verification payload:", verifyPayload);

            const verifyResponse = await api.post('/api/payment/verify', verifyPayload);

            if (verifyResponse.status === 200) {
              alert("Payment verified successfully!");
              setCartItems([]); // Clear cart locally
              navigate("/orders"); // Redirect to Orders Page so user can see their purchase
            } else {
              alert("Payment verification failed: " + verifyResponse.data);
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment verification failed. Please try again.");
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
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error("Error during checkout:", error);
    }
  };

  const totalProducts = () => cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const shipping = (5.0 * 74).toFixed(2); // Hardcoded shipping value

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some items to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw" }}>
      <Header cartCount={totalProducts()} username={username} />
      <div className="cart-container">
        <div className="cart-page">
          <a href="#" className="back-button">
            ← Shopping Continue
          </a>

          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <p>You have {cartItems.length} items in your cart</p>
          </div>

          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product_id || item.productId} className="cart-item">
                <img
                  src={item.image_url || item.imageUrl || "https://via.placeholder.com/80?text=No+Image"}
                  alt={item.name}
                />
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(item.product_id || item.productId, item.quantity - 1)}>
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.product_id || item.productId, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <span className="price">₹{item.total_price}</span>
                    <button className="remove-btn" onClick={() => handleRemoveItem(item.product_id || item.productId)}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-section">
          <h2>Order Summary</h2>
          <div className="checkout-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>
            <div className="summary-row">
              <span>Total Products</span>
              <span>{totalProducts()}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{(parseFloat(subtotal) + parseFloat(shipping)).toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;