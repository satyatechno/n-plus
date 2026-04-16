import * as yup from 'yup';

export const createNewPasswordSchema = yup.object({
  password: yup
    .string()
    .required()
    .min(8)
    .max(15)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,15}$/),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')])
});
