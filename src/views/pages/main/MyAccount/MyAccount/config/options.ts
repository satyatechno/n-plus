import { TFunction } from 'i18next';

import {
  BookMark,
  ChatInfoIcon,
  GavelIcon,
  KidStarIcon,
  LockIcon,
  MailIcon,
  NotificationsIcon,
  PrivacyTipIcon,
  ShareIcon,
  ThumbsUpIcon,
  UserIcon,
  NewsModeIcon
} from '@src/assets/icons';
import { screenNames } from '@src/navigation/screenNames';
import { isIos } from '@src/utils/platformCheck';
import { PRIVACY_POLICY_URL, RIGHT_TO_REPLY, TERMS_CONDITIONS_URL } from './socialLinks';

export const getAllOptions = (t: TFunction) => [
  {
    label: t('screens.myAccount.options.updateProfile'),
    icon: UserIcon,
    actionType: 'navigate',
    target: screenNames.UPDATE_PROFILE
  },
  {
    label: t('screens.myAccount.options.changePassword'),
    icon: LockIcon,
    actionType: 'navigate',
    target: screenNames.CHANGE_PASSWORD
  },
  {
    label: t('screens.myAccount.options.saved'),
    icon: BookMark,
    actionType: 'navigate',
    target: screenNames.BOOKMARKS
  },
  {
    label: t('screens.myAccount.options.myNotifications'),
    icon: NotificationsIcon,
    actionType: 'navigate',
    target: screenNames.MY_NOTIFICATION
  },
  {
    label: t('screens.myAccount.options.recommended'),
    icon: ThumbsUpIcon,
    actionType: 'navigate',
    target: screenNames.RECOMMENDED_FOR_YOU
  },
  {
    label: t('screens.myAccount.options.newletter'),
    icon: NewsModeIcon,
    actionType: 'navigate',
    target: screenNames.NEWSLETTERS
  },
  {
    label: t('screens.myAccount.options.share'),
    icon: ShareIcon,
    actionType: 'share',
    target: isIos ? 'https://apps.apple.com/us/app/n-stg/id6752780978' : 'https://play.google.com'
  },
  {
    label: t('screens.myAccount.options.rateApp'),
    icon: KidStarIcon,
    actionType: 'webview',
    target: isIos ? 'https://appstore.com' : 'https://play.google.com'
  },
  {
    label: t('screens.myAccount.options.contactUs'),
    icon: MailIcon,
    actionType: 'navigate',
    target: screenNames.CONTACT_US
  }
];

export const getSocialLoginOptions = (t: TFunction) => [
  {
    label: t('screens.myAccount.options.updateProfile'),
    icon: UserIcon,
    actionType: 'navigate',
    target: screenNames.UPDATE_PROFILE
  },
  {
    label: t('screens.myAccount.options.saved'),
    icon: BookMark,
    actionType: 'navigate',
    target: screenNames.BOOKMARKS
  },
  {
    label: t('screens.myAccount.options.myNotifications'),
    icon: NotificationsIcon,
    actionType: 'navigate',
    target: screenNames.MY_NOTIFICATION
  },
  {
    label: t('screens.myAccount.options.recommended'),
    icon: ThumbsUpIcon,
    actionType: 'navigate',
    target: screenNames.RECOMMENDED_FOR_YOU
  },
  {
    label: t('screens.myAccount.options.newletter'),
    icon: NewsModeIcon,
    actionType: 'navigate',
    target: screenNames.NEWSLETTERS
  },
  {
    label: t('screens.myAccount.options.share'),
    icon: ShareIcon,
    actionType: 'share',
    target: isIos ? 'https://apps.apple.com/us/app/n-stg/id6752780978' : 'https://play.google.com'
  },
  {
    label: t('screens.myAccount.options.rateApp'),
    icon: KidStarIcon,
    actionType: 'webview',
    target: isIos ? 'https://appstore.com' : 'https://play.google.com'
  },
  {
    label: t('screens.myAccount.options.contactUs'),
    icon: MailIcon,
    actionType: 'navigate',
    target: screenNames.CONTACT_US
  }
];

export const getSecondaryOptions = (t: TFunction) => [
  {
    label: t('screens.myAccount.options.rightToReply'),
    icon: ChatInfoIcon,
    actionType: 'webview',
    target: RIGHT_TO_REPLY
  },
  {
    label: t('screens.myAccount.options.termsConditions'),
    icon: GavelIcon,
    actionType: 'webview',
    target: TERMS_CONDITIONS_URL
  },
  {
    label: t('screens.myAccount.options.privacyNotice'),
    icon: PrivacyTipIcon,
    actionType: 'webview',
    target: PRIVACY_POLICY_URL
  }
];

// for skeleton loader fix later
export const primaryOptions = [
  {
    label: 'screens.myAccount.options.updateProfile',
    icon: UserIcon,
    actionType: 'navigate',
    target: screenNames.UPDATE_PROFILE
  },
  {
    label: 'screens.myAccount.options.changePassword',
    icon: LockIcon,
    actionType: 'navigate',
    target: screenNames.CHANGE_PASSWORD
  },
  {
    label: 'screens.myAccount.options.saved',
    icon: BookMark,
    actionType: 'navigate',
    target: 'SavedArticlesScreen'
  },
  {
    label: 'screens.myAccount.options.myNotifications',
    icon: NotificationsIcon,
    actionType: 'navigate',
    target: screenNames.NOTIFICATION_SETTING
  },
  {
    label: 'screens.myAccount.options.recommended',
    icon: ThumbsUpIcon,
    actionType: 'navigate',
    target: screenNames.RECOMMENDED_FOR_YOU
  },
  {
    label: 'screens.myAccount.options.newletter',
    icon: NewsModeIcon,
    actionType: 'navigate',
    target: screenNames.NEWSLETTERS
  },
  {
    label: 'screens.myAccount.options.share',
    icon: ShareIcon,
    actionType: 'share',
    target: 'https://play.google.com/store/apps/details?id=com.app'
  },
  {
    label: 'screens.myAccount.options.rateApp',
    icon: KidStarIcon,
    actionType: 'webview',
    target: 'https://en.wikipedia.org/wiki/Roman'
  },
  {
    label: 'screens.myAccount.options.contactUs',
    icon: MailIcon,
    actionType: 'navigate',
    target: screenNames.CONTACT_US
  }
];

export const secondaryOptions = [
  {
    label: 'screens.myAccount.options.rightToReply',
    icon: ChatInfoIcon,
    actionType: 'webview',
    target: 'https://en.wikipedia.org/wiki/Roman'
  },
  {
    label: 'screens.myAccount.options.termsConditions',
    icon: GavelIcon,
    actionType: 'webview',
    target: TERMS_CONDITIONS_URL
  },
  {
    label: 'screens.myAccount.options.privacyNotice',
    icon: PrivacyTipIcon,
    actionType: 'webview',
    target: PRIVACY_POLICY_URL
  }
];
