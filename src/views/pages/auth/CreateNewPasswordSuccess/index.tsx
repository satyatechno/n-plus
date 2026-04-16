import React from 'react';

import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CircularTickIcon } from '@src/assets/icons';
import { useTheme } from '@src/hooks/useTheme';
import { screenNames } from '@src/navigation/screenNames';
import { AuthStackParamList } from '@src/navigation/types';
import useAuthStore from '@src/zustand/auth/authStore';
import SuccessScreen from '@src/views/templates/auth/SuccessScreen';
import { themeStyles } from '@src/views/pages/auth/CreateNewPasswordSuccess/styles';

/**
 * A screen component for displaying a success message after the user has successfully verified
 * their OTP (One-Time Password) during the sign-up process.
 *
 * This component is responsible for rendering the UI for the success screen, which includes a
 * heading, subheading, and a button to continue to the next step.
 *
 * @returns The success screen UI.
 */

const CreateNewPasswordSuccess: React.FC = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { t } = useTranslation();
  const { setIsLogin, setShowLogoGif } = useAuthStore();
  const route = useRoute<RouteProp<AuthStackParamList, 'CreateAccountPassword'>>();
  const { email } = route.params || {};

  return (
    <SuccessScreen
      title={t('screens.createNewPassword.text.successTitle')}
      subtitle={t('screens.createNewPassword.text.successSubtitle')}
      buttonText={t('screens.createNewPassword.text.continue')}
      onButtonPress={() => {
        setIsLogin(true);
        setShowLogoGif(false);
        // Reset navigation stack to prevent going back to password change screens
        navigation.reset({
          index: 1,
          routes: [
            { name: screenNames.SPLASH },
            { name: screenNames.SOCIAL_AUTH, params: { email, showLoginScreen: true } }
          ]
        });
      }}
      buttonStyle={styles.continueButton}
      iconComponent={<CircularTickIcon color={theme.colorSecondary600} />}
    />
  );
};

export default CreateNewPasswordSuccess;
