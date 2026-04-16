import React from 'react';
import { FlatList, View } from 'react-native';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { themeStyles } from '@src/views/pages/main/Videos/AuthorBio/styles';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const AuthorBioSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <>
      <View style={styles.headerSection}>
        <View style={styles.authorNameContainer}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(30)}
            width={actuatedNormalize(160)}
            style={styles.authorNameSkeleton}
          />

          <View style={styles.nameSpacing} />
          <SkeletonLoader
            height={actuatedNormalizeVertical(12)}
            width={actuatedNormalize(100)}
            style={styles.authorMeta}
          />
        </View>

        <SkeletonLoader
          height={actuatedNormalizeVertical(148)}
          width={actuatedNormalizeVertical(148)}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.bannerContainer}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(180)}
          width="100%"
          style={styles.banner}
        />
      </View>

      <View style={styles.iconRow}>
        <SkeletonLoader
          height={actuatedNormalizeVertical(24)}
          width={actuatedNormalize(24)}
          style={styles.icon}
        />
        <SkeletonLoader
          height={actuatedNormalizeVertical(24)}
          width={actuatedNormalize(24)}
          style={styles.icon}
        />
      </View>
      <SkeletonLoader height={actuatedNormalizeVertical(30)} width="60%" style={styles.divider} />
      <SkeletonLoader height={actuatedNormalizeVertical(5)} width="100%" />
      <FlatList
        data={[1, 2, 3]}
        renderItem={() => (
          <View style={styles.skeletonWrapper}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(222)}
              width="100%"
              style={styles.skeletonSpacing}
            />

            <SkeletonLoader
              height={actuatedNormalizeVertical(20)}
              width="70%"
              style={styles.skeletonSpacing}
            />

            <SkeletonLoader height={actuatedNormalizeVertical(10)} width="90%" />
          </View>
        )}
        numColumns={2}
      />
    </>
  );
};

export default AuthorBioSkeleton;
