import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import SplashScreen from '@src/views/pages/auth/Splash';
import LoginScreen from '@src/views/pages/auth/Login';
import SignUpOtp from '@src/views/pages/auth/SignUpOtp';
import SocialMediaAuth from '@src/views/pages/auth/SocialMediaAuth';
import SetRecommendations from '@src/views/pages/auth/SetRecommendations';
import NotificationAlert from '@src/views/pages/auth/NotificationAlert';
import CreateAccountPassword from '@src/views/pages/auth/CreateAccountPassword';
import CreateNewPassword from '@src/views/pages/auth/CreateNewPassword';
import ForgotPassword from '@src/views/pages/auth/ForgotPassword';
import SignUpOtpSuccess from '@src/views/pages/auth/SignUpOtpSuccess';
import ForgotPasswordOtp from '@src/views/pages/auth/ForgotPassword/ForgotPasswordOtpVerify';
import CreateNewPasswordSuccess from '@src/views/pages/auth/CreateNewPasswordSuccess';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackScreens = () => (
  <AuthStack.Navigator initialRouteName={screenNames.SPLASH} screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name={screenNames.SPLASH} component={SplashScreen} />
    <AuthStack.Screen name={screenNames.LOGIN} component={LoginScreen} />
    <AuthStack.Screen name={screenNames.SIGN_UP_OTP} component={SignUpOtp} />
    <AuthStack.Screen name={screenNames.SOCIAL_AUTH} component={SocialMediaAuth} />
    <AuthStack.Screen
      name={screenNames.CREATE_ACCOUNT_PASSWORD}
      component={CreateAccountPassword}
    />
    <AuthStack.Screen name={screenNames.FORGOT_PASSWORD} component={ForgotPassword} />
    <AuthStack.Screen name={screenNames.FORGOT_PASSWORD_OTP_VERIFY} component={ForgotPasswordOtp} />
    <AuthStack.Screen name={screenNames.CREATE_NEW_PASSWORD} component={CreateNewPassword} />
    <AuthStack.Screen
      name={screenNames.SIGN_UP_OTP_SUCCESS}
      component={SignUpOtpSuccess}
      options={{ gestureEnabled: false }}
    />
    <AuthStack.Screen name={screenNames.SET_RECOMMENDATIONS} component={SetRecommendations} />
    <AuthStack.Screen name={screenNames.NOTIFICATION_ALERT} component={NotificationAlert} />
    <AuthStack.Screen
      name={screenNames.CREATE_NEW_PASSWORD_SUCCESS}
      component={CreateNewPasswordSuccess}
    />
  </AuthStack.Navigator>
);

export default AuthStackScreens;
