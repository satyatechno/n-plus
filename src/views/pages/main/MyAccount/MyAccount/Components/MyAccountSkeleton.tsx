import React from 'react';
import { ScrollView, View, SafeAreaView } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { useTheme } from '@src/hooks/useTheme';
import { themeStyles } from '../styles';
import { primaryOptions, secondaryOptions } from '../config/options';
import CustomDivider from '@src/views/atoms/CustomDivider';
import { skeletonStyles } from './myAccountSkeletonStyles';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing } from '@src/config/styleConsts';

const MyAccountSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={skeletonStyles.header}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(spacing.s)}
          width="20%"
          style={skeletonStyles.headerTitle}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(spacing.l)}
          width={actuatedNormalize(spacing.l)}
          style={skeletonStyles.headerIcon}
        />
      </View>

      <CustomDivider style={skeletonStyles.dividerBottom} />

      <View style={skeletonStyles.headingSection}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(spacing.m)}
          width="50%"
          style={skeletonStyles.headingText}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(spacing.xs)}
          width="50%"
          style={skeletonStyles.subHeadingText}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={skeletonStyles.optionContainer}>
          {primaryOptions.map((_, index) => (
            <View key={`primary-${index}`} style={skeletonStyles.optionItem}>
              <View style={skeletonStyles.optionRow}>
                <SkeletonLoader
                  height={actuatedNormalizeVertical(spacing.l)}
                  width={actuatedNormalize(spacing.l)}
                  style={skeletonStyles.optionIcon}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(spacing.xs)}
                  width="30%"
                  style={skeletonStyles.optionLabel}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(spacing.xs)}
                  width={actuatedNormalize(spacing.xs)}
                  style={skeletonStyles.optionArrow}
                />
              </View>
              {index === 1 && <CustomDivider style={skeletonStyles.optionDivider} />}
            </View>
          ))}
        </View>

        <View style={styles.secondaryContainer}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(spacing.l)}
            width="75%"
            style={skeletonStyles.followUsTitle}
          />

          <View style={skeletonStyles.socialIconRow}>
            {[...Array(6)].map((_, i) => (
              <SkeletonLoader
                key={i}
                height={actuatedNormalizeVertical(spacing.l)}
                width={actuatedNormalize(spacing.l)}
                style={skeletonStyles.socialIcon}
              />
            ))}
          </View>

          <CustomDivider style={skeletonStyles.dividerBottomLarge} />

          {secondaryOptions.map((_, index) => (
            <View key={`secondary-${index}`} style={skeletonStyles.optionItem}>
              <View style={skeletonStyles.optionRow}>
                <SkeletonLoader
                  height={actuatedNormalizeVertical(spacing.l)}
                  width={actuatedNormalize(spacing.l)}
                  style={skeletonStyles.optionIcon}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(spacing.xs)}
                  width="40%"
                  style={skeletonStyles.secondaryOptionLabel}
                />
              </View>
            </View>
          ))}

          <SkeletonLoader
            height={actuatedNormalizeVertical(spacing['6xl'])}
            width="100%"
            style={skeletonStyles.logoutButton}
          />

          <View style={skeletonStyles.versionTextWrapper}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(spacing.xxs)}
              width={actuatedNormalize(spacing.xl)}
              style={skeletonStyles.versionText}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAccountSkeleton;
