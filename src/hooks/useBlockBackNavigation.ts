import { useCallback, useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

/**
 * Custom hook to block back navigation in a screen/component.
 *
 * - Prevents the user from navigating back using the hardware back button (Android)
 *   or gestures/software back on iOS and Android.
 * - Use this hook inside a screen to disable the back gesture and hardware back
 *   button (for flows such as protected success screens, OTP confirmations, etc).
 *
 * Example:
 * ```
 * const MyScreen = () => {
 *   useBlockBackNavigation();
 *   // ...
 * }
 * ```
 *
 * The blocking is automatically removed when the component is unmounted.
 */

export const useBlockBackNavigation = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
      }
    }, [])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const actionType = e.data?.action?.type;

      if (actionType === 'GO_BACK') {
        e.preventDefault();
      }
    });

    return unsubscribe;
  }, [navigation]);
};
