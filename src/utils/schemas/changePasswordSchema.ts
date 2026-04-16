import * as yup from 'yup';
import { t } from 'i18next';

export const changePasswordSchema = yup.object({
  oldPassword: yup.string().required(t('screens.validation.oldPassword.required')),
  password: yup
    .string()
    .required()
    .min(8)
    .max(15)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,15}$/),
  confirmPassword: yup
    .string()
    .required(t('screens.validation.confirmPassword.required'))
    .oneOf([yup.ref('password')], t('screens.validation.confirmPassword.match'))
});
