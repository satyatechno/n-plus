import { useEffect } from 'react';
import { AppState, AppStateStatus, InteractionManager } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { TextSize } from '@src/models/main/MyAccount/Settings';
import { useSettingsStore } from '@src/zustand/main/settingsStore';

const useFontScaleInitialization = () => {
  const { textSize, setTextSize, setLastCustomSize, setSystemFontScale } = useSettingsStore();

  useEffect(() => {
    const initialize = async () => {
      const systemFontScale = await DeviceInfo.getFontScale();
      const fallback = ['Chica', 'Mediana', 'Grande'].includes(textSize) ? textSize : 'Mediana';

      setTextSize(textSize ?? 'Mediana');
      setLastCustomSize(fallback as TextSize);
      setSystemFontScale(systemFontScale);
    };

    // Defer font-scale initialization until after initial interactions
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      void initialize();
    });

    return () => {
      interactionHandle.cancel?.();
    };
  }, [textSize, setTextSize, setLastCustomSize, setSystemFontScale]);

  useEffect(() => {
    if (textSize !== 'System') return;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const newScale = await DeviceInfo.getFontScale();
        setSystemFontScale(newScale);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [textSize, setSystemFontScale]);
};

export default useFontScaleInitialization;
