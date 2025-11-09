export default function Step2Academic({ formik }) {
  return (
    <div className="row">

      <div className="col-md-6 mb-3">
        <label className="form-label">Grade</label>
        <select
          name="grade"
          className="form-select"
          value={formik.values.grade}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select</option>
          <option value="Grade 10">Grade 10</option>
          <option value="Grade 11">Grade 11</option>
          <option value="Grade 12">Grade 12</option>
        </select>
        {formik.errors.grade && (
          <div className="text-danger small">{formik.errors.grade}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Roll Number</label>
        <input
          name="rollNumber"
          className="form-control"
          value={formik.values.rollNumber}
          onChange={formik.handleChange}
        />
        {formik.errors.rollNumber && (
          <div className="text-danger small">{formik.errors.rollNumber}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Department</label>
        <input
          name="department"
          className="form-control"
          value={formik.values.department}
          onChange={formik.handleChange}
        />
        {formik.errors.department && (
          <div className="text-danger small">{formik.errors.department}</div>
        )}
      </div>

      <div className="col-md-12 mb-3">
        <label className="form-label">Address</label>
        <textarea
          name="address"
          className="form-control"
          rows={3}
          value={formik.values.address}
          onChange={formik.handleChange}
        />
        {formik.errors.address && (
          <div className="text-danger small">{formik.errors.address}</div>
        )}
      </div>
    </div>
  );
}
