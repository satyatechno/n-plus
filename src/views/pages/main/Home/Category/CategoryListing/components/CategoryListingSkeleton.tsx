import React from 'react';
import { StyleSheet, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, radius, spacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';

const CategoryListingSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      {[...Array(15)].map((_, index) => (
        <View key={`skeleton-${index}`}>
          <View style={styles.skeletonRow}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(16)}
              width="40%"
              style={styles.textSkeleton}
            />
            <SkeletonLoader
              height={actuatedNormalizeVertical(16)}
              width={actuatedNormalize(20)}
              style={styles.arrowSkeleton}
            />
          </View>
          <View style={styles.divider} />
        </View>
      ))}
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingTop: actuatedNormalizeVertical(spacing.l),
      paddingHorizontal: actuatedNormalize(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing['10xl'])
    },
    skeletonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    textSkeleton: {
      borderRadius: radius.m
    },
    arrowSkeleton: {
      borderRadius: radius.m,
      marginRight: actuatedNormalize(spacing.xs)
    },
    divider: {
      borderBottomWidth: borderWidth.s,
      borderColor: theme.dividerPrimary,
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginBottom: actuatedNormalizeVertical(spacing.l)
    }
  });

export default CategoryListingSkeleton;
