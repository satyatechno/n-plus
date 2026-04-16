import { StyleSheet } from 'react-native';

import { borderWidth, letterSpacing, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    blogMediaContainer: {
      width: '100%',
      height: 222
    },
    fallbackImageContainerStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.filledButtonPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    liveBlogTextBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
      marginHorizontal: spacing.xs,
      columnGap: spacing.xxxs
    },
    entryWithoutMedia: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.xs,
      columnGap: spacing.xxxs
    },
    liveBlogTagText: {
      letterSpacing: letterSpacing.sm,
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(0)
    },
    endOfCoverageText: {
      marginHorizontal: spacing.xs,
      marginTop: spacing.xxs,
      lineHeight: lineHeight.s
    },
    heading: {
      lineHeight: lineHeight['3xl'],
      letterSpacing: letterSpacing.s,
      marginTop: spacing.xxxs,
      paddingTop: spacing.xxxs,
      marginHorizontal: spacing.xs
    },
    subHeading: {
      marginTop: spacing.xxxs,
      letterSpacing: letterSpacing.sm,
      marginHorizontal: spacing.xs
    },
    timelineContainer: {
      marginHorizontal: spacing.xs,
      marginTop: spacing.xs
    },
    timelineItem: {
      flexDirection: 'row',
      columnGap: spacing.xxs
    },
    timelineLeftColumn: {
      marginTop: -3.5
    },
    timelineTime: {
      lineHeight: lineHeight.s,
      letterSpacing: letterSpacing.l
    },
    timelineDate: {
      lineHeight: lineHeight.m,
      letterSpacing: letterSpacing.xs
    },
    timelineMiddleColumn: {
      alignItems: 'center'
    },
    timelineLine: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      borderLeftWidth: borderWidth.s,
      borderLeftColor: theme.backgroundTabOutline
    },
    timelineDot: {
      width: 6,
      height: 6,
      borderRadius: radius.xxs,
      zIndex: 1,
      backgroundColor: theme.backgroundTabOutline
    },
    timelineRightColumn: {
      flex: 1
    },
    timelineContentItem: {
      paddingBottom: spacing.m
    },
    timelineContent: {
      lineHeight: lineHeight.m,
      letterSpacing: letterSpacing.sm,
      marginTop: -spacing.xxx
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      backgroundColor: theme.dividerPrimary
    },
    lexicalView: {
      marginTop: -spacing.xxs
    },
    liveBlogTextBlockOnTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.xs,
      columnGap: spacing.xxxs
    },
    liveDot: {
      height: 16,
      width: 16
    }
  });
