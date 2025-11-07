import * as Yup from "yup";

export const buildValidationSchema = (fields) => {
  const shape = {};

  fields.forEach((field) => {
    let validator;

    if (field.type === "number") {
      validator = Yup.number().typeError(`${field.label} must be a number`);
    } else {
      validator = Yup.string();
    }

    if (field.required) {
      validator = validator.required(`${field.label} is required`); 
    }

    if (field.min) {
      validator =
        field.type === "number"
          ? validator.min(field.min, `Minimum value is ${field.min}`)
          : validator.min(field.min, `Minimum ${field.min} characters`);
    }

    shape[field.name] = validator;
  });

  return Yup.object().shape(shape);
};
