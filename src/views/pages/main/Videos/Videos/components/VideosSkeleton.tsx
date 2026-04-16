import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { radius, spacing } from '@src/config/styleConsts';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import CustomDivider from '@src/views/atoms/CustomDivider';

export const VideosSkeleton: React.FC = () => {
  const renderHeroSkeleton = () => (
    <View style={styles.heroContainer}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(200)}
        width="100%"
        style={styles.heroImage}
      />
      <View style={styles.heroContent}>
        <SkeletonLoader height={actuatedNormalize(24)} width="40%" style={styles.category} />
        <SkeletonLoader height={actuatedNormalize(28)} width="90%" style={styles.title} />
        <SkeletonLoader height={actuatedNormalize(16)} width="30%" style={styles.duration} />
      </View>
    </View>
  );

  const renderVerticalItem = () => (
    <View style={styles.verticalItem}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(90)}
        width={actuatedNormalize(160)}
        style={styles.verticalImage}
      />
      <View style={styles.verticalContent}>
        <SkeletonLoader
          height={actuatedNormalize(16)}
          width="60%"
          style={styles.verticalCategory}
        />
        <SkeletonLoader height={actuatedNormalize(20)} width="90%" style={styles.verticalTitle} />
        <SkeletonLoader
          height={actuatedNormalize(14)}
          width="40%"
          style={styles.verticalDuration}
        />
      </View>
    </View>
  );

  const renderHorizontalItem = () => (
    <View style={styles.horizontalItem}>
      <SkeletonLoader
        height={actuatedNormalizeVertical(160)}
        width={actuatedNormalize(280)}
        style={styles.horizontalImage}
      />
      <SkeletonLoader
        height={actuatedNormalize(16)}
        width="60%"
        style={styles.horizontalCategory}
      />
      <SkeletonLoader height={actuatedNormalize(18)} width="90%" style={styles.horizontalTitle} />
      <SkeletonLoader
        height={actuatedNormalize(14)}
        width="40%"
        style={styles.horizontalDuration}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SkeletonLoader height={actuatedNormalize(36)} width="50%" style={styles.sectionTitle} />

      {renderHeroSkeleton()}

      <View style={styles.verticalList}>
        {[1, 2, 3].map((item) => (
          <View key={`vertical-${item}`}>
            {renderVerticalItem()}
            {item < 3 && <CustomDivider style={styles.divider} />}
          </View>
        ))}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3]}
        keyExtractor={(item) => `horizontal-${item}`}
        contentContainerStyle={styles.horizontalList}
        renderItem={renderHorizontalItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: actuatedNormalize(spacing.xs)
  },
  sectionTitle: {
    marginBottom: actuatedNormalize(spacing.xl),
    borderRadius: radius.xxs
  },
  heroContainer: {
    marginBottom: actuatedNormalize(spacing.xl)
  },
  heroImage: {
    width: '100%',
    borderRadius: radius.m,
    marginBottom: actuatedNormalize(spacing.xs)
  },
  heroContent: {
    paddingHorizontal: actuatedNormalize(spacing.xxs)
  },
  category: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalize(spacing.xs)
  },
  title: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalize(spacing.xs)
  },
  duration: {
    borderRadius: radius.xxs
  },
  verticalList: {
    marginBottom: actuatedNormalize(spacing.xl)
  },
  verticalItem: {
    flexDirection: 'row',
    marginVertical: actuatedNormalize(spacing.m)
  },
  verticalImage: {
    borderRadius: radius.m,
    marginRight: actuatedNormalize(spacing.m)
  },
  verticalContent: {
    flex: 1,
    justifyContent: 'center'
  },
  verticalCategory: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalize(spacing.xs)
  },
  verticalTitle: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalize(spacing.xs)
  },
  verticalDuration: {
    borderRadius: radius.xxs
  },
  divider: {
    marginVertical: actuatedNormalize(spacing.m)
  },
  horizontalList: {
    paddingRight: actuatedNormalize(spacing.m)
  },
  horizontalItem: {
    width: actuatedNormalize(280),
    marginRight: actuatedNormalize(spacing.m)
  },
  horizontalImage: {
    borderRadius: radius.m,
    marginBottom: actuatedNormalize(spacing.xs)
  },
  horizontalCategory: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalize(spacing.xs)
  },
  horizontalTitle: {
    borderRadius: radius.xxs,
    marginBottom: actuatedNormalize(spacing.xs)
  },
  horizontalDuration: {
    borderRadius: radius.xxs
  }
});

export default VideosSkeleton;
