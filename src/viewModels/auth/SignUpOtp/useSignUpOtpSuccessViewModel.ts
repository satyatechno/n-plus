import { useCallback } from 'react';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import useAuthStore from '@src/zustand/auth/authStore';
import { DeviceTokenService } from '@src/services/api/DeviceTokenService';
import {
  logLoginSignUpEvent,
  logSelectContentEvent
} from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS,
  ANALYTICS_META_EVENTS,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION
} from '@src/utils/analyticsConstants';

interface UseSignUpOtpSuccessViewModel {
  onContinue: () => void;
}

const useSignUpOtpSuccessViewModel = (): UseSignUpOtpSuccessViewModel => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SignUpOtpSuccess'>>();
  const { authToken } = route.params;
  const { setIsLogin, deviceId } = useAuthStore();

  const onContinue = useCallback(() => {
    logSelectContentEvent(
      {
        idPage: ANALYTICS_PAGE.CREATE_ACCOUNT_VERIFIED,
        screen_page_web_url: ANALYTICS_PAGE.CREATE_ACCOUNT_VERIFIED,
        screen_name: ANALYTICS_PAGE.CREATE_ACCOUNT_VERIFIED,
        Tipo_Contenido: `${ANALYTICS_COLLECTION.ONBOARDING}_${ANALYTICS_PAGE.CREATE_ACCOUNT_VERIFIED}`,
        organisms: ANALYTICS_ORGANISMS.ONBOARDING.VERIFIED_ACCOUNT,
        content_type: ANALYTICS_MOLECULES.ONBOARDING.BUTTON_CONTINUE,
        content_name: 'Continuar cuenta verificada',
        content_action: ANALYTICS_ATOMS.TAP,
        meta_content_action: ANALYTICS_ATOMS.REGISTER_SUCCESSFULL
      },
      ANALYTICS_META_EVENTS.LEAD
    );

    logLoginSignUpEvent(
      {
        screen_name: ANALYTICS_PAGE.CREATE_ACCOUNT_VERIFIED,
        method: 'email'
      },
      ANALYTICS_META_EVENTS.LEAD,
      'sign_up'
    );
    setIsLogin(true);

    // Sync device token immediately after successful registration to ensure backend tracking
    if (deviceId) {
      void DeviceTokenService.storeToken(deviceId);
    }
    navigation.navigate(screenNames.SET_RECOMMENDATIONS, { isOnboarding: true, authToken });
  }, [navigation, authToken, setIsLogin, deviceId]);

  return { onContinue };
};

export default useSignUpOtpSuccessViewModel;
