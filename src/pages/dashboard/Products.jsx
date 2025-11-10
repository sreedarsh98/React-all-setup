import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axiosinstance";
import "./Dashboard.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (searchTerm = "") => {
    try {
      setLoading(true);
      const url = searchTerm
        ? `/products/search?q=${searchTerm}`
        : `/products?limit=0`;
      const response = await api.get(url);
      setProducts(response.data.products);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };


  const debouncedSearch = useCallback(() => {
    const handler = setTimeout(() => {
      fetchProducts(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);



  useEffect(() => {
    debouncedSearch();
  }, [search, debouncedSearch]);



  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Products</h1>
        <div className="product-search">
          <p>Browse available products</p>
          <input
            placeholder="Search products"
            className="form-control w-50 rounded"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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


