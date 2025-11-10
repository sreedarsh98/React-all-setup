import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axiosinstance";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const PaginationProduct = () => {
  const navigate = useNavigate();

  const goToDetail = (id) => {
    navigate(`/dashboard/products/${id}`);
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const limit = 6; // ✅ show 6 products per page
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts(search, page);
  }, [page]);

  // ✅ Fetch with pagination
  const fetchProducts = async (searchTerm = "", currentPage = 1) => {
    try {
      setLoading(true);

      const skip = (currentPage - 1) * limit;

      const url = searchTerm
        ? `/products/search?q=${searchTerm}&limit=${limit}&skip=${skip}`
        : `/products?limit=${limit}&skip=${skip}`;

      const response = await api.get(url);

      setProducts(response.data.products);
      setTotal(response.data.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounced search
  const debouncedSearch = useCallback(() => {
    const timer = setTimeout(() => {
      setPage(1);                   // Reset to page 1 when searching
      fetchProducts(search, 1);     // Fetch first page of results
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    debouncedSearch();
  }, [search]);

  const totalPages = Math.ceil(total / limit);

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
        <>
          {/* ✅ Products Grid */}
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => goToDetail(product.id)}
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

          {/* ✅ Pagination Controls */}
          <div className="pagination mt-4 d-flex gap-3">
            <button
              className="btn btn-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>

            <span className="fw-bold">
              Page {page} of {totalPages}
            </span>

            <button
              className="btn btn-secondary"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>

          {/* ✅ Page Numbers */}
          <div className="d-flex gap-2 mt-3 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                className={`btn ${
                  number === page ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaginationProduct;













// =================================with sorting
// import React, { useState, useEffect, useCallback } from "react";
// import api from "../../api/axiosinstance";
// import "./Dashboard.css";
// import { useNavigate } from "react-router-dom";

// const PaginationProduct = () => {
//   const navigate = useNavigate();

//   const goToDetail = (id) => {
//     navigate(`/dashboard/products/${id}`);
//   };

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [search, setSearch] = useState("");

//   // ✅ Sorting state
//   const [sort, setSort] = useState("");

//   // ✅ Pagination state
//   const [page, setPage] = useState(1);
//   const limit = 6; 
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     fetchProducts(search, page, sort);
//   }, [page, sort]);

//   // ✅ Fetch with search + pagination + sorting
//   const fetchProducts = async (searchTerm = "", currentPage = 1, sortValue = "") => {
//     try {
//       setLoading(true);

//       const skip = (currentPage - 1) * limit;

//       let url = searchTerm
//         ? `/products/search?q=${searchTerm}&limit=${limit}&skip=${skip}`
//         : `/products?limit=${limit}&skip=${skip}`;

//       // ✅ Add sort parameters
//       if (sortValue) {
//         const [sortBy, order] = sortValue.split(":"); 
//         url += `&sortBy=${sortBy}&order=${order}`;
//       }

//       const response = await api.get(url);

//       setProducts(response.data.products);
//       setTotal(response.data.total);
//       setError(null);
//     } catch (err) {
//       setError("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Debounced search
//   const debouncedSearch = useCallback(() => {
//     const timer = setTimeout(() => {
//       setPage(1);                   
//       fetchProducts(search, 1, sort);  
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search, sort]);

//   useEffect(() => {
//     debouncedSearch();
//   }, [search]);

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="dashboard-page">
//       <div className="page-header">
//         <h1>Products</h1>

//         <div className="product-search d-flex align-items-center gap-3">
//           <p>Browse available products</p>

//           {/* ✅ Search */}
//           <input
//             placeholder="Search products"
//             className="form-control w-50 rounded"
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           {/* ✅ Sorting Dropdown */}
//           <select
//             className="form-select w-auto"
//             onChange={(e) => {
//               setSort(e.target.value);
//               setPage(1);  // reset to page 1 on sorting
//             }}
//           >
//             <option value="">Sort by</option>
//             <option value="price:asc">Price: Low → High</option>
//             <option value="price:desc">Price: High → Low</option>
//             <option value="rating:desc">Rating: High → Low</option>
//             <option value="rating:asc">Rating: Low → High</option>
//             <option value="title:asc">Title: A → Z</option>
//             <option value="title:desc">Title: Z → A</option>
//           </select>
//         </div>
//       </div>

//       {loading && <div className="loading">Loading products...</div>}
//       {error && <div className="error-message">{error}</div>}

//       {!loading && !error && (
//         <>
//           {/* ✅ Product Grid */}
//           <div className="products-grid">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="product-card"
//                 onClick={() => goToDetail(product.id)}
//               >
//                 <div className="product-image">
//                   <img src={product.thumbnail} alt={product.title} />
//                 </div>
//                 <div className="product-info">
//                   <h3>{product.title}</h3>
//                   <p className="product-description">{product.description}</p>
//                   <div className="product-footer">
//                     <span className="product-price">${product.price}</span>
//                     <span className="product-rating">⭐ {product.rating}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ✅ Pagination Controls */}
//           <div className="pagination mt-4 d-flex gap-3">
//             <button
//               className="btn btn-secondary"
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//             >
//               Previous
//             </button>

//             <span className="fw-bold">
//               Page {page} of {totalPages}
//             </span>

//             <button
//               className="btn btn-secondary"
//               disabled={page === totalPages}
//               onClick={() => setPage((p) => p + 1)}
//             >
//               Next
//             </button>
//           </div>

//           {/* ✅ Page Numbers */}
//           <div className="d-flex gap-2 mt-3 flex-wrap">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
//               <button
//                 key={number}
//                 className={`btn ${
//                   number === page ? "btn-primary" : "btn-outline-primary"
//                 }`}
//                 onClick={() => setPage(number)}
//               >
//                 {number}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PaginationProduct;

