import { useEffect, useState } from 'react';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  GenderOption,
  MyProfileDataResult,
  UpdateProfileFormValues,
  UpdateProfileViewModel
} from '@src/models/main/MyAccount/UpdateProfile';
import { useTheme } from '@src/hooks/useTheme';
import { UPDATE_MY_PROFILE_MUTATION } from '@src/graphql/main/MyAccount/mutations';
import { updateProfileSchema } from '@src/utils/schemas/updateProfileSchema';
import { MyAccountStackParamList } from '@src/navigation/types';
import useUserStore from '@src/zustand/main/userStore';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS,
  ANALYTICS_META_EVENTS
} from '@src/utils/analyticsConstants';

const useUpdateProfileViewModel = (): UpdateProfileViewModel => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const { userData } = useUserStore();
  const navigation = useNavigation<NativeStackNavigationProp<MyAccountStackParamList>>();
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [isDropDown, setIsDropDown] = useState<boolean>(false);
  const [selectedDob, setSelectedDob] = useState<string>();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showToastType, setShowToastType] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined);
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const genderList: GenderOption[] = [
    {
      label: t('screens.updateProfile.text.masculine'),
      value: 'Male'
    },
    {
      label: t('screens.updateProfile.text.feminine'),
      value: 'Female'
    },
    {
      label: t('screens.updateProfile.text.preferNotToSay'),
      value: 'Other'
    }
  ];

  const [updateProfile, { data: updateData, error: updateError, loading: updateLoading }] =
    useMutation<MyProfileDataResult>(UPDATE_MY_PROFILE_MUTATION, { fetchPolicy: 'network-only' });

  const { ...methods } = useForm<UpdateProfileFormValues>({
    mode: 'onChange',
    resolver: yupResolver(updateProfileSchema as Yup.ObjectSchema<UpdateProfileFormValues>)
  });

  useEffect(() => {
    const formatDate = (isoString: string) => {
      const date = new Date(isoString);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}-${month}-${year}`;
    };
    const selectedGenderFun = () => {
      const found = genderList.find((item) => item.value === userData?.gender);
      return found ? found.label : '';
    };

    methods.reset({
      name: userData?.name?.first ?? '',
      surname: userData?.name?.last ?? '',
      gender: selectedGenderFun(),
      dob: userData?.dob ? formatDate(userData?.dob) : ''
    });
  }, []);

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_PAGE.ACTUALIZAR_PERFIL,
      screen_page_web_url: ANALYTICS_PAGE.ACTUALIZAR_PERFIL,
      screen_name: ANALYTICS_PAGE.ACTUALIZAR_PERFIL,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.ACTUALIZAR_PERFIL}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BACK,
      content_name: ANALYTICS_ATOMS.BACK,
      content_action: ANALYTICS_ATOMS.BACK
    });
    navigation.goBack();
  };

  const { formState } = methods;
  const isButtonEnabled = formState.isValid && formState.isDirty;

  const handleGenderSelection = (item: { label: string; value: string }): void => {
    setSelectedGender(item.value);
    methods.setValue('gender', item.label, {
      shouldDirty: true,
      shouldValidate: true
    });
    if (setIsDropDown) {
      setIsDropDown(false);
    }
  };

  const handleConfirmDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const dateInstance = `${year}-${month}-${day}`;

    setSelectedDob(dateInstance);

    methods.setValue('dob', formattedDate, {
      shouldDirty: true,
      shouldValidate: true
    });

    hideDatePicker();
  };

  useEffect(() => {
    const error = updateError;
    if (error) {
      setShowToastType('error');
      setErrorMessage(
        (error?.graphQLErrors?.[0]?.extensions?.message as string) ??
          t('screens.splash.text.noInternet')
      );
      setAlertVisible(true);
    }
    if (updateData) {
      setShowToastType('success');
      setErrorMessage(t('screens.updateProfile.text.successMessage'));
      setAlertVisible(true);
      AnalyticsService.logAppsFlyerEvent('profile_update_successfull');
      setTimeout(() => {
        goBack();
      }, 500);
    }
  }, [updateError, updateData]);

  const onSubmit = async (formData: UpdateProfileFormValues) => {
    logSelectContentEvent(
      {
        idPage: ANALYTICS_PAGE.ACTUALIZAR_PERFIL,
        screen_page_web_url: ANALYTICS_PAGE.ACTUALIZAR_PERFIL,
        screen_name: ANALYTICS_PAGE.ACTUALIZAR_PERFIL,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.ACTUALIZAR_PERFIL}`,
        organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.BUTTON,
        content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.ACTUALIZAR_BUTTON,
        content_name: 'Guardar',
        content_action: ANALYTICS_ATOMS.TAP,
        meta_content_action: ANALYTICS_META_EVENTS.PROFILE_UPDATE
      },
      ANALYTICS_META_EVENTS.PROFILE_UPDATE
    );

    await updateProfile({
      variables: {
        input: {
          name: { first: formData.name, last: formData.surname },
          gender: selectedGender,
          dob: selectedDob
        }
      }
    });
  };

  const showDateInCalender = () => {
    const dob = methods.getValues('dob');
    if (dob) {
      const [day, month, year] = dob.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  };

  const thirteenYearsAgo = new Date();
  thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);

  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(new Date().getFullYear() - 100);

  return {
    theme,
    t,
    setIsFormError,
    isFormError,
    isDropDown,
    setIsDropDown,
    genderList,
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    methods,
    isButtonEnabled,
    handleGenderSelection,
    handleConfirmDate,
    thirteenYearsAgo,
    hundredYearsAgo,
    onSubmit,
    updateProfileLoading: updateLoading,
    alertVisible,
    errorMessage,
    toastVariant: showToastType,
    setErrorMessage,
    setAlertVisible,
    showToastType,
    goBack,
    showDateInCalender
  };
};

export default useUpdateProfileViewModel;
