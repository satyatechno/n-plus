import { t } from 'i18next';

import * as yup from 'yup';

export const deleteAccountReasonSchema = yup.object({
  otherReason: yup
    .string()
    .trim()
    .min(2, t('screens.validation.inputBox.minCharacters'))
    .max(500, t('screens.validation.inputBox.maxCharacters'))
});
