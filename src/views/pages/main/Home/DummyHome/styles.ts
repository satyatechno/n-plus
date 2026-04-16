//TODO: The whole screen is made on a temporary basis.
import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { lineHeight, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    StoryPageButton: {
      alignItems: 'center'
    },
    StoryPageImage: {
      resizeMode: 'contain',
      width: '90%'
    },
    seeAllLiveBlogButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginTop: actuatedNormalizeVertical(spacing.xl),
      marginBottom: actuatedNormalizeVertical(spacing.xl)
    },
    seeAllLiveBlogButtonText: {
      lineHeight: actuatedNormalizeVertical(lineHeight.s)
    },
    seeLiveTVButton: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: actuatedNormalize(spacing.xxs),
      marginBottom: actuatedNormalizeVertical(spacing.xl)
    }
  });
