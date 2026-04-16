import { useCallback } from 'react';
import { Linking } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import { ANALYTICS_ORGANISMS, ANALYTICS_MOLECULES } from '@src/utils/analyticsConstants';
import { MyAccountStackParamList } from '@src/navigation/types';

export const useContactUsViewModel = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<MyAccountStackParamList>>();

  const goBack = () => {
    logSelectContentEvent({
      screen_name: 'Support',
      Tipo_Contenido: 'My account_Support',
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BACK,
      content_name: 'Back',
      content_action: 'back'
    });
    navigation.goBack();
  };

  const handleContactPress = useCallback(() => {
    const emailBody = t('screens.contactUs.emailBody');
    const encodedBody = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:contacto@nmas.com.mx?body=${encodedBody}`;
    Linking.openURL(mailtoUrl);
  }, [t]);

  return {
    goBack,
    handleContactPress
  };
};
