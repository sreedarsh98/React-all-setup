import React from "react";

export default function Stepper({ steps, current }) {
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
}
