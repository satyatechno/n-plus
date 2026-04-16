import { AppTheme } from '@src/themes/theme';

export interface HomeViewModel {
  t: (key: string) => string;
  theme: AppTheme;
  storySlugs: { title: string; readTime: string; slug: string; categories: { title: string } }[];
  openStoryPage: (slug: string) => void;
  onSeeAllActiveLiveBLogsPress: () => void;
  onSeeLiveTVPress: () => void;
  postsLoading: boolean;
  refreshLoader: boolean;
  onRefresh: () => void;
  goBack: () => void;
}
