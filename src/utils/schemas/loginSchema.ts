import { t } from 'i18next';
import * as yup from 'yup';

const emailRegexSpanish = /^[\p{L}0-9._%+-]+@[\p{L}0-9.-]+\.[\p{L}]{2,}$/u;

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .matches(emailRegexSpanish, t('screens.login.text.emailInvalid'))
    .required(t('screens.login.text.emailRequired')),

  password: yup
    .string()
    .required(t('screens.login.text.passwordRequired'))
    .min(8, t('screens.login.text.passwordMin'))
    .matches(/[A-Z]/, t('screens.login.text.passwordUppercase'))
    .matches(/[a-z]/, t('screens.login.text.passwordLowercase'))
    .matches(/[0-9]/, t('screens.login.text.passwordDigit'))
    .matches(/[\W_]/, t('screens.login.text.passwordSpecialChar'))
});
