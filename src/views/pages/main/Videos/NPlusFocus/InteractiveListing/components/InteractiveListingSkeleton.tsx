import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing, radius } from '@src/config/styleConsts';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';

interface InteractiveListingSkeletonProps {
  backgroundColor?: string;
}

const InteractiveListingSkeleton: React.FC<InteractiveListingSkeletonProps> = ({
  backgroundColor
}) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, backgroundColor ? { backgroundColor } : null]}
      showsVerticalScrollIndicator={false}
    >
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.cardContainer}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(200)}
            width="100%"
            style={styles.cardImage}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(40)}
            width="100%"
            style={styles.cardTitle}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default InteractiveListingSkeleton;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.mainBackgroundDefault,
      paddingTop: actuatedNormalizeVertical(spacing.xl)
    },
    headerTitle: {
      marginBottom: actuatedNormalizeVertical(spacing.xl),
      borderRadius: radius.xxs
    },
    cardContainer: {
      marginBottom: actuatedNormalizeVertical(spacing.xl)
    },
    cardImage: {
      marginBottom: actuatedNormalizeVertical(spacing.s),
      borderRadius: radius.m
    },
    cardTitle: {
      borderRadius: radius.xxs
    }
  });
