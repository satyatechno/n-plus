import React from 'react';
import { StatusBar } from 'react-native';

import { ApolloProvider } from '@apollo/client';

import '@src/config/localization/i18n';
import AppNavigation from '@src/navigation/AppNavigation';
import InternetMonitor from '@src/views/organisms/InternetMonitor/index';
import { useTheme } from '@src/hooks/useTheme';
import client from '@src/services/apollo/apolloClient';
import { darkTheme } from '@src/themes/theme';
import { useAppInitialization } from '@src/hooks/useAppInitialization';
import useFontScaleInitialization from '@src/hooks/useFontScaleInitialization';
import { useWifiWatcher } from '@src/hooks/useWifiWatcher';

const App: React.FC = () => {
  useAppInitialization();
  useFontScaleInitialization();
  useWifiWatcher();

  const [theme] = useTheme();

  return (
    <ApolloProvider client={client}>
      <StatusBar
        barStyle={theme === darkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={theme.statusBarTheme}
      />
      <InternetMonitor />
      <AppNavigation />
    </ApolloProvider>
  );
};

export default App;
