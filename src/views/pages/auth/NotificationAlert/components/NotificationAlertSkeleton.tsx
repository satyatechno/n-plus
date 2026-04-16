import React from 'react';
import { View, StyleSheet } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { borderWidth, spacing, radius } from '@src/config/styleConsts';

/**
 * Skeleton loader UI for the NotificationAlert screen while data is loading.
 * Mimics the layout of each notification item with text + toggle switch.
 */

const NotificationAlertSkeleton = () => {
  const [theme] = useTheme();
  const styles = themedStyles(theme);

  return (
    <View style={styles.container}>
      <View>
        {Array.from({ length: 6 }).map((_, index) => (
          <View style={styles.itemContainer} key={index}>
            <SkeletonLoader height={actuatedNormalizeVertical(16)} width="60%" />
            <SkeletonLoader
              height={actuatedNormalizeVertical(20)}
              width={actuatedNormalize(32)}
              style={styles.skeletonSwitch}
            />
          </View>
        ))}
      </View>

      <View style={styles.bottomRow}>
        {Array.from({ length: 2 }).map((_, index) => (
          <SkeletonLoader
            key={index}
            height={actuatedNormalizeVertical(52)}
            width="47%"
            style={styles.bottomSkeleton}
          />
        ))}
      </View>
    </View>
  );
};

export default NotificationAlertSkeleton;

const themedStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      flex: 1
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: actuatedNormalizeVertical(spacing.m),
      borderBottomWidth: borderWidth.s,
      borderBottomColor: theme.borderWidth
    },
    skeletonSwitch: {
      borderRadius: radius.m
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: actuatedNormalizeVertical(spacing['m'])
    },
    bottomSkeleton: {
      borderRadius: radius.m
    }
  });
