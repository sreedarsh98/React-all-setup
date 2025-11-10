import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axiosinstance";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const SortProduct = () => {
  const navigate = useNavigate();

  const goToDetail = (id) => {
    navigate(`/dashboard/products/${id}`);
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(""); // ✅ NEW — sorting state

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Main fetch function with search + sort
  const fetchProducts = async (
    searchTerm = "",
    sortValue = sort // default to current sorting
  ) => {
    try {
      setLoading(true);

      let url = "";

      if (searchTerm) {
        url = `/products/search?q=${searchTerm}`;
      } else {
        url = `/products?limit=0`;
      }
      // ✅ Add sorting to URL
      if (sortValue) {
        const [sortBy, order] = sortValue.split(":"); // e.g. "price:asc"
        url += `&sortBy=${sortBy}&order=${order}`;
      }

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

  // ✅ debounced search
  const debouncedSearch = useCallback(() => {
    const handler = setTimeout(() => {
      fetchProducts(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search, sort]);

  useEffect(() => {
    debouncedSearch();
  }, [search]);

  // ✅ Sorting trigger
  useEffect(() => {
    fetchProducts(search, sort);
  }, [sort]);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Products</h1>
        <div className="product-search d-flex align-items-center gap-3">
          <p>Browse available products</p>

          {/* ✅ Search Input */}
          <input
            placeholder="Search products"
            className="form-control w-50 rounded"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* ✅ Sorting Dropdown */}
          <select
            className="form-select w-auto"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by</option>

            <option value="price:asc">Price: Low → High</option>
            <option value="price:desc">Price: High → Low</option>

            <option value="rating:desc">Rating: High → Low</option>
            <option value="rating:asc">Rating: Low → High</option>

            <option value="title:asc">Title: A → Z</option>
            <option value="title:desc">Title: Z → A</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="products-grid">
          {products.map((product) => (
            <div
              onClick={() => goToDetail(product.id)}
              key={product.id}
              className="product-card"
            >
              <div className="product-image">
                <img loading="lazy" src={product.thumbnail} alt={product.title} />
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

export default SortProduct;
