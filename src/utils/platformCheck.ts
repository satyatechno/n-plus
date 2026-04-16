import { Platform } from 'react-native';

import constants from '@src/config/constants';

export const isIos = Platform.OS === constants.IOS ? true : false;
