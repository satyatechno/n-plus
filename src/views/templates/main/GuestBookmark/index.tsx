import React from 'react';

import { useTranslation } from 'react-i18next';

import CustomModal from '@src/views/organisms/CustomModal';
import useAuthStore from '@src/zustand/auth/authStore';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { ANALYTICS_ORGANISMS, ANALYTICS_MOLECULES } from '@src/utils/analyticsConstants';

interface GuestBookmarkModalProps {
  visible: boolean;
  onClose: () => void;
}

const GuestBookmarkModal: React.FC<GuestBookmarkModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { clearAuth } = useAuthStore();

  const handlePress = (showLogin = false) => {
    logSelectContentEvent({
      screen_name: 'Guest user: Alert',
      Tipo_Contenido: 'Onboarding_Guest userAlert',
      organisms: ANALYTICS_ORGANISMS.ONBOARDING.REGISTER_MODAL,
      content_type: showLogin
        ? ANALYTICS_MOLECULES.ONBOARDING.BUTTON_LOGIN
        : ANALYTICS_MOLECULES.ONBOARDING.BUTTON_REGISTER,
      content_name: showLogin ? 'Login' : 'Sign up',
      content_action: 'click'
    });

    onClose();

    clearAuth(showLogin);
  };

  return (
    <CustomModal
      visible={visible}
      modalTitle={t('screens.guestMyAccount.restricted.acessBookmarks')}
      modalMessage={t('screens.guestMyAccount.restricted.simplyLogIn')}
      cancelButtonText={t('screens.splash.text.login')}
      confirmButtonText={t('screens.splash.text.signUp')}
      onCancelPress={() => handlePress(true)}
      onConfirmPress={() => handlePress()}
      onOutsidePress={onClose}
      onRequestClose={onClose}
    />
  );
};

export default GuestBookmarkModal;
