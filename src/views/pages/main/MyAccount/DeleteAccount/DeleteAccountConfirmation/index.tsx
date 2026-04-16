import React from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View, useWindowDimensions } from 'react-native';

import RenderHtml from 'react-native-render-html';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@src/hooks/useTheme';
import { themeStyles } from '@src/views/pages/main/MyAccount/DeleteAccount/DeleteAccountConfirmation/styles';
import { fontSize, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomDivider from '@src/views/atoms/CustomDivider';
import CustomText from '@src/views/atoms/CustomText';
import CustomCheckbox from '@src/views/molecules/CustomCheckbox';
import CustomButton from '@src/views/molecules/CustomButton';
import { useDeleteAccountViewModel } from '@src/viewModels/main/MyAccount/DeleteAccount/useDeleteAccountConfirmation';
import CustomLoader from '@src/views/atoms/CustomLoader';
import ControlledTextInput from '@src/views/organisms/ControlledTextInput';
import { deleteAccountReasonSchema } from '@src/utils/schemas/deleteAccountReasonSchema';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';
import CustomToast from '@src/views/molecules/CustomToast';
import { useDeleteAccount } from '@src/viewModels/main/MyAccount/DeleteAccount/useDeleteAccount';
import DeleteAccountSkeleton from '@src/views/pages/main/MyAccount/DeleteAccount/DeleteAccountConfirmation/components/DeleteAccountSkeleton';
import useUserStore from '@src/zustand/main/userStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';

const DeleteAccountConfirmation = () => {
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(deleteAccountReasonSchema),
    defaultValues: {
      otherReason: ''
    }
  });

  const otherReasonText = useWatch({
    control: methods.control,
    name: 'otherReason'
  });
  const email = useUserStore((state) => state.userData?.email);

  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const {
    reasonsList,
    selectedReasons,
    isConfirmed,
    isOtherSelected,
    toggleReason,
    toggleConfirmation,
    deleteInfoHtml,
    loading,
    toastMessage,
    toastType,
    toastVisible,
    setToastVisible,
    goBack
  } = useDeleteAccountViewModel();

  const { deleteAccount, loading: deleteLoading } = useDeleteAccount();

  if (loading) {
    return <DeleteAccountSkeleton />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={isIos ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.headerWrapper}>
          <CustomHeader
            onPress={goBack}
            headerText={t('screens.deleteAccount.title')}
            headerTextWeight="Boo"
            headerTextFontFamily={fonts.franklinGothicURW}
            headerStyle={styles.headerContent}
            headerTextStyles={styles.headerTextStyles}
          />
        </View>

        <FormProvider {...methods}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.accountInfoWrapper}>
              <CustomHeading
                headingText={t('screens.deleteAccount.text.heading')}
                subHeadingText={email}
                headingStyles={styles.accountHeading}
                headingFont={fonts.notoSerifExtraCondensed}
                subHeadingStyles={styles.accountSubHeading}
                subHeadingFont={fonts.notoSerif}
                headingWeight="R"
                subHeadingWeight="R"
              />
            </View>

            <CustomDivider style={styles.divider} />

            <View style={styles.descriptionWrapper}>
              <RenderHtml
                contentWidth={width}
                source={{ html: deleteInfoHtml }}
                baseStyle={styles.descriptionText}
                tagsStyles={{
                  p: {
                    marginTop: actuatedNormalizeVertical(0),
                    marginBottom: actuatedNormalizeVertical(0),
                    color: theme.bodyTextOther,
                    fontSize: actuatedNormalizeVertical(fontSize.xs)
                  },
                  strong: {
                    fontWeight: 'bold',
                    color: theme.bodyTextOther,
                    fontSize: actuatedNormalizeVertical(fontSize.xs)
                  },
                  ul: {
                    paddingLeft: spacing.s,
                    marginBottom: actuatedNormalizeVertical(spacing.s),
                    fontSize: actuatedNormalizeVertical(fontSize.xs)
                  },
                  li: {
                    fontSize: actuatedNormalizeVertical(fontSize.xs),
                    color: theme.bodyTextOther
                  }
                }}
                classesStyles={{
                  mb20: {
                    marginBottom: actuatedNormalizeVertical(spacing.m)
                  },
                  mb16: {
                    marginBottom: actuatedNormalizeVertical(spacing.s)
                  }
                }}
              />
            </View>

            <CustomDivider style={styles.primaryDivider} />

            <View style={styles.reasonListWrapper}>
              <CustomText
                size={actuatedNormalizeVertical(fontSize.l)}
                fontFamily={fonts.notoSerifExtraCondensed}
                textStyles={styles.reasonLabel}
                color={theme.bodyTextOther}
              >
                {t('screens.deleteAccount.text.reasonLabel')}
              </CustomText>

              <View>
                {reasonsList.map((reason, index) => (
                  <CustomCheckbox
                    key={index}
                    label={reason}
                    checked={selectedReasons.includes(reason)}
                    onChange={() => toggleReason(reason)}
                  />
                ))}
              </View>

              {isOtherSelected && (
                <View style={styles.otherReasonWrapperContainer}>
                  <View style={styles.otherReasonWrapper}>
                    <ControlledTextInput
                      name="otherReason"
                      label=""
                      placeholder={t('screens.deleteAccount.text.otherReasonPlaceholder')}
                      multiline
                      numberOfLines={5}
                      maxLength={500}
                      textAlignVertical="top"
                      setFormError={() => {}}
                      textInputStyles={styles.otherReasonInput}
                    />
                  </View>
                  <Text style={styles.otherReasonCharCount}>
                    {`(${otherReasonText?.length}/500)`}
                  </Text>
                </View>
              )}
            </View>

            <CustomDivider style={styles.secondaryDivider} />

            <View style={styles.confirmationWrapper}>
              <CustomCheckbox
                label={t('screens.deleteAccount.text.deleteConfirmation')}
                checked={isConfirmed}
                onChange={toggleConfirmation}
              />
              <CustomButton
                variant="text"
                buttonText={t('screens.deleteAccount.text.deleteButton')}
                onPress={() => {
                  if (
                    !isConfirmed ||
                    selectedReasons.length === 0 ||
                    (isOtherSelected && (otherReasonText ?? '').trim().length < 2)
                  ) {
                    return;
                  } else {
                    logSelectContentEvent({
                      screen_name: ANALYTICS_PAGE.ELIMINAR_CUENTA,
                      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.ELIMINAR_CUENTA}`,
                      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.DELETE_ACCOUNT_BUTTON,
                      content_name: t('screens.deleteAccount.text.deleteButton'),
                      content_action: ANALYTICS_ATOMS.TAP,
                      screen_page_web_url: SCREEN_PAGE_WEB_URL.MI_CUENTA
                    });

                    let finalReason: string;
                    if (isOtherSelected) {
                      finalReason = (otherReasonText ?? '').trim();
                    } else {
                      finalReason = selectedReasons.join(', ');
                    }

                    deleteAccount({
                      email: email ?? '',
                      finalReason
                    });
                  }
                }}
                buttonTextColor={
                  isConfirmed &&
                  selectedReasons.length > 0 &&
                  (!isOtherSelected || (otherReasonText ?? '').trim().length >= 2)
                    ? theme.bodyTextOther
                    : theme.iconIconographyDisabledState1
                }
                buttonStyles={styles.deleteButtonWrapper}
                buttonTextStyles={styles.deleteButtonText}
              />
            </View>
          </ScrollView>
        </FormProvider>

        {loading || (deleteLoading && <CustomLoader />)}
      </KeyboardAvoidingView>

      <CustomToast
        type={toastType}
        message={
          toastMessage === 'Network request failed'
            ? t('screens.splash.text.noInternetConnection')
            : toastMessage
        }
        isVisible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

export default DeleteAccountConfirmation;
