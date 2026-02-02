import React, { useState, useEffect } from 'react';
import { CategoryNavigation } from './CategoryNavigation';
import { ProductList } from './ProductList';
import { Footer } from './Footer';
import { Header } from './Header';
import api from './services/api';
import './assets/styles.css';

export default function CustomerHomePage() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [cartError, setCartError] = useState(false); // State for cart fetch error
  const [isCartLoading, setIsCartLoading] = useState(true); // State for cart loading


  useEffect(() => {
    fetchProducts();
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      fetchCartCount();
    }
  }, []); // Run on mount, dependency on username removed to handle manual updates better

  const fetchProducts = async (category = '') => {
    try {
      const response = await api.get('/api/products', {
        params: category ? { category } : {}
      });
      const data = response.data;

      if (data) {
        // Only update username if the API explicitly provides it, otherwise keep current from localStorage
        const nameFromApi = data.user?.name || data.username;
        if (nameFromApi && nameFromApi !== 'Guest') {
          setUsername(nameFromApi);
          localStorage.setItem('username', nameFromApi);
        }

        // Handle different possible response structures
        let productsList = [];
        if (Array.isArray(data)) {
          productsList = data;
        } else if (data.products && Array.isArray(data.products)) {
          productsList = data.products;
        } else if (data.content && Array.isArray(data.content)) {
          productsList = data.content;
        }

        setProducts(productsList);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchCartCount = async () => {
    setIsCartLoading(true); // Set loading state
    try {
      const response = await api.get(`/api/cart/items/count`, {
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

  const handleCategoryClick = (category) => {
    fetchProducts(category);
  };

  const handleAddToCart = async (productId) => {
    if (!username) {
      console.error('Username is required to add items to the cart');
      return;
    }
    try {
      const response = await api.post('/api/cart/add', {
        username,
        productId
      });

      if (response.status === 200 || response.status === 201) {
        fetchCartCount(); // Update cart count
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div className="customer-homepage">
      <Header
        cartCount={isCartLoading ? '...' : cartError ? 'Error' : cartCount}
        username={username}
      />
      <nav className="navigation">
        <CategoryNavigation onCategoryClick={handleCategoryClick} />
      </nav>
      <main className="main-content">
        <ProductList products={products} onAddToCart={handleAddToCart} />
      </main>
      <Footer />
    </div>
  );
}
