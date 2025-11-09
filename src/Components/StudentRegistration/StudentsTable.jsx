export default function StudentsTable({ data, onView, onEdit, onDelete, steps = [] }) {
  const getStepStatus = (student) => {
    const status = student.stepStatus || {};
    const step1 = status.step1Completed || false;
    const step2 = status.step2Completed || false;
    const step3 = status.step3Completed || false;
    const allStepsCompleted = step1 && step2 && step3;
    
    return {
      step1: step1,
      step2: step2,
      step3: step3,
      isCompleted: status.isCompleted || false,
      allStepsCompleted: allStepsCompleted, // All steps done but not submitted
    };
  };

  const getStepBadge = (completed, stepName) => {
    if (completed) {
      return (
        <span className="badge bg-success me-1" title={`${stepName} completed`}>
          {stepName} ✓
        </span>
      );
    }
    return (
      <span className="badge bg-secondary me-1" title={`${stepName} pending`}>
        {stepName} ⏳
      </span>
    );
  };

  return (
    <div className="mt-5">
      <h4>Students List</h4>

      <div className="table-responsive mt-3">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Grade</th>
              <th>Steps Progress</th>
              <th>Status</th>
              <th width="400px">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No students registered yet.
                </td>
              </tr>
            ) : (
              data.map((student) => {
                const stepStatus = getStepStatus(student);
                return (
                  <tr key={student.id}>
                    <td>
                      {student.firstName || "N/A"} {student.lastName || ""}
                    </td>
                    <td>{student.email || "N/A"}</td>
                    <td>{student.grade || "N/A"}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {getStepBadge(stepStatus.step1, steps[0] || "Step 1")}
                        {getStepBadge(stepStatus.step2, steps[1] || "Step 2")}
                        {getStepBadge(stepStatus.step3, steps[2] || "Step 3")}
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
                          onClick={() => onView(student)}
                          title="View Details"
                        >
                          View
                        </button>

                        {/* Edit buttons for incomplete steps */}
                        {!stepStatus.allStepsCompleted && !stepStatus.isCompleted && (
                          <>
                            {!stepStatus.step1 && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onEdit(student, 0)}
                                title="Complete Step 1: Personal"
                              >
                                Step 1
                              </button>
                            )}
                            {stepStatus.step1 && !stepStatus.step2 && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onEdit(student, 1)}
                                title="Complete Step 2: Academic"
                              >
                                Step 2
                              </button>
                            )}
                            {stepStatus.step1 && stepStatus.step2 && !stepStatus.step3 && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onEdit(student, 2)}
                                title="Complete Step 3: Documents"
                              >
                                Step 3
                              </button>
                            )}
                          </>
                        )}

                        {/* Preview/Complete button when all steps are done but not submitted */}
                        {stepStatus.allStepsCompleted && !stepStatus.isCompleted && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => onEdit(student, 2)}
                            title="Go to Preview to Submit"
                          >
                            Go to Preview
                          </button>
                        )}

                        {/* Edit All button for submitted students */}
                        {stepStatus.isCompleted && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => onEdit(student, 0)}
                            title="Edit Student"
                          >
                            Edit All
                          </button>
                        )}

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDelete(student.id)}
                          title="Delete Student"
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
}
