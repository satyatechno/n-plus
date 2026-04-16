import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@src/hooks/useTheme';
import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomHeading from '@src/views/molecules/CustomHeading';
import CustomText from '@src/views/atoms/CustomText';
import OtpInput from '@src/views/organisms/OtpInput';
import { themeStyles } from '@src/views/templates/auth/Otp/styles';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomLoader from '@src/views/atoms/CustomLoader';

interface Props {
  title: string;
  heading: string;
  subHeading: string;
  resendText: string;
  didntReceiveCode: string;
  resend: string;
  buttonText: string;
  isValid: boolean;
  isButtonDisabled?: boolean;
  onOtpChange: (otp: string) => void;
  onValidate: () => void;
  onHeaderPress?: () => void;
  resendLoading?: boolean;
  loading?: boolean;
  isTimerRunning: boolean;
  formattedTime: string;
  onResend: () => void;
  toastVisible?: boolean;
  toastMessage?: string;
  toastType: 'success' | 'error';
  setToastVisible?: (val: boolean) => void;
  resendToastVisible?: boolean;
  resendToastMessage?: string;
  resendToastType: 'success' | 'error';
  setResendToastVisible?: (val: boolean) => void;
  otp: string;
  resetOtpTrigger: boolean;
  containerContentStyle?: StyleProp<ViewStyle> | undefined;
  isDeleteOtp?: boolean;
}

const OtpTemplate: React.FC<Props> = ({
  title,
  heading,
  subHeading,
  resendText,
  didntReceiveCode,
  resend,
  buttonText,
  otp,
  onOtpChange,
  onValidate,
  onHeaderPress = () => {},
  isTimerRunning,
  formattedTime,
  onResend,
  toastVisible,
  toastMessage,
  toastType,
  setToastVisible,
  resendToastVisible,
  resendToastMessage,
  resendToastType,
  setResendToastVisible,
  loading = false,
  resendLoading = false,
  resetOtpTrigger,
  containerContentStyle,
  isDeleteOtp = false
}) => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const handleResendPress = () => {
    if (!resendLoading) {
      onResend();
    }
  };

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.mainRootContainer, containerContentStyle])}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.rootContainer} behavior={isIos ? 'padding' : 'height'}>
          <CustomHeader
            headerText={t(title)}
            onPress={onHeaderPress}
            headerTextWeight="Boo"
            headerTextFontFamily={fonts.franklinGothicURW}
            headerTextStyles={styles.headerText}
          />

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.mainContent}>
              <CustomHeading
                headingText={heading}
                subHeadingText={subHeading}
                headingStyles={styles.headingTitle}
                subHeadingStyles={styles.headingSubtitle}
                subHeadingWeight="Boo"
                isLogoVisible={true}
                logoHeight={actuatedNormalizeVertical(43)}
                logoWidth={actuatedNormalize(77)}
                headingFont={fonts.notoSerifExtraCondensed}
                subHeadingFont={fonts.franklinGothicURW}
              />

              <View style={styles.otpInputWrapper}>
                <OtpInput
                  onChange={onOtpChange}
                  borderColor={theme.inputFillForegroundInteractiveFilled}
                  backgroundColor={theme.inputOutlineInteractivePressed}
                  resetOtpTrigger={resetOtpTrigger}
                />
              </View>

              {isTimerRunning ? (
                <CustomText
                  size={fontSize['xs']}
                  color={theme.subtitleTextSubtitle}
                  textStyles={styles.resendMessage}
                  weight="Boo"
                  fontFamily={fonts.franklinGothicURW}
                >
                  {resendText} {formattedTime}
                </CustomText>
              ) : (
                <View style={styles.resendCountdownWrapper}>
                  <CustomText
                    size={fontSize['xs']}
                    color={theme.subtitleTextSubtitle}
                    textStyles={styles.resendMessage}
                    weight="Boo"
                    fontFamily={fonts.franklinGothicURW}
                  >
                    {didntReceiveCode}
                  </CustomText>

                  <CustomButton
                    variant="text"
                    onPress={handleResendPress}
                    buttonText={resend}
                    disabled={resendLoading}
                    buttonTextColor={resendLoading ? theme.bodyTextMain : theme.bodyTextHyperlinked}
                    buttonTextSize={fontSize['xs']}
                    buttonTextWeight="Boo"
                    buttonTextFontFamily={fonts.franklinGothicURW}
                    buttonTextStyles={StyleSheet.flatten([
                      styles.resendMessage,
                      { textDecorationLine: 'underline' }
                    ])}
                  />
                </View>
              )}

              <CustomButton
                onPress={onValidate}
                buttonText={buttonText}
                disabled={otp.length !== 6}
                buttonStyles={[
                  styles.primaryButton,
                  otp.length !== 6 ? styles.primaryButtonDisabled : styles.primaryButtonEnabled
                ]}
                buttonTextColor={
                  otp.length !== 6 ? theme.primaryCTATextDisabled : theme.primaryCTATextDefault
                }
                buttonTextSize={fontSize['s']}
                buttonTextWeight="Dem"
                buttonTextFontFamily={fonts.franklinGothicURW}
                buttonTextStyles={styles.buttonText}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {isDeleteOtp && (
        <CustomText
          textStyles={styles.text}
          fontFamily={fonts.franklinGothicURW}
          size={fontSize.xs}
          weight="Boo"
        >
          {t('screens.deleteAccountOtp.text.sendQuery')}
        </CustomText>
      )}
      {toastVisible && setToastVisible && (
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
      )}

      {resendToastVisible && setResendToastVisible && (
        <CustomToast
          type={resendToastType}
          message={
            resendToastMessage === 'Network request failed'
              ? t('screens.splash.text.noInternetConnection')
              : resendToastMessage
          }
          isVisible={resendToastVisible}
          onDismiss={() => setResendToastVisible(false)}
        />
      )}

      {(loading || resendLoading) && <CustomLoader />}
    </SafeAreaView>
  );
};

export default OtpTemplate;
