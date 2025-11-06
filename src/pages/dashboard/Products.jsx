import React, { useState, useEffect } from 'react';
import api from '../../api/axiosinstance';
import './Dashboard.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products?limit=10');
      setProducts(response.data.products);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Products</h1>
        <p>Browse available products</p>
      </div>
      
      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {!loading && !error && (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.thumbnail} alt={product.title} />
              </div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price}</span>
                  <span className="product-rating">⭐ {product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

