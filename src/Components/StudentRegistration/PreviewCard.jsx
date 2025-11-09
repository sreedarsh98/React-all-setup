export default function PreviewCard({ values }) {
  return (
    <div className="row bg-light p-3 rounded">

      <div className="col-md-8">
        <h5>Personal Info</h5>
        <p><b>Name:</b> {values.firstName} {values.lastName}</p>
        <p><b>Email:</b> {values.email}</p>
        <p><b>Phone:</b> {values.phone}</p>
        <p><b>DOB:</b> {values.dob}</p>

        <h5 className="mt-3">Academic Info</h5>
        <p><b>Grade:</b> {values.grade}</p>
        <p><b>Roll Number:</b> {values.rollNumber}</p>
        <p><b>Department:</b> {values.department}</p>
        <p><b>Address:</b> {values.address}</p>

        <h5 className="mt-3">Guardian</h5>
        <p><b>Guardian Name:</b> {values.guardianName}</p>
        <p><b>Notes:</b> {values.notes || "-"}</p>
      </div>

      <div className="col-md-4 text-center">
        {values.photo ? (
          <img
            src={values.photo}
            className="img-thumbnail"
            alt="Student"
            style={{ maxWidth: "180px" }}
          />
        ) : (
          <div className="border p-4 bg-white text-muted">
            No Photo
          </div>
        )}
      </div>

    </div>
  );
}
