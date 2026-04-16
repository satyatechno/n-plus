import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MyAccountStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import SetRecommendations from '@src/views/pages/auth/SetRecommendations';
import RecommendedForYou from '@src/views/pages/main/MyAccount/RecommendedForYou';
import UpdateProfile from '@src/views/pages/main/MyAccount/UpdateProfile';
import Newsletters from '@src/views/pages/main/MyAccount/Newsletters';
import SettingsScreen from '@src/views/pages/main/MyAccount/Settings';
import NotificationSetting from '@src/views/pages/main/MyAccount/NotificationSetting';
import NotificationDetail from '@src/views/pages/main/MyAccount/NotificationDetail';
import DeleteAccountConfirmation from '@src/views/pages/main/MyAccount/DeleteAccount/DeleteAccountConfirmation';
import ChangePassword from '@src/views/pages/main/MyAccount/ChangePassword';
import ContactUs from '@src/views/pages/main/MyAccount/ContactUs';
import DeleteAccountOtp from '@src/views/pages/main/MyAccount/DeleteAccount/DeleteAccountOtp';
import DeleteAccountSuccess from '@src/views/pages/main/MyAccount/DeleteAccount/DeleteAccountSuccess';
import MyAccount from '@src/views/pages/main/MyAccount/MyAccount';
import MyNotification from '@src/views/pages/main/MyAccount/MyNotification';
import Bookmarks from '@src/views/pages/main/MyAccount/Bookmarks';
import SubscribeToNewsletter from '@src/views/pages/main/MyAccount/Newsletters/components/SubscribeToNewsletter';

const MyAccountStack = createNativeStackNavigator<MyAccountStackParamList>();

const MyAccountStackScreens = () => (
  <MyAccountStack.Navigator
    initialRouteName={screenNames.MY_ACCOUNT}
    screenOptions={{
      headerShown: false
    }}
  >
    <MyAccountStack.Screen name={screenNames.MY_ACCOUNT} component={MyAccount} />
    <MyAccountStack.Screen name={screenNames.MY_NOTIFICATION} component={MyNotification} />
    <MyAccountStack.Screen
      name={screenNames.NOTIFICATION_SETTING}
      component={NotificationSetting}
    />
    <MyAccountStack.Screen
      name={screenNames.DELETE_ACCOUNT_CONFIRMATION}
      component={DeleteAccountConfirmation}
    />
    <MyAccountStack.Screen
      name={screenNames.SET_RECOMMENDATIONS}
      component={SetRecommendations}
      initialParams={{ isOnboarding: true }}
    />
    <MyAccountStack.Screen name={screenNames.DELETE_ACCOUNT_OTP} component={DeleteAccountOtp} />
    <MyAccountStack.Screen
      name={screenNames.DELETE_ACCOUNT_OTP_SUCCESS}
      component={DeleteAccountSuccess}
      options={{ gestureEnabled: false }}
    />
    <MyAccountStack.Screen name={screenNames.CHANGE_PASSWORD} component={ChangePassword} />
    <MyAccountStack.Screen name={screenNames.SETTINGS} component={SettingsScreen} />
    <MyAccountStack.Screen name={screenNames.NOTIFICATION_DETAIL} component={NotificationDetail} />
    <MyAccountStack.Screen name={screenNames.RECOMMENDED_FOR_YOU} component={RecommendedForYou} />
    <MyAccountStack.Screen name={screenNames.UPDATE_PROFILE} component={UpdateProfile} />
    <MyAccountStack.Screen name={screenNames.NEWSLETTERS} component={Newsletters} />
    <MyAccountStack.Screen name={screenNames.CONTACT_US} component={ContactUs} />
    <MyAccountStack.Screen name={screenNames.BOOKMARKS} component={Bookmarks} />
    <MyAccountStack.Screen
      name={screenNames.SUBSCRIBE_TO_NEWSLETTER}
      component={SubscribeToNewsletter}
    />
  </MyAccountStack.Navigator>
);

export default MyAccountStackScreens;
