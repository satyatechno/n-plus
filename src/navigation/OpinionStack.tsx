import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { screenNames } from '@src/navigation/screenNames';
import OpinionScreen from '@src/views/pages/main/OpinionTab/OpinionLandingPage';
import { OpinionStackParamList } from '@src/navigation/types';
import OpinionDetailPage from '@src/views/pages/main/OpinionTab/OpinionDetailPage';
import MainTabNavigator from '@src/navigation/TabNavigation/TabNavigation';

const OpinionStack = createNativeStackNavigator<OpinionStackParamList>();

const OpinionStackScreens = () => (
  <OpinionStack.Navigator
    initialRouteName={screenNames.OPINION_LANDING_PAGE}
    screenOptions={{
      headerShown: false
    }}
  >
    <OpinionStack.Screen
      name={screenNames.OPINION}
      component={({
        route
      }: {
        route: RouteProp<OpinionStackParamList, typeof screenNames.OPINION>;
      }) => <MainTabNavigator route={route} />}
    />
    <OpinionStack.Screen name={screenNames.OPINION_LANDING_PAGE} component={OpinionScreen} />
    <OpinionStack.Screen name={screenNames.OPINION_DETAIL_PAGE} component={OpinionDetailPage} />
  </OpinionStack.Navigator>
);

export default OpinionStackScreens;
