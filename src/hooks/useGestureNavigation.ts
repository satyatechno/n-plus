import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useGestureNavigation = () => {
  const insets = useSafeAreaInsets();
  const isGestureNavigation = insets.bottom > 47;
  return isGestureNavigation;
};
