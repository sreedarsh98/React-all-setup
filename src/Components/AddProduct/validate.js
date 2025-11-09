import * as Yup from "yup";

export const buildValidationSchema = (fields) => {
  const shape = {};

  fields.forEach((field) => {
    let validator;

    // FILE VALIDATION
    if (field.type === "file") {
      validator = Yup.mixed().nullable();

      if (field.required) {
        validator = validator.required(`${field.label} is required`);
      }
    }

    // NUMBER VALIDATION
    else if (field.type === "number") {
      validator = Yup.number().typeError(`${field.label} must be a number`);

      if (field.required) {
        validator = validator.required(`${field.label} is required`);
      }

      if (field.min) {
        validator = validator.min(
          field.min,
          `Minimum value is ${field.min}`
        );
      }
    }

    // STRING / TEXT / TEXTAREA / SELECT
    else {
      validator = Yup.string();

      if (field.required) {
        validator = validator.required(`${field.label} is required`);
      }

      if (field.min) {
        validator = validator.min(
          field.min,
          `Minimum ${field.min} characters`
        );
      }
    }

    shape[field.name] = validator;
  });

  return Yup.object().shape(shape);
};
