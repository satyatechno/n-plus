import React from 'react';
import { Pressable, StyleSheet, View, Vibration, GestureResponderEvent } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';

import CustomText from '@src/views/atoms/CustomText';
import MyAccount from '@src/views/pages/main/MyAccount/MyAccount';
import {
  AccountIcon,
  HomeFilledIcon,
  HomeIcon,
  OpinionIcon,
  OpinionFilledIcon,
  VideoIcon,
  VideoFilledIcon,
  AccountIconFilled
} from '@src/assets/icons';
import { useTheme } from '@src/hooks/useTheme';
import Home from '@src/views/pages/main/Home/Home';
import { screenNames } from '@src/navigation/screenNames';
import Videos from '@src/views/pages/main/Videos/Videos';
import { fontSize, radius, spacing } from '@src/config/styleConsts';
import OpinionScreen from '@src/views/pages/main/OpinionTab/OpinionLandingPage';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { AppTheme } from '@src/themes/theme';
import { isIos } from '@src/utils/platformCheck';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ATOMS,
  ANALYTICS_ORGANISMS,
  getBottomTabAnalyticMolecule,
  getBottomTabAnalyticScreenPage
} from '@src/utils/analyticsConstants';

const Tab = createBottomTabNavigator();

interface TabBarButtonPropsExtended extends BottomTabBarButtonProps {
  theme: AppTheme;
  name: string;
  activeIndex: number;
}

/**
 * Custom tab bar button component with haptic feedback support
 * @param theme - Theme object containing app styling and color definitions
 * @param onPress - Callback function triggered when button is pressed
 * @param accessibilityState - Accessibility state of the button
 * @param children - Child components to render inside the button
 */

const TabBarButton = ({
  theme,
  onPress,
  accessibilityState,
  children,
  name,
  activeIndex
}: TabBarButtonPropsExtended) => {
  /**
   * Handles tab button press with haptic feedback for Android devices
   * @param event - Gesture responder event from the press action
   */
  const handlePress = (event: GestureResponderEvent) => {
    if (!accessibilityState?.selected && !isIos) {
      Vibration.vibrate(8);
    }
    onPress?.(event);
    logSelectContentEvent({
      ...getBottomTabAnalyticScreenPage(activeIndex),
      organisms: ANALYTICS_ORGANISMS.BOTTOM_NAV,
      content_type: getBottomTabAnalyticMolecule(name),
      content_name: getBottomTabAnalyticMolecule(name),
      content_action: ANALYTICS_ATOMS.TAP
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      android_ripple={{
        color: theme.titleForegroundInteractiveDefault30Alpha,
        borderless: false,
        foreground: true
      }}
      style={({ pressed }) => [styles.tabButton, pressed && styles.tabPressed]}
    >
      {({ pressed }) => (
        <>
          {children}

          {pressed && isIos && (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                styles.iosOverlay,
                { backgroundColor: theme.titleForegroundInteractiveDefault30Alpha }
              ]}
            />
          )}
        </>
      )}
    </Pressable>
  );
};

interface TabNavigatorRouteParams {
  initialTab?: string;
}

interface TabNavigatorProps {
  route?: RouteProp<Record<string, TabNavigatorRouteParams | undefined>, string>;
}

const MainTabNavigator = ({ route }: TabNavigatorProps) => {
  const [theme] = useTheme();
  const { t } = useTranslation();

  const initialTab = route?.params?.initialTab || screenNames.HOME;

  return (
    <Tab.Navigator
      key={initialTab}
      initialRouteName={initialTab}
      screenOptions={({ route, navigation }) => ({
        headerShown: false,

        /** Custom tab bar button with haptic feedback support */
        tabBarButton: (props) => (
          <TabBarButton
            {...props}
            theme={theme}
            name={route?.name}
            activeIndex={navigation.getState().index}
          />
        ),

        tabBarActiveTintColor: theme.tagsTextAuthor,
        tabBarInactiveTintColor: theme.textHeadingChipInactive,
        tabBarLabel: ({ focused, color }) => (
          <CustomText size={fontSize['xxs']} weight={focused ? 'Dem' : 'R'} color={color}>
            {`t(screens.bottomTab.text.${route.name.toLowerCase()})`}
          </CustomText>
        ),

        tabBarBackground: () => (
          <View style={styles.tabBarBackgroundContainer}>
            <LinearGradient
              colors={[`${theme.bottomTabColor1}E6`, `${theme.bottomTabColor2}CC`]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 2 }}
            />
          </View>
        ),

        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 0,
          position: 'absolute'
        },

        tabBarIcon: ({ focused }) => {
          const color = focused ? theme.tagsTextAuthor : theme.chipTextInactive;

          switch (route.name) {
            case screenNames.HOME:
              return focused ? <HomeFilledIcon color={color} /> : <HomeIcon color={color} />;
            case screenNames.VIDEOS:
              return focused ? <VideoFilledIcon color={color} /> : <VideoIcon color={color} />;
            case screenNames.OPINION:
              return focused ? <OpinionFilledIcon color={color} /> : <OpinionIcon color={color} />;
            case screenNames.MY_ACCOUNT:
              return focused ? <AccountIconFilled color={color} /> : <AccountIcon color={color} />;
            default:
              return null;
          }
        }
      })}
    >
      <Tab.Screen
        name={screenNames.HOME}
        component={Home}
        options={{ tabBarLabel: t('screens.bottomTab.text.home') }}
      />
      <Tab.Screen
        name={screenNames.VIDEOS}
        component={Videos}
        options={{ tabBarLabel: t('screens.bottomTab.text.videos') }}
      />
      <Tab.Screen
        name={screenNames.OPINION}
        component={OpinionScreen}
        options={{ tabBarLabel: t('screens.bottomTab.text.opinion') }}
      />
      <Tab.Screen
        name={screenNames.MY_ACCOUNT}
        component={MyAccount}
        options={{ tabBarLabel: t('screens.bottomTab.text.myAccount') }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarBackgroundContainer: {
    flex: 1
  },
  tabButton: {
    alignSelf: 'center',
    width: 70,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.l,
    overflow: 'hidden'
  },
  tabPressed: {
    transform: [{ scale: 0.96 }]
  },
  iosOverlay: {
    borderRadius: radius.l,
    height: actuatedNormalizeVertical(spacing['9xl'])
  }
});

export default MainTabNavigator;
