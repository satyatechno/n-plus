import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';

const WidgetSkeleton = () => {
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <SkeletonLoader height={18} width="85%" style={styles.line} />
        <SkeletonLoader height={14} width="70%" style={styles.line} />
        <SkeletonLoader height={14} width="60%" />
      </View>

      <View style={styles.divider} />

      <View style={styles.timer}>
        {['d', 'h', 'm', 's'].map((_, i) => (
          <View key={i} style={styles.unit}>
            <SkeletonLoader height={12} width={32} />
            <SkeletonLoader height={40} width={36} />
          </View>
        ))}
      </View>
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.widgetBackground,
      marginHorizontal: actuatedNormalize(spacing.xs),
      borderWidth: 1,
      borderColor: theme.neutralBackground,
      padding: actuatedNormalize(spacing.m),
      alignItems: 'center'
    },
    left: {
      flex: 1,
      gap: actuatedNormalizeVertical(6)
    },
    line: {
      borderRadius: 2
    },
    divider: {
      width: 1,
      height: actuatedNormalizeVertical(42),
      backgroundColor: theme.dividerGrey,
      marginHorizontal: actuatedNormalize(spacing.m)
    },
    timer: {
      flexDirection: 'row',
      gap: actuatedNormalize(spacing.xs)
    },
    unit: {
      alignItems: 'center',
      gap: 4
    }
  });

export default WidgetSkeleton;
