import { useColorScheme } from 'react-native';

import useThemeStore from '@src/zustand/auth/themeStore';
import constants from '@src/config/constants';
import { AppTheme, darkTheme, lightTheme } from '@src/themes/theme';

/**
 * Custom hook to resolve current theme based on user preference and system settings.
 *
 * Returns:
 * - resolvedTheme: actual theme object (lightTheme or darkTheme)
 * - selectedTheme: user's selected theme setting ('light' | 'dark' | 'system')
 * - setTheme: function to update theme setting
 * - systemAppearance: current system color scheme ('light' | 'dark')
 */
export const useTheme = (
  customTheme?: 'light' | 'dark'
): [
  AppTheme,
  'light' | 'dark' | 'system',
  (theme: 'light' | 'dark' | 'system') => void,
  'light' | 'dark'
] => {
  const { theme: selectedTheme, setTheme } = useThemeStore();
  const systemColorScheme = useColorScheme(); // 'light' | 'dark' | null

  const systemAppearance: 'light' | 'dark' =
    systemColorScheme === 'dark' ? constants.DARK : constants.LIGHT;

  const resolvedTheme: AppTheme = (() => {
    if (customTheme) {
      return customTheme === constants.DARK ? darkTheme : lightTheme;
    }

    if (selectedTheme === 'system') {
      return systemAppearance === constants.DARK ? darkTheme : lightTheme;
    }

    return selectedTheme === constants.DARK ? darkTheme : lightTheme;
  })();

  return [resolvedTheme, selectedTheme, setTheme, systemAppearance];
};
