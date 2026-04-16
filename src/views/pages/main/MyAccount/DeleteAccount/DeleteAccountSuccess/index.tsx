import React from 'react';

import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { themeStyles } from '@src/views/pages/main/MyAccount/DeleteAccount/DeleteAccountSuccess/styles';
import { useTheme } from '@src/hooks/useTheme';
import useAuthStore from '@src/zustand/auth/authStore';
import SuccessScreen from '@src/views/templates/auth/SuccessScreen';
import { REMOVE_DEVICE_ID_QUERY } from '@src/graphql/main/home/queries';
import HandGestureIcon from '@src/assets/icons/HandGestureIcon';
import { useBlockBackNavigation } from '@src/hooks/useBlockBackNavigation';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ID_PAGE,
  SCREEN_PAGE_WEB_URL
} from '@src/utils/analyticsConstants';
import client from '@src/services/apollo/apolloClient';
import { clearCache } from '@src/utils/mmkv';

/**
 * A screen component for displaying a success message after the user has successfully deleted their account.
 *
 * This component uses the shared `OtpSuccess` template to show a themed success screen,
 * including an icon, a heading, a subheading, and a confirmation button.
 * It utilizes translations and theme-based styles, and renders the `HandGesture` icon.
 *
 * @returns {JSX.Element} The delete account success screen UI.
 */

const DeleteAccountSuccess: React.FC = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);
  const { deviceId, clearAuth, setShowLogoGif } = useAuthStore();
  useBlockBackNavigation();

  const [removeDeviceToken] = useMutation(REMOVE_DEVICE_ID_QUERY);

  const handlePress = async () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MI_CUENTA,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MI_CUENTA,
      screen_name: ANALYTICS_PAGE.ELIMINAR_CUENTA,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.FINALIZED}`,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_FINALIZED,
      content_name: t('screens.deleteAccountOtp.text.finalized'),
      content_action: ANALYTICS_ATOMS.TAP
    });

    try {
      await removeDeviceToken({
        variables: {
          deviceId
        }
      });
    } catch {
      // Continue even if device token removal fails - account is already deleted
    }

    // Clear Apollo cache and MMKV settings (same as logout flow)
    await client.clearStore();
    clearCache();

    // Clear auth state and navigate to auth screens
    clearAuth(true);
    setShowLogoGif(false);
  };

  return (
    <SuccessScreen
      title={t('screens.deleteAccountOtpSuccess.title')}
      subtitle={t('screens.deleteAccountOtpSuccess.text.heading')}
      buttonText={t('screens.deleteAccountOtpSuccess.text.finish')}
      onButtonPress={handlePress}
      buttonStyle={styles.continueButton}
      iconComponent={<HandGestureIcon color={theme.greyButtonSecondaryOutline} />}
      headingStyle={styles.headingStyle}
      subHeadingStyle={styles.subHeadingStyle}
    />
  );
};

export default DeleteAccountSuccess;
