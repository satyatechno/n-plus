import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import MainTabNavigator from '@src/navigation/TabNavigation/TabNavigation';
import AuthorDetail from '@src/views/pages/main/Home/StoryPage/AuthorDetails';
import StoryPage from '@src/views/pages/main/Home/StoryPage/StoryPage';
import ActiveLiveBlogListing from '@src/views/pages/main/Home/ActiveLiveBlogListing';
import Liveblog from '@src/views/pages/main/Home/Liveblog';
import InactiveLiveBlogListing from '@src/views/pages/main/Home/InactiveLiveBlogListing';
import LiveTV from '@src/views/pages/main/Home/LiveTV';
import SearchLandingPage from '@src/views/pages/main/Home/Search/SearchLandingPage';
import CategoryListing from '@src/views/pages/main/Home/Category/CategoryListing';
import CategoryTopicDetailScreen from '@src/views/pages/main/Home/Category/CategoryTopicDetailScreen';
import Pressroom from '@src/views/pages/main/Home/Pressroom';
import DummyHome from '@src/views/pages/main/Home/DummyHome';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackScreens = () => (
  <HomeStack.Navigator
    initialRouteName={screenNames.MAIN_TAB_NAVIGATOR}
    screenOptions={{
      headerShown: false
    }}
  >
    <HomeStack.Screen name={screenNames.MAIN_TAB_NAVIGATOR} component={MainTabNavigator} />
    <HomeStack.Screen name={screenNames.AUTHOR_DETAILS} component={AuthorDetail} />
    <HomeStack.Screen
      name={screenNames.STORY_PAGE_RENDERER}
      component={StoryPage}
      getId={({ params }) => params?.slug}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen name={screenNames.LIVE_BLOG} component={Liveblog} />
    <HomeStack.Screen
      name={screenNames.ACTIVE_LIVE_BLOG_LISTING}
      component={ActiveLiveBlogListing}
    />
    <HomeStack.Screen
      name={screenNames.INACTIVE_LIVE_BLOG_LISTING}
      component={InactiveLiveBlogListing}
    />
    <HomeStack.Screen name={screenNames.CATEGORY_LISTING} component={CategoryListing} />
    <HomeStack.Screen
      name={screenNames.CATEGORY_DETAIL_SCREEN}
      component={CategoryTopicDetailScreen}
    />
    <HomeStack.Screen name={screenNames.LIVE_TV} component={LiveTV} />
    <HomeStack.Screen name={screenNames.SEARCH_SCREEN} component={SearchLandingPage} />
    <HomeStack.Screen name={screenNames.PRESS_ROOM_LANDING} component={Pressroom} />
    <HomeStack.Screen name={screenNames.DUMMY_HOME} component={DummyHome} />
  </HomeStack.Navigator>
);

export default HomeStackScreens;
