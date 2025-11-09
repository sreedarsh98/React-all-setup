"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import productField from "./product.json";
import { buildValidationSchema } from "./validate";

const AddProducts = () => {
  const [data, setdata] = useState(() => {});

  const initialValues = {};

  productField.forEach((item) => {
    initialValues[item.name] = item.type == "file" ? null : "";
  });

  console.log(productField, "product filed");

  const validationSchema = buildValidationSchema(productField);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      products.push(values);
      localStorage.setItem("products", JSON.stringify(products));

      alert("✅ Product Added Successfully!");
      resetForm();
    },
  });

  console.log(formik.values, "values");

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Add Product</h2>

      <form onSubmit={formik.handleSubmit} className="row g-3">
        {productField.map((item, index) => (
          <div className="col-md-6" key={index}>
            <label className="form-label">{item.label}</label>

            {item.type === "select" ? (
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
              <div className="text-danger small">
                {formik.errors[item.name]}
              </div>
            )}
          </div>
        ))}
        <div className="row mt-5">
          <div className="col-4 d-flex gap-3">
            <button type="submit" className="btn btn-primary w-80">
              Add Product
            </button>
            <button
              onClick={() => formik.resetForm()}
              type="button"
              className="btn btn-danger w-10"
            >
              reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
