import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { OPINION_ITEM_HEIGHT, OPINION_ITEM_WIDTH } from '@src/config/opinionLayout';
import { borderWidth, radius, spacing } from '@src/config/styleConsts';

const IMAGE_SIZE = 80;

const OpinionSecondarySkeleton: React.FC = () => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  return (
    <View>
      <SkeletonLoader height={OPINION_ITEM_HEIGHT} width={OPINION_ITEM_WIDTH} />

      <View style={styles.textContainer}>
        <SkeletonLoader height={12} width={120} style={styles.author} />
        <SkeletonLoader
          height={22}
          width={OPINION_ITEM_WIDTH - actuatedNormalize(60)}
          style={styles.titleLine}
        />
        <SkeletonLoader
          height={22}
          width={OPINION_ITEM_WIDTH - actuatedNormalize(80)}
          style={styles.titleLine}
        />
        <SkeletonLoader
          height={22}
          width={OPINION_ITEM_WIDTH - actuatedNormalize(120)}
          style={styles.titleLine}
        />

        <View style={styles.headerContainer}>
          <SkeletonLoader height={10} width={80} />
          <View style={styles.headerActions}>
            <SkeletonLoader height={18} width={18} style={styles.icon} />
            <SkeletonLoader height={18} width={18} style={styles.icon} />
          </View>
        </View>
      </View>

      <View style={styles.pagination}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.dotWrap}>
            <SkeletonLoader height={8} width={8} style={styles.dot} />
          </View>
        ))}
      </View>

      <View style={styles.separator} />

      <View style={styles.container}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.cardBottomBorder}>
            <View style={styles.row}>
              <View style={styles.textBlock}>
                <SkeletonLoader height={14} width={140} style={styles.line} />
                <SkeletonLoader height={18} width={240} style={styles.line} />
                <SkeletonLoader height={18} width={260} style={styles.line} />
                <SkeletonLoader height={12} width={120} style={styles.meta} />
              </View>
              <SkeletonLoader
                height={actuatedNormalizeVertical(IMAGE_SIZE)}
                width={actuatedNormalize(IMAGE_SIZE)}
              />
            </View>
            {i < 2 ? <View style={styles.separator} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    textContainer: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      top: actuatedNormalizeVertical(spacing.s)
    },
    author: {
      marginBottom: actuatedNormalizeVertical(spacing.xxxs)
    },
    titleLine: {
      marginTop: actuatedNormalizeVertical(4),
      borderRadius: radius.xxs
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    icon: {
      borderRadius: radius.xxs,
      marginLeft: actuatedNormalize(spacing.xxxs)
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: actuatedNormalizeVertical(spacing.s)
    },
    dotWrap: {
      marginHorizontal: actuatedNormalize(3)
    },
    dot: {
      borderRadius: radius.xxs
    },
    separator: {
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginVertical: actuatedNormalizeVertical(spacing.s),
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.tagsTextAuthor
    },
    container: {
      paddingHorizontal: actuatedNormalize(spacing.s)
    },
    cardBottomBorder: {
      paddingVertical: actuatedNormalizeVertical(spacing.s)
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    textBlock: {
      flex: 1,
      marginRight: actuatedNormalize(spacing.s)
    },
    line: {
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(4)
    },
    meta: {
      borderRadius: radius.xxs,
      marginTop: actuatedNormalizeVertical(2)
    }
  });

export default OpinionSecondarySkeleton;
