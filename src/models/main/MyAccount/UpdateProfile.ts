import { UseFormReturn } from 'react-hook-form';

import { AppTheme } from '@src/themes/theme';

export interface UpdateProfileFormValues {
  name?: string;
  surname?: string;
  gender?: string;
  dob?: string;
}

export interface UpdateProfileViewModel {
  theme: AppTheme;
  t: (key: string) => string;
  setIsFormError: (value: boolean) => void;
  isFormError?: boolean;
  isDropDown?: boolean;
  setIsDropDown?: (value: boolean) => void;
  genderList?: { label: string; value: string }[];
  isDatePickerVisible: boolean;
  showDatePicker: () => void;
  hideDatePicker: () => void;
  methods: UseFormReturn<UpdateProfileFormValues>;
  isButtonEnabled: boolean;
  handleGenderSelection: (value: { label: string; value: string }) => void;
  handleConfirmDate: (date: Date) => void;
  onSubmit: (data: UpdateProfileFormValues) => void;
  updateProfileLoading: boolean;
  errorMessage: string;
  toastVariant: string;
  setErrorMessage: (value: string) => void;
  setAlertVisible: (value: boolean) => void;
  showToastType: string;
  goBack?: () => void;
  showDateInCalender?: () => Date;
  thirteenYearsAgo: Date;
  hundredYearsAgo: Date;
  updateLoading?: boolean;
  alertVisible: boolean;
}

export interface MyProfileDataResult {
  _id: string;
  myProfile: {
    id: string;
    _id: string;
    gender: string | null;
    dob?: string | null;
    email: string;
    createdAt: string;
    updatedAt: string;
    mfaToggleEnable: boolean;
    name: {
      first: string;
      last: string;
    };
    phone: {
      code: string;
      number: string;
    };
  };
}

type Gender = 'Male' | 'Female' | 'Other';

export interface GenderOption {
  label: string;
  value: Gender;
}
