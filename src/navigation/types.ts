import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  Splash: undefined;
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  MyAccountStack: NavigatorScreenParams<MyAccountStackParamList>;
  VideosStack: NavigatorScreenParams<VideosStackParamList>;
  NPlusFocusLandingPage: undefined;
  PorElPlanetaLandingPage: undefined;
  CategoryDetail: { slug: string };
  StoryDetail: { slug: string };
  LiveblogListing: undefined;
  LiveblogDetail: { slug: string };
  PressRoomLanding: undefined;
  PressRoomDetail: { slug: string };
  ProductionLanding: undefined;
  InvestigationDetail: { slug: string };
  ProgramLanding: undefined;
  ProgramDetail: { slug: string };
  TalentListing: undefined;
  TalentDetail: { slug: string };
  VideoLanding: undefined;
  VideoDetail: { slug: string };
  OpinionStack: NavigatorScreenParams<OpinionStackParamList>;
  ProductionPage: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  CreateNewPassword: { email: string };
  ForgotPassword: { email: string };
  ForgotPasswordOtp: { email: string };
  ForgotPasswordOtpVerify: { email: string };
  Login: { email: string };
  SetRecommendations: { isOnboarding?: boolean; authToken?: string };
  SocialAuth: { email?: string; showLoginScreen?: boolean };
  SignUpOtp: { email: string; password: string };
  SignUpOtpSuccess: { authToken: string };
  CreateAccountPassword: { email: string };
  CreateNewPasswordSuccess: { email: string };
  NotificationAlert: undefined;
};

export type MyAccountStackParamList = {
  ChangePassword: undefined;
  ContactUs: undefined;
  DeleteAccountOtp: { email: string; finalReason: string };
  DeleteAccountOtpSuccess: undefined;
  SetRecommendations: { isOnboarding?: boolean };
  GuestMyAccount: undefined;
  RecommendedForYou: { isOnboarding: boolean };
  UpdateProfile: undefined;
  Newsletters: undefined;
  Settings: undefined;
  NotificationSetting: undefined;
  NotificationDetail: { type: string };
  MyAccount: undefined;
  DeleteAccountConfirmation: undefined;
  MyNotification: undefined;
  Bookmarks: undefined;
  SubscribeToNewsletter: {
    selectedNewsletters: { newsletter: string; isSubscribed: boolean }[];
  };
};
export type HomeStackParamList = {
  MainTabNavigator: { initialTab?: string; entryId?: string };
  Home: { initialTab?: string; entryId?: string };
  AuthorDetails: { id: string; slug?: string; userId?: string };
  StoryPage: { slug: string };
  LiveBlog: { slug: string; isLive?: boolean; entryId?: string };
  ActiveLiveBlogListing: undefined;
  InactiveLiveBlogListing: undefined;
  CategoryListing: undefined;
  LiveTv: { channelIndex?: number };
  SearchLandingPage: undefined;
  SearchLandingPageScreen: undefined;
  CategoryTopicDetailScreen: {
    slug: string;
    id?: string;
    title?: string;
    type?: 'category' | 'topic';
  };
  SearchScreen: { showSearchResult?: boolean; searchText?: string };
  PressRoomLanding: undefined;
  DummyHome: undefined;
};

export type VideosStackParamList = {
  Videos: { initialTab?: string };
  TalentListing: undefined;
  Programs: { slug?: string | null; channel?: string | number | null; id?: number | string | null };
  EpisodeDetailPage: { slug?: string; timeWatched?: number; isProgram?: boolean };
  AllEpisodes: { slug?: string; id?: number | string | null };
  AuthorBio: { slug: string };
  VideoDetailPage: { slug: string };
  ShortInvestigations: undefined;
  InteractiveListing: undefined;
  NPlusFocusLandingPage: undefined;
  PorElPlanetaLandingPage: undefined;
  PorElPlanetaDetailPage: { slug: string; timeWatched?: number; productionId?: string };
  PorElPlanetaDocumentaries: undefined;
  InvestigationListingScreen: undefined;
  InvestigationDetailScreen: { slug: string; timeWatched?: number };
  ShortInvestigationDetailScreen: { slug: string };
  ProductionPage: undefined;
};

export type OpinionStackParamList = {
  Opinión: { initialTab?: string };
  OpinionLandingPage: undefined;
  OpinionDetailPage: { slug: string; collection?: string };
};

export type SocialAuthNavigationProps = NativeStackScreenProps<AuthStackParamList, 'SocialAuth'>;

export type RecommendationsNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'SetRecommendations'
>;

export type LoginNavigationProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export type SplashNavigationProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export type SignUpOtpNavigationProps = NativeStackScreenProps<AuthStackParamList, 'SignUpOtp'>;

export type SignUpOtpSuccessNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'SignUpOtpSuccess'
>;

export type CreateAccountPasswordNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'CreateAccountPassword'
>;

export type NotificationAlertNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'NotificationAlert'
>;

export type ForgotPasswordOtpVerifyNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPasswordOtpVerify'
>;

export type ForgotPasswordNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export type CreateNewPasswordNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'CreateNewPassword'
>;

export type CreateNewPasswordSuccessNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'CreateNewPasswordSuccess'
>;

export type SetRecommendedForYouNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'SetRecommendations'
>;

export type RecommendedForYouNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'RecommendedForYou'
>;

export type GuestMyAccountNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'GuestMyAccount'
>;

export type BookmarksNavigationProps = NativeStackScreenProps<MyAccountStackParamList, 'Bookmarks'>;

export type ContactUsNavigationProps = NativeStackScreenProps<MyAccountStackParamList, 'ContactUs'>;

export type UpdateProfileNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'UpdateProfile'
>;

export type NewslettersNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'Newsletters'
>;

export type SettingsNavigationProps = NativeStackScreenProps<MyAccountStackParamList, 'Settings'>;

export type NotificationSettingsNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'NotificationSetting'
>;

export type NotificationDetailNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'NotificationDetail'
>;

export type MyAccountNavigationProps = NativeStackScreenProps<MyAccountStackParamList, 'MyAccount'>;

export type DeleteAccountConfirmationNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'DeleteAccountConfirmation'
>;

export type DeleteAccountOtpNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'DeleteAccountOtp'
>;

export type DeleteAccountOtpSuccessNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'DeleteAccountOtpSuccess'
>;

export type ChangePasswordNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'ChangePassword'
>;

export type AuthorDetailsNavigationProps = NativeStackScreenProps<
  HomeStackParamList,
  'AuthorDetails'
>;

export type HomeNavigationProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export type StoryPageNavigationProps = NativeStackScreenProps<HomeStackParamList, 'StoryPage'>;

export type VideosPageNavigationProps = NativeStackScreenProps<VideosStackParamList, 'Videos'>;

export type InteractiveListingPageNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'InteractiveListing'
>;

export type ProgramsPageNavigationProps = NativeStackScreenProps<VideosStackParamList, 'Programs'>;

export type EpisodeDetailPageNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'EpisodeDetailPage'
>;

export type AllEpisodesPageNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'AllEpisodes'
>;

export type AuthorBioPageNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'AuthorBio'
>;

export type VideoDetailPageNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'VideoDetailPage'
>;

export type NPlusFocusLandingPageNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'NPlusFocusLandingPage'
>;

export type PorElPlanetaLandingPageNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'PorElPlanetaLandingPage'
>;
export type InvestigationListingScreenNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'InvestigationListingScreen'
>;

export type InvestigationDetailScreenNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'InvestigationDetailScreen'
>;

export type ShortInvestigationDetailScreenNavigationProps = NativeStackScreenProps<
  VideosStackParamList,
  'ShortInvestigationDetailScreen'
>;

export type SearchScreenNavigationProps = NativeStackScreenProps<
  HomeStackParamList,
  'SearchScreen'
>;

export type CategoryListingNavigationProps = NativeStackScreenProps<
  HomeStackParamList,
  'CategoryListing'
>;

export type CategoryTopicDetailScreenNavigationProps = NativeStackScreenProps<
  HomeStackParamList,
  'CategoryTopicDetailScreen'
>;

export type SubscribeToNewsletterNavigationProps = NativeStackScreenProps<
  MyAccountStackParamList,
  'SubscribeToNewsletter'
>;
