"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import productField from "./product.json";
import { buildValidationSchema } from "./validate";

const AddProducts = () => {
  const [products, setProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [editId, setEditId] = useState(null); // NEW: track editing product

  // Convert File → Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  // Initial values setup
  const initialValues = {};
  productField.forEach((item) => {
    initialValues[item.name] = item.type === "file" ? null : "";
  });

  const validationSchema = buildValidationSchema(productField);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (editId) {
        // UPDATE MODE
        const updated = products.map((p) =>
          p.id === editId ? { ...values, id: editId } : p
        );

        localStorage.setItem("products", JSON.stringify(updated));
        setProducts(updated);

        alert("✅ Product Updated Successfully!");
        setEditId(null);
      } else {
        // ADD MODE
        const newProduct = { ...values, id: Date.now() };
        const updated = [...products, newProduct];

        localStorage.setItem("products", JSON.stringify(updated));
        setProducts(updated);

        alert("✅ Product Added Successfully!");
      }

      resetForm();
    },
  });

  // Load products
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(stored);
  }, []);

  // Delete product
  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  // EDIT PRODUCT — Fill form with existing product
  const editProduct = (product) => {
    setEditId(product.id);

    Object.keys(product).forEach((key) => {
      if (formik.values.hasOwnProperty(key)) {
        formik.setFieldValue(key, product[key]);
      }
    });
  };

  // Reset clears edit mode
  const handleReset = () => {
    formik.resetForm();
    setEditId(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">{editId ? "Update Product" : "Add Product"}</h2>

      <form onSubmit={formik.handleSubmit} className="row g-3">
        {productField.map((item, index) => (
          <div className="col-md-6" key={index}>
            <label className="form-label">{item.label}</label>

            {/* FILE FIELD */}
            {item.type === "file" ? (
              <>
                <input
                  type="file"
                  name={item.name}
                  className="form-control"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const base64 = await convertToBase64(file);
                      formik.setFieldValue(item.name, base64);
                    }
                  }}
                />

                {/* Preview existing image OR selected file */}
                {formik.values[item.name] && (
                  <img
                    src={formik.values[item.name]}
                    alt="Preview"
                    style={{
                      width: "120px",
                      marginTop: "10px",
                      borderRadius: "5px",
                    }}
                  />
                )}
              </>
            ) : item.type === "select" ? (
              <select
                name={item.name}
                className="form-select"
                value={formik.values[item.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select {item.label}</option>
                {item.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : item.type === "textarea" ? (
              <textarea
                name={item.name}
                className="form-control"
                placeholder={item.placeholder}
                value={formik.values[item.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            ) : (
              <input
                type={item.type}
                name={item.name}
                className="form-control"
                placeholder={item.placeholder}
                value={formik.values[item.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            )}

            {formik.touched[item.name] && formik.errors[item.name] && (
              <div className="text-danger small">{formik.errors[item.name]}</div>
            )}
          </div>
        ))}

        <div className="row mt-4">
          <div className="col-4 d-flex gap-3">
            <button type="submit" className="btn btn-primary w-80">
              {editId ? "Update Product" : "Add Product"}
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* PRODUCT LIST TABLE */}
      <h3 className="mt-5">Product List</h3>
      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Description</th>
              <th>View</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>
                  {prod.image && (
                    <img
                      src={prod.image}
                      alt="Product"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  )}
                </td>
                <td>{prod.productName}</td>
                <td>{prod.price}</td>
                <td>{prod.category}</td>
                <td>{prod.description.substring(0, 30)}...</td>

                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => setViewProduct(prod)}
                  >
                    View
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => editProduct(prod)}
                  >
                    Edit
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProduct(prod.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* VIEW MODAL */}
      {viewProduct && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h4>{viewProduct.productName}</h4>

              {viewProduct.image && (
                <img
                  src={viewProduct.image}
                  alt="Preview"
                  style={{ width: "200px", borderRadius: "8px" }}
                />
              )}

              <p>
                <strong>Price:</strong> {viewProduct.price}
              </p>

              <p>
                <strong>Category:</strong> {viewProduct.category}
              </p>

              <p>
                <strong>Description:</strong> {viewProduct.description}
              </p>

              <div className="mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewProduct(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProducts;
