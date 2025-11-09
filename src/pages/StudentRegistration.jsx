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

  // ------------------ VALIDATION ------------------
  const schemaStep1 = Yup.object({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().email().required(),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required(),
    dob: Yup.string().required(),
  });

  const schemaStep2 = Yup.object({
    grade: Yup.string().required(),
    rollNumber: Yup.string().required(),
    department: Yup.string().required(),
    address: Yup.string().required(),
  });

  const schemaStep3 = Yup.object({
    guardianName: Yup.string().required(),
    notes: Yup.string().max(300),
    photo: Yup.mixed().nullable(),
  });

  const schemas = [schemaStep1, schemaStep2, schemaStep3];

  // ------------------ FORMIK ------------------
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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    setStudents(stored);
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      const payload = { ...formik.values };

      if (editId) {
        const updated = students.map((s) =>
          s.id === editId ? { ...payload, id: editId } : s
        );
        setStudents(updated);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      } else {
        const newStudent = { ...payload, id: Date.now() };
        const updated = [...students, newStudent];
        setStudents(updated);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      }

      setEditId(null);
      formik.resetForm();
      setStep(0);
      setPreviewMode(false);
      setPhotoKey((k) => k + 1);
    },
  });

  // ------------------ Step Navigation ------------------
  const handleNext = async () => {
    try {
      await schemas[step].validate(formik.values, { abortEarly: false });
      setStep(step + 1);
      if (step === 2) setPreviewMode(true);
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => (errors[e.path] = e.message));
      formik.setErrors(errors);
      formik.setTouched(errors);
    }
  };

  const handleBack = () => {
    if (previewMode) {
      setPreviewMode(false);
      setStep(2);
    } else {
      setStep(step - 1);
    }
  };

  // ------------------ File Upload ------------------
  const onPickFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const b64 = await fileToBase64(f);
    formik.setFieldValue("photo", b64);
  };

  // ------------------ Edit Student ------------------
  const startEdit = (student) => {
    setEditId(student.id);
    formik.setValues(student);
    formik.setErrors({});
    formik.setTouched({});
    setPhotoKey((k) => k + 1);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ------------------ Delete Student ------------------
  const deleteStudent = (id) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4">Student Registration</h1>

      {/* STEP INDICATOR */}
      <Stepper steps={steps} current={previewMode ? 3 : step} />

      {/* FORM */}
      <form onSubmit={formik.handleSubmit} className="bg-white p-4 shadow-sm rounded-3">

        {!previewMode && step === 0 && <Step1Personal formik={formik} />}
        {!previewMode && step === 1 && <Step2Academic formik={formik} />}
        {!previewMode && step === 2 && (
          <Step3Documents formik={formik} onPickFile={onPickFile} photoKey={photoKey} />
        )}

        {previewMode && <PreviewCard values={formik.values} />}

        {/* BUTTONS */}
        <div className="mt-4 d-flex justify-content-between">

          <div className="d-flex gap-2">
            {step > 0 && (
              <button type="button" onClick={handleBack} className="btn btn-outline-secondary">
                Back
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                setEditId(null);
                setStep(0);
                setPreviewMode(false);
                setPhotoKey((k) => k + 1);
              }}
              className="btn btn-outline-danger"
            >
              Reset
            </button>
          </div>

          <div>
            {!previewMode && (
              <button type="button" onClick={handleNext} className="btn btn-primary">
                Next
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

      {/* STUDENTS TABLE */}
      <StudentsTable data={students} onView={setViewStudent} onEdit={startEdit} onDelete={deleteStudent} />

      {/* VIEW MODAL */}
      <Modal open={!!viewStudent} onClose={() => setViewStudent(null)}>
        {viewStudent && <PreviewCard values={viewStudent} />}
      </Modal>
    </div>
  );
}
