import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';

import CustomToast from '@src/views/molecules/CustomToast';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';
import { isIos } from '@src/utils/platformCheck';
import useNetworkStore from '@src/zustand/networkStore';

const InternetMonitor = () => {
  const { t } = useTranslation();
  const { isInternetConnection } = useNetworkStore();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!isInternetConnection) {
      setAlertVisible(true);
    } else {
      setAlertVisible(false);
    }
  }, [isInternetConnection]);

  return (
    <View
      style={{
        paddingHorizontal: actuatedNormalize(spacing['xs']),
        top: isIos ? actuatedNormalizeVertical(54) : actuatedNormalizeVertical(25)
      }}
    >
      <CustomToast
        type="error"
        message={t('screens.splash.text.noInternet')}
        subMessage={t('screens.splash.text.checkConnection')}
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default InternetMonitor;
