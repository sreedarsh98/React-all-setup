import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const LS_KEY = "customers_v1";

export default function CustomerRegistration() {
  const [customers, setCustomers] = useState([]);
  const [step, setStep] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);

  const steps = ["Basic Info", "Contact Details", "Additional Info", "Preview"];

  // Validation schemas
  const schemaStep1 = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),
  });

  const schemaStep2 = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required("Phone is required"),
    address: Yup.string().required("Address is required"),
  });

  const schemaStep3 = Yup.object({
    company: Yup.string(),
    notes: Yup.string().max(500, "Notes must be less than 500 characters"),
  });

  const schemas = [schemaStep1, schemaStep2, schemaStep3];

  // Initial form values
  const initialValues = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    notes: "",
  };

  // Load customers from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    setCustomers(stored);
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      // Final submit
      if (editId) {
        const updated = customers.map((c) =>
          c.id === editId
            ? {
                ...formik.values,
                id: editId,
                stepStatus: {
                  step1Completed: true,
                  step2Completed: true,
                  step3Completed: true,
                  isCompleted: true,
                },
                completedAt: new Date().toISOString(),
              }
            : c
        );
        setCustomers(updated);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      } else {
        const newCustomer = {
          ...formik.values,
          id: Date.now(),
          stepStatus: {
            step1Completed: true,
            step2Completed: true,
            step3Completed: true,
            isCompleted: true,
          },
          completedAt: new Date().toISOString(),
        };
        const updated = [...customers, newCustomer];
        setCustomers(updated);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      }

      // Reset
      setEditId(null);
      formik.resetForm();
      setStep(0);
      setPreviewMode(false);
    },
  });

  // Save customer progress
  const saveCustomerProgress = (stepNumber, customerData) => {
    const stepKey = `step${stepNumber}Completed`;
    let updatedCustomers = [];
    let customerId = editId;

    if (editId) {
      // Update existing customer
      updatedCustomers = customers.map((c) => {
        if (c.id === editId) {
          return {
            ...c,
            ...customerData,
            stepStatus: {
              ...(c.stepStatus || {}),
              [stepKey]: true,
              isCompleted: false,
            },
          };
        }
        return c;
      });
    } else {
      // Check if customer with same email exists
      const existingCustomer = customerData.email
        ? customers.find(
            (c) => c.email === customerData.email && !c.stepStatus?.isCompleted
          )
        : null;

      if (existingCustomer) {
        customerId = existingCustomer.id;
        updatedCustomers = customers.map((c) => {
          if (c.id === existingCustomer.id) {
            return {
              ...c,
              ...customerData,
              stepStatus: {
                ...(c.stepStatus || {}),
                [stepKey]: true,
                isCompleted: false,
              },
            };
          }
          return c;
        });
      } else {
        // Create new customer
        customerId = Date.now();
        const newCustomer = {
          ...customerData,
          id: customerId,
          stepStatus: {
            step1Completed: false,
            step2Completed: false,
            step3Completed: false,
            isCompleted: false,
            [stepKey]: true,
          },
          createdAt: new Date().toISOString(),
        };
        updatedCustomers = [...customers, newCustomer];
      }
    }

    setCustomers(updatedCustomers);
    localStorage.setItem(LS_KEY, JSON.stringify(updatedCustomers));

    if (customerId && !editId) {
      setEditId(customerId);
    }
  };

  // Handle Next button
  const handleNext = async () => {
    try {
      await schemas[step].validate(formik.values, { abortEarly: false });
      saveCustomerProgress(step + 1, formik.values);

      if (step === 2) {
        setPreviewMode(true);
      } else {
        setStep(step + 1);
      }
    } catch (err) {
      const errors = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
      }
      formik.setErrors(errors);
      const touched = {};
      Object.keys(errors).forEach((key) => {
        touched[key] = true;
      });
      formik.setTouched(touched);
    }
  };

  // Handle Back button
  const handleBack = () => {
    if (previewMode) {
      setPreviewMode(false);
      setStep(2);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  // Start editing
  const startEdit = (customer, stepToEdit = null) => {
    setEditId(customer.id);
    formik.setValues({ ...initialValues, ...customer });
    formik.setErrors({});
    formik.setTouched({});

    const status = customer.stepStatus || {};
    const allStepsCompleted =
      status.step1Completed && status.step2Completed && status.step3Completed;

    if (stepToEdit !== null) {
      setStep(stepToEdit);
      if (stepToEdit === 2 && allStepsCompleted && !status.isCompleted) {
        setPreviewMode(true);
      } else {
        setPreviewMode(false);
      }
    } else {
      if (!status.step1Completed) {
        setStep(0);
        setPreviewMode(false);
      } else if (!status.step2Completed) {
        setStep(1);
        setPreviewMode(false);
      } else if (!status.step3Completed) {
        setStep(2);
        setPreviewMode(false);
      } else if (allStepsCompleted && !status.isCompleted) {
        setStep(2);
        setPreviewMode(true);
      } else {
        setStep(0);
        setPreviewMode(false);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete customer
  const deleteCustomer = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const updated = customers.filter((c) => c.id !== id);
      setCustomers(updated);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      if (editId === id) {
        handleReset();
      }
    }
  };

  // Reset form
  const handleReset = () => {
    formik.resetForm();
    setEditId(null);
    setStep(0);
    setPreviewMode(false);
  };

  // Step indicator component
  const Stepper = ({ steps, current }) => {
    return (
      <div className="mb-4 d-flex align-items-center">
        {steps.map((label, index) => {
          const isActive = index === current;
          const isDone = index < current;
          return (
            <div key={index} className="d-flex align-items-center">
              <div
                className={
                  "rounded-circle d-flex justify-content-center align-items-center me-2 " +
                  (isActive
                    ? "bg-primary text-white"
                    : isDone
                    ? "bg-success text-white"
                    : "bg-light border")
                }
                style={{ width: 35, height: 35 }}
              >
                {isDone ? "✓" : index + 1}
              </div>
              <span className={isActive ? "fw-bold me-3" : "text-muted me-3"}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Step 1: Basic Info
  const Step1BasicInfo = () => (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">First Name *</label>
        <input
          name="firstName"
          className="form-control"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.firstName && formik.touched.firstName && (
          <div className="text-danger small">{formik.errors.firstName}</div>
        )}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Last Name *</label>
        <input
          name="lastName"
          className="form-control"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.lastName && formik.touched.lastName && (
          <div className="text-danger small">{formik.errors.lastName}</div>
        )}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Date of Birth *</label>
        <input
          type="date"
          name="dateOfBirth"
          className="form-control"
          value={formik.values.dateOfBirth}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
          <div className="text-danger small">{formik.errors.dateOfBirth}</div>
        )}
      </div>
    </div>
  );

  // Step 2: Contact Details
  const Step2Contact = () => (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Email *</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.email && formik.touched.email && (
          <div className="text-danger small">{formik.errors.email}</div>
        )}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Phone *</label>
        <input
          name="phone"
          className="form-control"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.phone && formik.touched.phone && (
          <div className="text-danger small">{formik.errors.phone}</div>
        )}
      </div>
      <div className="col-md-12 mb-3">
        <label className="form-label">Address *</label>
        <textarea
          name="address"
          className="form-control"
          rows={3}
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.address && formik.touched.address && (
          <div className="text-danger small">{formik.errors.address}</div>
        )}
      </div>
    </div>
  );

  // Step 3: Additional Info
  const Step3Additional = () => (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Company</label>
        <input
          name="company"
          className="form-control"
          value={formik.values.company}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      <div className="col-md-12 mb-3">
        <label className="form-label">Notes</label>
        <textarea
          name="notes"
          className="form-control"
          rows={4}
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Any additional notes about the customer..."
        />
        {formik.errors.notes && formik.touched.notes && (
          <div className="text-danger small">{formik.errors.notes}</div>
        )}
      </div>
    </div>
  );

  // Preview Card
  const PreviewCard = ({ values }) => (
    <div className="p-4 border rounded">
      <h5 className="mb-3">Customer Preview</h5>
      <div className="row">
        <div className="col-md-6 mb-2">
          <strong>First Name:</strong> {values.firstName || "N/A"}
        </div>
        <div className="col-md-6 mb-2">
          <strong>Last Name:</strong> {values.lastName || "N/A"}
        </div>
        <div className="col-md-6 mb-2">
          <strong>Date of Birth:</strong> {values.dateOfBirth || "N/A"}
        </div>
        <div className="col-md-6 mb-2">
          <strong>Email:</strong> {values.email || "N/A"}
        </div>
        <div className="col-md-6 mb-2">
          <strong>Phone:</strong> {values.phone || "N/A"}
        </div>
        <div className="col-md-6 mb-2">
          <strong>Company:</strong> {values.company || "N/A"}
        </div>
        <div className="col-md-12 mb-2">
          <strong>Address:</strong> {values.address || "N/A"}
        </div>
        <div className="col-md-12 mb-2">
          <strong>Notes:</strong> {values.notes || "N/A"}
        </div>
      </div>
    </div>
  );

  // Customers Table
  const CustomersTable = () => {
    const getStepStatus = (customer) => {
      const status = customer.stepStatus || {};
      const step1 = status.step1Completed || false;
      const step2 = status.step2Completed || false;
      const step3 = status.step3Completed || false;
      const allStepsCompleted = step1 && step2 && step3;
      return {
        step1,
        step2,
        step3,
        isCompleted: status.isCompleted || false,
        allStepsCompleted,
      };
    };

    return (
      <div className="mt-5">
        <h4>Customers List</h4>
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Progress</th>
                <th>Status</th>
                <th width="350px">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No customers registered yet.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const stepStatus = getStepStatus(customer);
                  return (
                    <tr key={customer.id}>
                      <td>
                        {customer.firstName || "N/A"} {customer.lastName || ""}
                      </td>
                      <td>{customer.email || "N/A"}</td>
                      <td>{customer.phone || "N/A"}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <span
                            className={`badge ${
                              stepStatus.step1 ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            Step 1 {stepStatus.step1 ? "✓" : "⏳"}
                          </span>
                          <span
                            className={`badge ${
                              stepStatus.step2 ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            Step 2 {stepStatus.step2 ? "✓" : "⏳"}
                          </span>
                          <span
                            className={`badge ${
                              stepStatus.step3 ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            Step 3 {stepStatus.step3 ? "✓" : "⏳"}
                          </span>
                        </div>
                      </td>
                      <td>
                        {stepStatus.isCompleted || stepStatus.allStepsCompleted ? (
                          <span className="badge bg-success">Completed</span>
                        ) : (
                          <span className="badge bg-warning">In Progress</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => setViewCustomer(customer)}
                          >
                            View
                          </button>
                          {!stepStatus.allStepsCompleted && !stepStatus.isCompleted && (
                            <>
                              {!stepStatus.step1 && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => startEdit(customer, 0)}
                                >
                                  Step 1
                                </button>
                              )}
                              {stepStatus.step1 && !stepStatus.step2 && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => startEdit(customer, 1)}
                                >
                                  Step 2
                                </button>
                              )}
                              {stepStatus.step1 && stepStatus.step2 && !stepStatus.step3 && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => startEdit(customer, 2)}
                                >
                                  Step 3
                                </button>
                              )}
                            </>
                          )}
                          {stepStatus.allStepsCompleted && !stepStatus.isCompleted && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => startEdit(customer, 2)}
                            >
                              Go to Preview
                            </button>
                          )}
                          {stepStatus.isCompleted && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => startEdit(customer, 0)}
                            >
                              Edit All
                            </button>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteCustomer(customer.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Modal Component
  const Modal = ({ open, onClose, children }) => {
    if (!open) return null;
    return (
      <div
        className="modal show d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Customer Details</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4">Customer Registration</h1>

      <Stepper steps={steps} current={previewMode ? 3 : step} />

      <form onSubmit={formik.handleSubmit} className="bg-white p-4 shadow-sm rounded-3">
        {!previewMode && step === 0 && <Step1BasicInfo />}
        {!previewMode && step === 1 && <Step2Contact />}
        {!previewMode && step === 2 && <Step3Additional />}
        {previewMode && <PreviewCard values={formik.values} />}

        <div className="mt-4 d-flex justify-content-between">
          <div className="d-flex gap-2">
            {(step > 0 || previewMode) && (
              <button type="button" onClick={handleBack} className="btn btn-outline-secondary">
                Back
              </button>
            )}
            <button type="button" onClick={handleReset} className="btn btn-outline-danger">
              {editId ? "Cancel Edit" : "Reset"}
            </button>
          </div>
          <div>
            {!previewMode && (
              <button type="button" onClick={handleNext} className="btn btn-primary">
                {step === 2 ? "Go to Preview" : "Next"}
              </button>
            )}
            {previewMode && (
              <button type="submit" className="btn btn-success">
                {editId ? "Update Customer" : "Submit Customer"}
              </button>
            )}
          </div>
        </div>
      </form>

      <CustomersTable />

      <Modal open={!!viewCustomer} onClose={() => setViewCustomer(null)}>
        {viewCustomer && <PreviewCard values={viewCustomer} />}
      </Modal>
    </div>
  );
}

