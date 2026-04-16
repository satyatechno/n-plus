import { t } from 'i18next';
import * as yup from 'yup';

const emailRegexSpanish = /^[\p{L}0-9._%+-]+@[\p{L}0-9.-]+\.[\p{L}]{2,}$/u;

const noSpaceRegex = /^\S+$/;

export const socialMediaAuthSchema = yup.object({
  email: yup
    .string()
    .required(t('screens.socialMediaAuth.text.emailRequired'))
    .matches(noSpaceRegex, t('screens.socialMediaAuth.text.emailInvalid'))
    .matches(emailRegexSpanish, t('screens.socialMediaAuth.text.emailInvalid'))
});
