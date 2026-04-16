import * as yup from 'yup';
import { t } from 'i18next';

const emailRegexSpanish = /^[\p{L}0-9._%+-]+@[\p{L}0-9.-]+\.[\p{L}]{2,}$/u;

export const createAccountPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required(t('screens.validation.email.required'))
    .matches(emailRegexSpanish, t('screens.validation.email.invalid')),

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
