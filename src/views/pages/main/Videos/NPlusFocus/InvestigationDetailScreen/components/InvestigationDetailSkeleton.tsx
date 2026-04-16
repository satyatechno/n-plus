import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { spacing, lineHeight, borderWidth, radius } from '@src/config/styleConsts';

const InvestigationDetailSkeleton = () => {
  const [theme] = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.mainBackgrunforproductionPage
    },
    videoPlayer: {
      width: '100%',
      height: actuatedNormalizeVertical(220),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    title: {
      width: '90%',
      height: actuatedNormalizeVertical(lineHeight['2xl']),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    date: {
      width: '40%',
      height: actuatedNormalizeVertical(lineHeight.m),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.m),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    description: {
      width: '94%',
      height: actuatedNormalizeVertical(100),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.m),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    sectionTitle: {
      width: '60%',
      height: actuatedNormalizeVertical(lineHeight['3xl']),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.xxs,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    relatedItem: {
      width: actuatedNormalize(160),
      height: actuatedNormalizeVertical(120),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.m,
      marginRight: actuatedNormalize(spacing.s),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    divider: {
      height: borderWidth.s,
      backgroundColor: theme.dividerPrimary,
      marginVertical: actuatedNormalizeVertical(spacing.m)
    },
    bookmarkCard: {
      width: '94%',
      height: actuatedNormalizeVertical(100),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.m,
      marginBottom: actuatedNormalizeVertical(spacing.s),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    awardsItem: {
      width: actuatedNormalize(100),
      height: actuatedNormalizeVertical(30),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: radius.xxs,
      marginRight: actuatedNormalize(spacing.s),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    crewItem: {
      width: actuatedNormalize(50),
      height: actuatedNormalizeVertical(50),
      backgroundColor: theme.skeletonLoaderBackground,
      borderRadius: actuatedNormalize(30),
      marginRight: actuatedNormalize(spacing.s),
      marginHorizontal: actuatedNormalize(spacing.xs)
    },
    relatedRow: {
      flexDirection: 'row',
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    bookmarkColumn: {
      marginBottom: actuatedNormalizeVertical(spacing.l)
    },
    awardsRow: {
      flexDirection: 'row',
      marginBottom: actuatedNormalizeVertical(spacing.m)
    },
    crewRow: {
      flexDirection: 'row',
      marginBottom: actuatedNormalizeVertical(spacing.m)
    }
  });

  const renderItems = (count: number, style: ViewStyle) =>
    Array(count)
      .fill(0)
      .map((_, index) => <View key={index} style={style} />);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.videoPlayer} />

      <View style={styles.title} />
      <View style={styles.date} />

      <View style={styles.description} />

      <View style={styles.sectionTitle} />
      <View style={styles.relatedRow}>{renderItems(3, styles.relatedItem)}</View>

      <View style={styles.divider} />

      <View style={styles.sectionTitle} />
      <View style={styles.bookmarkColumn}>{renderItems(2, styles.bookmarkCard)}</View>

      <View style={styles.awardsRow}>{renderItems(3, styles.awardsItem)}</View>

      <View style={styles.crewRow}>{renderItems(4, styles.crewItem)}</View>
    </ScrollView>
  );
};

export default InvestigationDetailSkeleton;
