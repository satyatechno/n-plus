import React, { useEffect, useRef } from 'react';
import { FlatList, Pressable, ScrollView, Text, View, Animated } from 'react-native';

import { FormProvider } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { fonts } from '@src/config/fonts';
import { CalendarIcon, DropDownIcon } from '@src/assets/icons';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomLoader from '@src/views/molecules/CustomLoader';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { themeStyles } from '@src/views/pages/main/MyAccount/UpdateProfile/styles';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import useUpdateProfileViewModel from '@src/viewModels/main/MyAccount/UpdateProfile/useUpdateProfileViewModel';

/**
 * UpdateProfile is a React functional component that renders a profile update form.
 * It allows users to update their personal information, including name, surname, gender, and date of birth.
 * The component utilizes react-hook-form to manage form state and validation, and Yup for schema validation.
 * It also includes a date picker for selecting the date of birth and a dropdown for gender selection.
 * The component handles form submission and displays success or error messages accordingly.
 */

const UpdateProfile: React.FC = () => {
  const {
    theme,
    t,
    setIsFormError,
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
    onSubmit,
    updateProfileLoading,
    alertVisible,
    errorMessage,
    setAlertVisible,
    showToastType,
    goBack,
    thirteenYearsAgo,
    hundredYearsAgo,
    showDateInCalender
  } = useUpdateProfileViewModel();
  const styles = themeStyles(theme);

  const dropdownTranslateY = useRef(new Animated.Value(8)).current;
  const dropdownOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDropDown) {
      dropdownTranslateY.setValue(8);
      dropdownOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(dropdownTranslateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(dropdownOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [isDropDown, dropdownOpacity, dropdownTranslateY]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <CustomHeader
          onPress={goBack ?? (() => {})}
          headerText={t('screens.updateProfile.text.updateProfile')}
          headerTextColor={theme.newsTextTitlePrincipal}
          headerTextWeight="Boo"
          headerTextFontFamily={fonts.franklinGothicURW}
          headerTextStyles={styles.headerTextStyles}
        />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <CustomHeading
            isLogoVisible={false}
            headingText={t('screens.updateProfile.text.updateYourProfileDetails')}
            subHeadingText={t('screens.updateProfile.text.updatePersonalInformation')}
            subHeadingWeight={'Boo'}
            subHeadingFont={fonts.franklinGothicURW}
          />

          <View style={styles.formContainer}>
            <FormProvider {...methods}>
              <ControlledTextInput
                name="name"
                label={t('screens.updateProfile.text.name')}
                placeholder={t('screens.updateProfile.text.enterYourName')}
                keyboardType="name-phone-pad"
                setFormError={setIsFormError}
                textInputStyles={[
                  {
                    borderColor: methods.formState.errors.name
                      ? theme.actionCTAToastError
                      : methods.getValues('name')
                        ? theme.inputFillForegroundInteractiveFocused
                        : theme.inputFillforegroundInteractiveDefault
                  }
                ]}
              />

              <ControlledTextInput
                name="surname"
                label={t('screens.updateProfile.text.lastName')}
                placeholder={t('screens.updateProfile.text.enterYourSurname')}
                keyboardType="name-phone-pad"
                setFormError={setIsFormError}
                textInputStyles={[
                  {
                    borderColor: methods.formState.errors.surname
                      ? theme.actionCTAToastError
                      : methods.getValues('surname')
                        ? theme.inputFillForegroundInteractiveFocused
                        : theme.inputFillforegroundInteractiveDefault
                  }
                ]}
              />

              <ControlledTextInput
                name="gender"
                label={t('screens.updateProfile.text.gender')}
                placeholder={t('screens.updateProfile.text.enterYourGender')}
                keyboardType="name-phone-pad"
                setFormError={setIsFormError}
                textInputStyles={[
                  {
                    borderColor: methods.formState.errors.gender
                      ? theme.actionCTAToastError
                      : methods.getValues('gender')
                        ? theme.inputFillForegroundInteractiveFocused
                        : theme.inputFillforegroundInteractiveDefault
                  }
                ]}
                editable={false}
                rightIcon={<DropDownIcon stroke={theme.iconIconographyGenericState} />}
                rightIconStyle={styles.rightIconStyle}
                onRightIconPress={() => (setIsDropDown ? setIsDropDown(!isDropDown) : undefined)}
                onPress={() => (setIsDropDown ? setIsDropDown(!isDropDown) : undefined)}
              />

              <ControlledTextInput
                name="dob"
                label={t('screens.updateProfile.text.dob')}
                placeholder={t('screens.updateProfile.text.enterYourDateBirth')}
                setFormError={setIsFormError}
                textInputStyles={[
                  {
                    borderColor: methods.formState.errors.dob
                      ? theme.actionCTAToastError
                      : methods.getValues('dob')
                        ? theme.inputFillForegroundInteractiveFocused
                        : theme.inputFillforegroundInteractiveDefault
                  }
                ]}
                editable={false}
                value={methods.watch('dob')}
                rightIcon={
                  !methods.watch('dob') && (
                    <CalendarIcon stroke={theme.iconIconographyGenericState} />
                  )
                }
                onRightIconPress={showDatePicker}
                onPress={showDatePicker}
              />

              {isDropDown && (
                <Animated.View
                  style={[
                    styles.dropdownContainer,
                    { opacity: dropdownOpacity, transform: [{ translateY: dropdownTranslateY }] }
                  ]}
                >
                  <FlatList
                    data={genderList}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <Pressable onPress={() => handleGenderSelection(item)}>
                        <Text style={styles.dropdownText}>{item.label}</Text>
                      </Pressable>
                    )}
                    keyExtractor={(item) => item?.value}
                  />
                </Animated.View>
              )}
            </FormProvider>
          </View>
        </ScrollView>
      </View>

      <CustomButton
        onPress={methods.handleSubmit(onSubmit)}
        disabled={!isButtonEnabled}
        buttonStyles={
          isButtonEnabled ? styles.validContinueButtonStyle : styles.inValidContinueButtonStyle
        }
        buttonText={t('screens.updateProfile.text.keep')}
        buttonTextColor={
          isButtonEnabled ? theme.primaryCTATextDefault : theme.primaryCTATextDisabled
        }
        buttonTextStyles={styles.buttonTextStyle}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={typeof showDateInCalender === 'function' ? showDateInCalender() : thirteenYearsAgo}
        minimumDate={hundredYearsAgo}
        maximumDate={thirteenYearsAgo}
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        locale="es-ES"
      />

      <CustomToast
        type={showToastType === 'error' ? 'error' : 'success'}
        message={errorMessage}
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
      />

      {updateProfileLoading ? <CustomLoader /> : ''}
    </SafeAreaView>
  );
};

export default UpdateProfile;
