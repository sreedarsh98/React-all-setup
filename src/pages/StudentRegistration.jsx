import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Step1Personal from "../Components/StudentRegistration/Step1Personal";
import Step2Academic from "../Components/StudentRegistration/Step2Academic";
import Step3Documents from "../Components/StudentRegistration/Step3Documents";
import PreviewCard from "../Components/StudentRegistration/PreviewCard";
import StudentsTable from "../Components/StudentRegistration/StudentsTable";
import Modal from "../Components/StudentRegistration/Modal";
import Stepper from "../Components/StudentRegistration/Stepper";

const LS_KEY = "students_v1";

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(file);
  });

export default function StudentRegistration() {
  const [students, setStudents] = useState([]);
  const [step, setStep] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [photoKey, setPhotoKey] = useState(0);

  const steps = ["Personal", "Academic", "Documents", "Preview"];

  // Validation schemas
  const schemaStep1 = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required("Phone is required"),
    dob: Yup.string().required("Date of birth is required"),
  });

  const schemaStep2 = Yup.object({
    grade: Yup.string().required("Grade is required"),
    rollNumber: Yup.string().required("Roll number is required"),
    department: Yup.string().required("Department is required"),
    address: Yup.string().required("Address is required"),
  });

  const schemaStep3 = Yup.object({
    guardianName: Yup.string().required("Guardian name is required"),
    notes: Yup.string().max(300, "Notes must be less than 300 characters"),
    photo: Yup.mixed().nullable(),
  });

  const schemas = [schemaStep1, schemaStep2, schemaStep3];

  // Initial form values
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    grade: "",
    rollNumber: "",
    department: "",
    address: "",
    guardianName: "",
    notes: "",
    photo: null,
  };

  // Load students from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    setStudents(stored);
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      // Final submit - mark as completed
      if (editId) {
        const updated = students.map((s) =>
          s.id === editId
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
            : s
        );
        setStudents(updated);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      } else {
        const newStudent = {
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
        const updated = [...students, newStudent];
        setStudents(updated);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      }

      // Reset form
      setEditId(null);
      formik.resetForm();
      setStep(0);
      setPreviewMode(false);
      setPhotoKey((k) => k + 1);
    },
  });

  // Save student to localStorage after each step
  const saveStudentProgress = (stepNumber, studentData) => {
    const stepKey = `step${stepNumber}Completed`;
    let updatedStudents = [];
    let studentId = editId;

    try {
      if (editId) {
        // Update existing student
        updatedStudents = students.map((s) => {
          if (s.id === editId) {
            const updatedStatus = {
              ...(s.stepStatus || {}),
              [stepKey]: true,
              isCompleted: false,
            };
            return {
              ...s,
              ...studentData,
              stepStatus: updatedStatus,
            };
          }
          return s;
        });
      } else {
        // Check if student with same email exists (only if email is provided)
        const existingStudent = studentData.email
          ? students.find(
              (s) => s.email === studentData.email && !s.stepStatus?.isCompleted
            )
          : null;

        if (existingStudent) {
          // Update existing student
          studentId = existingStudent.id;
          updatedStudents = students.map((s) => {
            if (s.id === existingStudent.id) {
              const updatedStatus = {
                ...(s.stepStatus || {}),
                [stepKey]: true,
                isCompleted: false,
              };
              return {
                ...s,
                ...studentData,
                stepStatus: updatedStatus,
              };
            }
            return s;
          });
        } else {
          // Create new student
          studentId = Date.now();
          const newStudent = {
            ...studentData,
            id: studentId,
            stepStatus: {
              step1Completed: false,
              step2Completed: false,
              step3Completed: false,
              isCompleted: false,
              [stepKey]: true,
            },
            createdAt: new Date().toISOString(),
          };
          updatedStudents = [...students, newStudent];
        }
      }

      // Update state and localStorage
      setStudents(updatedStudents);
      localStorage.setItem(LS_KEY, JSON.stringify(updatedStudents));

      // Set editId for subsequent steps
      if (studentId && !editId) {
        setEditId(studentId);
      }
    } catch (error) {
      console.error("Error saving student progress:", error);
      // Still update state even if there's an error
      setStudents(updatedStudents);
    }
  };

  // Handle Next button click
  const handleNext = async () => {
    try {
      // Validate current step
      await schemas[step].validate(formik.values, { abortEarly: false });

      // Save progress to localStorage
      saveStudentProgress(step + 1, formik.values);

      // Move to next step or preview
      if (step === 2) {
        // Step 3 (index 2) completed, go to preview
        setPreviewMode(true);
        setStep(2); // Keep step at 2 for preview
      } else {
        // Move to next step
        setStep(step + 1);
        setPreviewMode(false);
      }
    } catch (err) {
      // Show validation errors
      const errors = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          if (e.path) {
            errors[e.path] = e.message;
          }
        });
      }
      formik.setErrors(errors);
      // Mark fields as touched to show errors
      const touched = {};
      Object.keys(errors).forEach((key) => {
        touched[key] = true;
      });
      formik.setTouched(touched);
    }
  };

  // Handle Back button click
  const handleBack = () => {
    if (previewMode) {
      setPreviewMode(false);
      setStep(2); // Go back to step 3
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  // Handle file upload
  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      formik.setFieldValue("photo", base64);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Start editing a student
  const startEdit = (student, stepToEdit = null) => {
    if (!student || !student.id) {
      console.error("Invalid student data");
      return;
    }

    setEditId(student.id);
    formik.setValues({
      ...initialValues,
      ...student,
    });
    formik.setErrors({});
    formik.setTouched({});
    setPhotoKey((k) => k + 1);

    const status = student.stepStatus || {};
    const allStepsCompleted =
      status.step1Completed && status.step2Completed && status.step3Completed;

    // Navigate to specified step or first incomplete step
    if (stepToEdit !== null && stepToEdit !== undefined) {
      setStep(stepToEdit);
      // If all steps are completed and editing step 2, go to preview
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
        // All steps done but not submitted - go to preview
        setStep(2);
        setPreviewMode(true);
      } else {
        // All completed and submitted, start from beginning
        setStep(0);
        setPreviewMode(false);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete student
  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const updated = students.filter((s) => s.id !== id);
      setStudents(updated);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      
      // If deleting the currently edited student, reset form
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
    setPhotoKey((k) => k + 1);
  };

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4">Student Registration</h1>

      {/* Step Indicator */}
      <Stepper steps={steps} current={previewMode ? 3 : step} />

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="bg-white p-4 shadow-sm rounded-3">
        {/* Step 1: Personal Information */}
        {!previewMode && step === 0 && <Step1Personal formik={formik} />}

        {/* Step 2: Academic Information */}
        {!previewMode && step === 1 && <Step2Academic formik={formik} />}

        {/* Step 3: Documents */}
        {!previewMode && step === 2 && (
          <Step3Documents formik={formik} onPickFile={onPickFile} photoKey={photoKey} />
        )}

        {/* Preview */}
        {previewMode && <PreviewCard values={formik.values} />}

        {/* Navigation Buttons */}
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
                {editId ? "Update Student" : "Submit Student"}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Students Table */}
      <StudentsTable
        data={students}
        onView={setViewStudent}
        onEdit={startEdit}
        onDelete={deleteStudent}
        steps={steps}
      />

      {/* View Modal */}
      <Modal open={!!viewStudent} onClose={() => setViewStudent(null)}>
        {viewStudent && <PreviewCard values={viewStudent} />}
      </Modal>
    </div>
  );
}
