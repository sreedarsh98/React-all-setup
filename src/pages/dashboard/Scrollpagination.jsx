import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../../api/axiosinstance";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Scrollpagination = () => {
  const navigate = useNavigate();

  const goToDetail = (id) => {
    navigate(`/dashboard/products/${id}`);
  };

  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);        // pagination skip
  const [limit] = useState(12);               // how many items per load
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  const loaderRef = useRef(null);

  // ------------------------------
  // ✅ Fetch products (with pagination + search)
  // ------------------------------
  const fetchProducts = async (reset = false) => {
    try {
      setLoading(true);

      const url = search
        ? `/products/search?q=${search}&limit=${limit}&skip=${reset ? 0 : skip}`
        : `/products?limit=${limit}&skip=${reset ? 0 : skip}`;

      const response = await api.get(url);

      const newProducts = response.data.products;

      // If search changed, reset list
      if (reset) {
        setProducts(newProducts);
        setSkip(limit);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
        setSkip((prev) => prev + limit);
      }

      if (newProducts.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setError(null);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchProducts(true);
  }, []);

  // ------------------------------
  // ✅ Infinite scroll observer
  // ------------------------------
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchProducts();  // load next set
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  // ------------------------------
  // ✅ Search (debounced)
  // ------------------------------
  const debouncedSearch = useCallback(() => {
    const timer = setTimeout(() => {
      setSkip(0);
      fetchProducts(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (search.trim() === "") {
      setSkip(0);
      fetchProducts(true);
    } else {
      debouncedSearch();
    }
  }, [search]);

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

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {products.map((product) => (
          <div
            onClick={() => goToDetail(product.id)}
            key={product.id}
            className="product-card"
          >
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

      {/* Infinite scroll loader */}
      <div ref={loaderRef} style={{ height: 40 }}></div>

      {loading && <div className="loading">Loading more products...</div>}
    </div>
  );
};

export default Scrollpagination;
