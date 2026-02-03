import React, { useState, useEffect } from 'react';
import { CategoryNavigation } from './CategoryNavigation';
import { Header } from './Header';
import { Footer } from './Footer';
import api from './services/api';
import './assets/styles.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState('');
  const [cartError, setCartError] = useState(false); // State for cart fetch error
  const [isCartLoading, setIsCartLoading] = useState(true); // State for cart loading

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update cart count when orders or username changes
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchCartCount();
    }
  }, [orders, username]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders');
      const data = response.data;
      setOrders(data.products || []);
      setUsername(data.username || 'Guest'); // Extract username
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    setIsCartLoading(true); // Set loading state
    try {
      const response = await api.get('/api/cart/items/count', {
        params: { username }
      });
      setCartCount(response.data);
      setCartError(false); // Reset error state if successful
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartError(true); // Set error state
    } finally {
      setIsCartLoading(false); // Remove loading state
    }
  };

  return (
    <div className="page-layout">
      <Header
        cartCount={isCartLoading ? '...' : cartError ? 'Error' : cartCount}
        username={username}
      />
      <main className="main-content">
        <h1 className="form-title text-gradient">Order History</h1>
        {loading && <div className="loading-state">Syncing your orders...</div>}
        {error && <p className="error-message">Connection failed: {error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="cart-empty">
            <h2>No orders yet.</h2>
            <p style={{ color: 'var(--text-dim)' }}>Your fashion journey starts here.</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list" style={{ display: 'grid', gap: '24px' }}>
            {orders.map((order, index) => (
              <div key={index} className="order-card glass-card" style={{ padding: '24px', display: 'flex', gap: '32px', alignItems: 'center' }}>
                <img
                  src={order.image_url || 'data:image/svg+xml;base64,...'}
                  alt={order.name}
                  className="order-product-image"
                  style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div className="order-details" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>ORDER ID: {order.order_id}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>CONFIRMED</span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{order.name}</h2>
                  <p style={{ color: 'var(--text-dim)', marginBottom: '16px', fontSize: '0.9rem' }}>{order.description}</p>

                  <div style={{ display: 'flex', gap: '40px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                    <div>
                      <small style={{ display: 'block', color: 'var(--text-muted)' }}>Quantity</small>
                      <strong>{order.quantity} Units</strong>
                    </div>
                    <div>
                      <small style={{ display: 'block', color: 'var(--text-muted)' }}>Price Unit</small>
                      <strong>₹{order.price_per_unit.toFixed(2)}</strong>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <small style={{ display: 'block', color: 'var(--text-muted)' }}>Total Amount</small>
                      <strong style={{ fontSize: '1.25rem' }}>₹{order.total_price.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
