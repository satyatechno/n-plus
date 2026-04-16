import { t } from 'i18next';
import * as yup from 'yup';

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ.'’\s]+$/;

export const updateProfileSchema = yup.object({
  name: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(2, t('screens.updateProfile.text.nameMin'))
    .max(25, t('screens.updateProfile.text.nameMax'))
    .matches(nameRegex, t('screens.updateProfile.text.nameInvalid')),
  surname: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .min(2, t('screens.updateProfile.text.surnameMin'))
    .max(25, t('screens.updateProfile.text.surnameMax'))
    .matches(nameRegex, t('screens.updateProfile.text.surnameInvalid'))
});
