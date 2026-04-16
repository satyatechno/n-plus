declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.webp' {
  const content: number; // React Native ImageSource type (number = require'd resource)
  export default content;
}

declare module 'indigitall-react-native-plugin' {
  export interface PushConfig {
    appKey: string;
    senderId: string;
    urlDeviceApi: string;
    autoRequestPushPermission?: boolean;
  }

  export interface Device {
    deviceId: string;
  }

  export type SuccessCB = (device: Device) => void;
  export type ErrorCB = (device: Device) => void;
  export type FailureCB = () => void;

  export const Push: {
    init: (
      config: PushConfig,
      successCallback: SuccessCB,
      errorCallback: ErrorCB,
      failureCallback: FailureCB
    ) => void;
    requestPushPermission: () => void;
  };
}
