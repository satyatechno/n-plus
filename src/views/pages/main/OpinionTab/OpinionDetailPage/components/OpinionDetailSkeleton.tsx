import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  SCREEN_WIDTH
} from '@src/utils/pixelScaling';
import { borderWidth, radius, spacing } from '@src/config/styleConsts';
import OpinionOtherSkeleton from '@src/views/pages/main/OpinionTab/OpinionLandingPage/components/OpinionOtherSkeleton';
import OpinionRecentSkeleton from '@src/views/pages/main/OpinionTab/OpinionLandingPage/components/OpinionRecentSkeleton';

const HERO_HEIGHT = (SCREEN_WIDTH * 9) / 16;

const OpinionDetailSkeleton: React.FC = () => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  return (
    <View>
      <View style={styles.headerRow}>
        <SkeletonLoader height={36} width={36} style={styles.avatar} />
        <View style={styles.headerTextBlock}>
          <SkeletonLoader height={10} width={80} style={styles.headerLine} />
          <SkeletonLoader height={12} width={160} style={styles.headerLine} />
        </View>
      </View>

      <View style={styles.titleBlock}>
        <SkeletonLoader
          height={26}
          width={SCREEN_WIDTH - actuatedNormalize(40)}
          style={styles.titleLine}
        />
        <SkeletonLoader
          height={26}
          width={SCREEN_WIDTH - actuatedNormalize(60)}
          style={styles.titleLine}
        />
        <SkeletonLoader
          height={26}
          width={SCREEN_WIDTH - actuatedNormalize(120)}
          style={styles.titleLine}
        />
      </View>

      <View style={styles.excerptBlock}>
        <SkeletonLoader
          height={14}
          width={SCREEN_WIDTH - actuatedNormalize(60)}
          style={styles.excerptLine}
        />
        <SkeletonLoader
          height={14}
          width={SCREEN_WIDTH - actuatedNormalize(100)}
          style={styles.excerptLine}
        />
      </View>

      <SkeletonLoader height={10} width={100} style={styles.date} />

      <SkeletonLoader height={HERO_HEIGHT} width={SCREEN_WIDTH} style={styles.hero} />

      <View style={styles.actionsRow}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonLoader key={`act-${i}`} height={18} width={18} style={styles.actionIcon} />
        ))}
      </View>

      <View style={styles.highlightCard}>
        <SkeletonLoader height={14} width={120} style={styles.highlightTitle} />
        <SkeletonLoader
          height={12}
          width={SCREEN_WIDTH - actuatedNormalize(48)}
          style={styles.highlightLine}
        />
        <SkeletonLoader
          height={12}
          width={SCREEN_WIDTH - actuatedNormalize(70)}
          style={styles.highlightLine}
        />
        <SkeletonLoader
          height={12}
          width={SCREEN_WIDTH - actuatedNormalize(90)}
          style={styles.highlightLine}
        />
      </View>

      <View style={styles.paragraph}>
        <SkeletonLoader
          height={12}
          width={SCREEN_WIDTH - actuatedNormalize(44)}
          style={styles.pLine}
        />
        <SkeletonLoader
          height={12}
          width={SCREEN_WIDTH - actuatedNormalize(60)}
          style={styles.pLine}
        />
        <SkeletonLoader
          height={12}
          width={SCREEN_WIDTH - actuatedNormalize(88)}
          style={styles.pLine}
        />
      </View>
      <View style={styles.paragraph}>
        <SkeletonLoader
          height={12}
          width={SCREEN_WIDTH - actuatedNormalize(50)}
          style={styles.pLine}
        />
        <SkeletonLoader
          height={12}
          width={SCREEN_WIDTH - actuatedNormalize(70)}
          style={styles.pLine}
        />
        <SkeletonLoader
          height={12}
          width={SCREEN_WIDTH - actuatedNormalize(100)}
          style={styles.pLine}
        />
      </View>

      <View style={styles.sectionTitle}>
        <SkeletonLoader height={18} width={180} />
      </View>

      {[0, 1].map((i) => (
        <View key={`rel-${i}`} style={styles.relatedItem}>
          <SkeletonLoader height={12} width={120} style={styles.relatedMeta} />
          <SkeletonLoader
            height={16}
            width={SCREEN_WIDTH - actuatedNormalize(80)}
            style={styles.relatedLine}
          />
          <SkeletonLoader
            height={16}
            width={SCREEN_WIDTH - actuatedNormalize(120)}
            style={styles.relatedLine}
          />
        </View>
      ))}

      <View style={styles.bottomSpace} />
      <OpinionOtherSkeleton count={2} />
      <OpinionRecentSkeleton
        itemWidth={actuatedNormalize(190)}
        imageSize={actuatedNormalize(80)}
        separatorWidth={actuatedNormalize(2)}
      />
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    avatar: {
      borderRadius: actuatedNormalize(26)
    },
    headerTextBlock: {
      marginLeft: actuatedNormalize(spacing.xs)
    },
    headerLine: {
      marginBottom: actuatedNormalizeVertical(4),
      borderRadius: radius.xxs
    },
    titleBlock: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    titleLine: {
      marginBottom: actuatedNormalizeVertical(6),
      borderRadius: radius.xxs
    },
    excerptBlock: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    excerptLine: {
      marginBottom: actuatedNormalizeVertical(4),
      borderRadius: radius.xxs
    },
    date: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    hero: {
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      columnGap: actuatedNormalize(spacing.xxs),
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    actionIcon: {
      borderRadius: radius.xxs
    },
    highlightCard: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.l),
      borderRadius: radius.xxs,
      borderWidth: borderWidth.s,
      borderColor: theme.dividerPrimary,
      padding: actuatedNormalize(spacing.xs)
    },
    highlightTitle: {
      marginBottom: actuatedNormalizeVertical(spacing.xs),
      borderRadius: radius.xxs
    },
    highlightLine: {
      marginBottom: actuatedNormalizeVertical(6),
      borderRadius: radius.xxs
    },
    paragraph: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    pLine: {
      marginBottom: actuatedNormalizeVertical(6),
      borderRadius: radius.xxs
    },
    sectionTitle: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.l)
    },
    relatedItem: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.s),
      paddingBottom: actuatedNormalizeVertical(spacing.s),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.dividerPrimary
    },
    relatedMeta: {
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    relatedLine: {
      marginBottom: actuatedNormalizeVertical(6),
      borderRadius: radius.xxs
    },
    bottomSpace: {
      height: actuatedNormalizeVertical(40)
    }
  });

export default OpinionDetailSkeleton;
