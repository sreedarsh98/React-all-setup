export default function Step1Personal({ formik }) {
  return (
    <div className="row">

      <div className="col-md-6 mb-3">
        <label className="form-label">First Name</label>
        <input
          name="firstName"
          className="form-control"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.firstName && (
          <div className="text-danger small">{formik.errors.firstName}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Last Name</label>
        <input
          name="lastName"
          className="form-control"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.lastName && (
          <div className="text-danger small">{formik.errors.lastName}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.email && (
          <div className="text-danger small">{formik.errors.email}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Phone</label>
        <input
          name="phone"
          className="form-control"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.phone && (
          <div className="text-danger small">{formik.errors.phone}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Date of Birth</label>
        <input
          type="date"
          name="dob"
          className="form-control"
          value={formik.values.dob}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.dob && (
          <div className="text-danger small">{formik.errors.dob}</div>
        )}
      </div>
    </div>
  );
}
