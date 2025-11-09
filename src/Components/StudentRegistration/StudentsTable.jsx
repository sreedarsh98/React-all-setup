export default function StudentsTable({ data, onView, onEdit, onDelete }) {
  return (
    <div className="mt-5">
      <h4>Students List</h4>

      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Grade</th>
            <th width="210px">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No students yet.
              </td>
            </tr>
          ) : (
            data.map((s) => (
              <tr key={s.id}>
                <td>{s.firstName} {s.lastName}</td>
                <td>{s.email}</td>
                <td>{s.grade}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => onView(s)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => onEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
