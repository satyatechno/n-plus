import { StyleSheet } from 'react-native';

import { AppTheme } from '@src/themes/theme';
import { borderWidth, radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.mainBackgroundDefault,
      paddingVertical: actuatedNormalizeVertical(spacing.s)
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: actuatedNormalize(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing['5xl'])
    },
    avatar: {
      borderRadius: radius.m,
      marginRight: actuatedNormalize(spacing.xs)
    },
    mediaBlock: {
      alignSelf: 'center',
      borderRadius: radius.m,
      marginBottom: actuatedNormalize(spacing.s)
    },
    audioRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: actuatedNormalize(spacing.xl),
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    audioLine: {
      borderRadius: radius.m,
      marginLeft: actuatedNormalize(spacing.xs)
    },
    largeMediaBlock: {
      alignSelf: 'center',
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    bottomLine: {
      alignSelf: 'center',
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    topBarStartAligned: {
      borderRadius: radius.m,
      alignSelf: 'flex-start',
      marginLeft: actuatedNormalize(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing['2xl'])
    },
    profileRow: {
      gap: actuatedNormalize(spacing.xxs),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: actuatedNormalize(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    profileLine: {
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: actuatedNormalize(spacing.xxs),
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    bulletDot: {
      borderRadius: radius.m
    },
    bulletLine: {
      borderRadius: radius.xxs
    },
    circle: {
      borderRadius: 50,
      marginRight: actuatedNormalize(spacing.xs)
    },
    largeCircle: {
      borderRadius: radius.l,
      marginRight: actuatedNormalize(spacing.xs)
    },
    profileColumn: {
      flex: 1,
      justifyContent: 'space-between'
    },
    profileLineGroup: {
      flex: 1,
      alignSelf: 'flex-start'
    },
    midContent: {
      alignSelf: 'center',
      borderRadius: radius.m,
      marginBottom: actuatedNormalize(spacing.s)
    },
    footerBar: {
      alignSelf: 'center',
      borderRadius: radius.m,
      marginTop: actuatedNormalizeVertical(spacing.l),
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    bottomSmall: {
      alignSelf: 'center',
      borderRadius: radius.m,
      marginBottom: actuatedNormalize(spacing.s)
    },
    pillButton: {
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginLeft: actuatedNormalize(spacing.s),
      marginTop: actuatedNormalizeVertical(spacing['4xl']),
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    bottomTabs: {
      flexDirection: 'row',
      gap: actuatedNormalizeVertical(spacing['5xl']),
      paddingHorizontal: actuatedNormalize(spacing.s),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    tabBarItem: {
      borderRadius: radius.m
    },
    recommendedWrapper: {
      paddingHorizontal: actuatedNormalize(spacing.s)
    },
    finalWrapper: {
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    finalTopBar: {
      alignSelf: 'center',
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    finalCard: {
      alignSelf: 'center',
      borderRadius: radius.l,
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    finalTitle: {
      alignSelf: 'center',
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing['2xl']),
      marginTop: actuatedNormalizeVertical(spacing['2xl'])
    },
    sideBySide: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: actuatedNormalize(spacing.s),
      paddingHorizontal: actuatedNormalize(spacing.s)
    },
    finalCardItem: {
      borderRadius: radius.m
    },
    cardImage: {
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    cardLineShort: {
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    cardLineFull: {
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: actuatedNormalizeVertical(spacing.xxs),
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    cardBottomRow: {
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    dot: {
      borderRadius: 50
    },
    smallLine: {
      borderRadius: radius['xxs']
    },
    recommendedContainer: {
      marginVertical: actuatedNormalizeVertical(spacing['4xl'])
    },
    recommended: {
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    recommendedLine: {
      borderRadius: radius.m,
      alignSelf: 'flex-start',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    recommendedBlock: {
      borderRadius: radius.m,
      alignSelf: 'flex-start',
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    recommendedRow: {
      width: '98%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    recommendedAudioLine: {
      borderRadius: radius.m
    },
    recommendedBulletDot: {
      borderRadius: radius['xxs']
    },
    topRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.xl),
      paddingHorizontal: actuatedNormalize(spacing.xs)
    },
    flexContainer: { flex: 1 },
    rowAlignCenter: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    dotCircle: {
      borderRadius: radius.xxs,
      marginRight: actuatedNormalize(spacing.xs)
    },
    barMarginRightSmall: {
      borderRadius: radius.xxs,
      marginRight: actuatedNormalize(spacing.xs)
    },
    barMarginTopSmall: {
      borderRadius: radius.xxs,
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    rowEnd: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    buttonLarge: {
      height: actuatedNormalizeVertical(42),
      width: actuatedNormalize(91),
      borderRadius: 24,
      marginRight: actuatedNormalize(spacing.xs),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.bodyTextDarkTheme,
      borderWidth: borderWidth.m,
      borderColor: theme.trackDisabled
    },
    buttonSquare: {
      height: actuatedNormalizeVertical(42),
      width: actuatedNormalize(42),
      borderRadius: 24,
      marginRight: actuatedNormalize(spacing.xxs),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.bodyTextDarkTheme,
      borderWidth: borderWidth.m,
      borderColor: theme.trackDisabled
    },
    bellButton: {
      borderRadius: 24,
      marginRight: actuatedNormalize(spacing.xxs)
    },
    largeBlockContainer: {
      borderRadius: radius.xxs,
      alignSelf: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    largeBlockContainerTight: {
      borderRadius: radius.xxs,
      alignSelf: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    mediumBlockContainer: {
      borderRadius: radius.xxs,
      alignSelf: 'center',
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    midBlockContainer: {
      borderRadius: radius.xxs,
      alignSelf: 'center',
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    midBlockContainerSpaced: {
      borderRadius: radius.xxs,
      alignSelf: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.s),
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    horizontalDivider: {
      height: actuatedNormalizeVertical(1),
      width: '96%',
      marginBottom: actuatedNormalizeVertical(spacing['2xl']),
      alignSelf: 'center'
    },
    pointBlockContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: actuatedNormalizeVertical(spacing['2xl']),
      paddingHorizontal: actuatedNormalize(spacing.xl)
    },
    singlePointBlockContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xxs),
      marginLeft: actuatedNormalize(spacing.xxs),
      marginRight: actuatedNormalize(spacing.l)
    },
    embedBlockContainer: {
      flex: 1,
      marginRight: actuatedNormalize(spacing.xxs),
      margin: actuatedNormalize(spacing.xs),
      backgroundColor: theme.bodyTextDarkTheme,
      borderWidth: borderWidth.s,
      borderColor: theme.trackDisabled,
      borderRadius: radius.xxs,
      padding: actuatedNormalize(spacing.xs)
    },
    embedTopBlockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    embedTextBlockContainer: {
      flex: 1,
      height: actuatedNormalizeVertical(spacing['5xl']),
      paddingLeft: actuatedNormalize(spacing.xs),
      justifyContent: 'space-evenly'
    },
    embedTitleContainer: { flexDirection: 'row', alignItems: 'center', rowGap: 5 },
    timelineBlock: {
      borderRadius: radius.xxs,
      alignSelf: 'center',
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    timelineBlockSpaced: {
      borderRadius: radius.xxs,
      alignSelf: 'center',
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    timeBar: {
      borderRadius: 5,
      marginBottom: actuatedNormalizeVertical(spacing.xxs),
      alignSelf: 'center'
    },
    timeLogContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingRight: actuatedNormalize(spacing.xs)
    },
    roundedLarge: {
      borderRadius: 24
    },
    sectionSpacing: {
      marginBottom: actuatedNormalizeVertical(spacing.xl)
    },
    roundedMedium: {
      borderRadius: 6
    },
    videoBlockContainer: {
      borderRadius: radius.xxs,
      marginVertical: actuatedNormalizeVertical(spacing.s)
    },
    roundedSmall: {
      borderRadius: radius.xxs
    },
    marginLeftSmall: {
      marginLeft: actuatedNormalize(spacing.xxxs)
    },
    alignItemsEndContainer: {
      alignItems: 'flex-end',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    shareIconContainer: {
      borderRadius: 10,
      marginLeft: actuatedNormalize(spacing.xxs)
    },
    timeLineContainer: {
      flex: 1,
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    timelineElement: {
      flex: 1,
      flexDirection: 'row'
    },
    timelineItem: {
      borderRadius: 5,
      marginBottom: actuatedNormalizeVertical(spacing.xxs)
    },
    timelineDivider: {
      flexGrow: 1,
      width: actuatedNormalize(1)
    },
    timelineBlockSmall: {
      alignItems: 'center',
      marginRight: actuatedNormalize(spacing.xs),
      width: actuatedNormalize(spacing.xxs)
    },
    timelineTimestamp: {
      marginRight: actuatedNormalize(spacing.xxs),
      paddingLeft: actuatedNormalize(spacing.xs)
    },
    halfBlock: {
      borderRadius: radius.xxs,
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    videoBlock: {
      borderRadius: radius.xxs,
      alignSelf: 'center'
    },
    radiusBar: { borderRadius: radius.l },
    simpleCardContainer: {
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    imagePlaceholder: {
      borderRadius: radius.m
    },
    title: {
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      borderRadius: radius.xxs
    },
    subtitle: {
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      borderRadius: radius.xxs
    },
    inactiveDot: {
      borderRadius: radius.xxs,
      marginTop: actuatedNormalizeVertical(6)
    },
    inactiveTimelineItem: {
      flexDirection: 'row',
      marginBottom: actuatedNormalizeVertical(spacing.s)
    },
    cardContainer: {
      marginBottom: actuatedNormalizeVertical(spacing.xl)
    },
    liveIndicatorContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginLeft: actuatedNormalize(spacing.xs)
    },
    liveIndicator: {
      borderRadius: radius.xxs
    },
    timelineContainer: {
      marginTop: actuatedNormalizeVertical(spacing.m),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    timeColumn: {
      width: actuatedNormalize(80),
      alignItems: 'flex-end',
      paddingRight: actuatedNormalize(spacing.xs)
    },
    timeText: {
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    dateText: {
      borderRadius: radius.xxs
    },
    dotColumn: {
      width: actuatedNormalize(spacing.m),
      alignItems: 'center',
      position: 'relative'
    },
    contentColumn: {
      flex: 1,
      paddingLeft: actuatedNormalize(spacing.xs)
    },
    contentLineOne: {
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    contentLineTwo: {
      borderRadius: radius.xxs
    },
    enteryContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xl),
      marginHorizontal: actuatedNormalize(spacing.xs),
      rowGap: actuatedNormalizeVertical(spacing.s)
    },
    enteryBlock: {
      flexDirection: 'row'
    },
    entryTimeColumn: {
      paddingRight: actuatedNormalize(spacing.xs)
    }
  });
