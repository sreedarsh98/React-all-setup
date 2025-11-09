export default function Step3Documents({ formik, onPickFile, photoKey }) {
  return (
    <div className="row">

      <div className="col-md-6 mb-3">
        <label className="form-label">Guardian Name</label>
        <input
          name="guardianName"
          className="form-control"
          value={formik.values.guardianName}
          onChange={formik.handleChange}
        />
        {formik.errors.guardianName && (
          <div className="text-danger small">
            {formik.errors.guardianName}
          </div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Notes</label>
        <textarea
          name="notes"
          className="form-control"
          rows={2}
          value={formik.values.notes}
          onChange={formik.handleChange}
        />
        {formik.errors.notes && (
          <div className="text-danger small">{formik.errors.notes}</div>
        )}
      </div>

      <div className="col-md-12 mb-3">
        <label className="form-label">Student Photo</label>
        <input
          key={photoKey}
          type="file"
          className="form-control"
          accept="image/*"
          onChange={onPickFile}
        />

        {formik.values.photo && (
          <img
            src={formik.values.photo}
            className="mt-3 rounded"
            width="120"
            alt="Preview"
          />
        )}
      </div>
    </div>
  );
}
