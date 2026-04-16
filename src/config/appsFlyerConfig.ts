import Config from 'react-native-config';

interface AppsFlyerConfig {
  devKey: string;
  appId: string;
  isDebug: boolean;
  onInstallConversionDataListener: boolean;
  onDeepLinkListener: boolean;
  timeToWaitForATTUserAuthorization: number;
}

export const appsFlyerConfig: AppsFlyerConfig = {
  devKey: Config.APPSFLYER_DEV_KEY || '',
  appId: Config.APPSFLYER_APP_ID || '',
  isDebug: __DEV__, // true in development, false in production
  onInstallConversionDataListener: true,
  onDeepLinkListener: true,
  timeToWaitForATTUserAuthorization: 10 // 10 seconds for iOS ATT
};
