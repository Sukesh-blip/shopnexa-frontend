
import React from 'react';
import './assets/styles.css';

export function ProductList({ products, onAddToCart }) {
  if (products.length === 0) {
    return <p className="no-products">No products available.</p>;
  }

  return (
    <div className="product-list">
      <div className="product-grid">
        {Array.isArray(products) && products.map((product) => (
          <div key={product.productId || product.product_id} className="product-card glass-card">
            <img
              src={product.images?.[0] || product.image_url || product.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNFMkU4RjAiLz48cGF0aCBkPSJNNzUgNjBMMTEwIDExMEg0MEw3NSA2MFoiIGZpbGw9IiM5NEE0QjgiLz48L3N2Zz4='}
              alt={product.name}
              className="product-image"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNFMkU4RjAiLz48cGF0aCBkPSJNNzUgNjBMMTEwIDExMEg0MEw3NSA2MFoiIGZpbGw9IiM5NEE0QjgiLz48L3N2Zz4=';
              }}
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-card-footer">
                <p className="product-price">₹{product.price}</p>
                <button
                  className="add-to-cart-btn primary-gradient"
                  onClick={() => onAddToCart(product.productId || product.product_id)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}