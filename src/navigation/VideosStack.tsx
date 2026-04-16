import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import { VideosStackParamList } from '@src/navigation/types';
import { screenNames } from '@src/navigation/screenNames';
import MainTabNavigator from '@src/navigation/TabNavigation/TabNavigation';
import TalentListing from '@src/views/pages/main/Videos/TalentListing';
import Programs from '@src/views/pages/main/Videos/Programs';
import EpisodeDetailPage from '@src/views/pages/main/Videos/EpisodeDetailPage';
import AllEpisodes from '@src/views/pages/main/Videos/AllEpisodes';
import AuthorBio from '@src/views/pages/main/Videos/AuthorBio';
import VideoDetailPage from '@src/views/pages/main/Videos/VideoDetailPage';
import ShortInvestigations from '@src/views/pages/main/Videos/NPlusFocus/ShortInvestigations';
import NPlusFocusLandingPage from '@src/views/pages/main/Videos/NPlusFocus/NPlusFocusLandingPage';
import PorElPlanetaLandingPage from '@src/views/pages/main/Videos/PorElPlaneta/PorElPlanetaLandingPage';
import PorElPlanetaDetailPage from '@src/views/pages/main/Videos/PorElPlaneta/PorElPlanetaDetailPage';
import PorElPlanetaDocumentaries from '@src/views/pages/main/Videos/PorElPlaneta/PorElPlanetaDocumentaries';
import InvestigationListingScreen from '@src/views/pages/main/Videos/NPlusFocus/InvestigationListingScreen';
import InvestigationDetailScreen from '@src/views/pages/main/Videos/NPlusFocus/InvestigationDetailScreen';
import InteractiveListing from '@src/views/pages/main/Videos/NPlusFocus/InteractiveListing';
import ShortInvestigationDetail from '@src/views/pages/main/Videos/NPlusFocus/ShortInvestigationDetailScreen';
import ProductionPage from '@src/views/pages/main/Videos/ProductionPage';

const VideosStack = createNativeStackNavigator<VideosStackParamList>();

const VideosStackScreens = () => (
  <VideosStack.Navigator
    initialRouteName={screenNames.VIDEOS}
    screenOptions={{
      headerShown: false
    }}
  >
    <VideosStack.Screen
      name={screenNames.VIDEOS}
      component={({
        route
      }: {
        route: RouteProp<VideosStackParamList, typeof screenNames.VIDEOS>;
      }) => <MainTabNavigator route={route} />}
    />
    <VideosStack.Screen name={screenNames.TALENT_LISTING} component={TalentListing} />
    <VideosStack.Screen name={screenNames.PROGRAMS} component={Programs} />
    <VideosStack.Screen name={screenNames.EPISODE_DETAIL_PAGE} component={EpisodeDetailPage} />
    <VideosStack.Screen name={screenNames.ALL_EPISODES} component={AllEpisodes} />
    <VideosStack.Screen name={screenNames.AUTHOR_BIO} component={AuthorBio} />
    <VideosStack.Screen name={screenNames.VIDEO_DETAIL_PAGE} component={VideoDetailPage} />
    <VideosStack.Screen name={screenNames.SHORT_INVESTIGATIONS} component={ShortInvestigations} />
    <VideosStack.Screen name={screenNames.INTERACTIVE_LISTING} component={InteractiveListing} />
    <VideosStack.Screen
      name={screenNames.NPLUS_FOCUS_LANDING_PAGE}
      component={NPlusFocusLandingPage}
    />
    <VideosStack.Screen
      name={screenNames.POR_EL_PLANETA_LANDING_PAGE}
      component={PorElPlanetaLandingPage}
    />
    <VideosStack.Screen
      name={screenNames.POR_EL_PLANETA_DETAIL_PAGE}
      component={PorElPlanetaDetailPage}
    />
    <VideosStack.Screen
      name={screenNames.POR_EL_PLANETA_DOCUMENTARIES}
      component={PorElPlanetaDocumentaries}
    />
    <VideosStack.Screen
      name={screenNames.INVESTIGATION_LISTING_SCREEN}
      component={InvestigationListingScreen}
    />
    <VideosStack.Screen
      name={screenNames.INVESTIGATION_DETAIL_SCREEN}
      component={InvestigationDetailScreen}
    />
    <VideosStack.Screen
      name={screenNames.SHORT_INVESTIGATION_DETAIL_SCREEN}
      component={ShortInvestigationDetail}
    />
    <VideosStack.Screen name={screenNames.PRODUCTION_PAGE} component={ProductionPage} />
  </VideosStack.Navigator>
);

export default VideosStackScreens;
