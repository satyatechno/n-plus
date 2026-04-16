import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { COLLECTION_TYPE } from '@src/config/enum';
import { RenderCollectionStyles } from '@src/models/main/MyAccount/Bookmarks';
import { spacing } from '@src/config/styleConsts';

type Props = {
  styles: RenderCollectionStyles;
  collection: COLLECTION_TYPE;
};

const PLACEHOLDER_COUNT = 8;

const RenderCollectionSkeleton = ({ styles, collection }: Props) => {
  const data = useMemo(() => Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => i), []);

  if (collection === COLLECTION_TYPE.VIDEOS) {
    return (
      <FlatList
        key="skeleton-videos-list"
        data={data}
        keyExtractor={(i) => `${i}`}
        scrollEnabled={false}
        contentContainerStyle={styles.carouselContainerVideo}
        renderItem={() => (
          <View style={styles.verticalVideoContainer}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(130)}
              width={actuatedNormalize(130)}
              style={styles.verticalImageStyle}
            />
            <View style={styles.videosTextColumn}>
              <SkeletonLoader height={actuatedNormalizeVertical(18)} width={'80%'} />
              <SkeletonLoader height={actuatedNormalizeVertical(14)} width={'60%'} />
              <SkeletonLoader height={actuatedNormalizeVertical(12)} width={'40%'} />
              <View style={styles.videosBottomRow}>
                <SkeletonLoader height={actuatedNormalizeVertical(12)} width={'20%'} />
                <SkeletonLoader height={actuatedNormalizeVertical(15)} width={'6%'} />
              </View>
            </View>
          </View>
        )}
      />
    );
  }

  if (collection === COLLECTION_TYPE.POSTS || collection === COLLECTION_TYPE.PRESS_ROOM) {
    return (
      <View style={styles.postsContainer}>
        {data.map((i) => (
          <View key={i} style={styles.postsItem}>
            <SkeletonLoader height={actuatedNormalizeVertical(18)} width={'90%'} />
            <View style={styles.postsSubtitleRow}>
              <SkeletonLoader height={actuatedNormalizeVertical(14)} width={'40%'} />
              <SkeletonLoader height={actuatedNormalizeVertical(15)} width={'5%'} />
            </View>
            <View style={styles.postsDivider} />
          </View>
        ))}
      </View>
    );
  }

  if (collection === COLLECTION_TYPE.LIVE_BLOGS) {
    return (
      <FlatList
        key="skeleton-liveblogs-list"
        data={data}
        keyExtractor={(i) => `lb-${i}`}
        scrollEnabled={false}
        renderItem={() => (
          <View style={styles.liveBlogItemContainer}>
            <SkeletonLoader height={actuatedNormalizeVertical(190)} width={'100%'} />
            <View style={styles.liveBlogTextContainer}>
              <SkeletonLoader height={actuatedNormalizeVertical(18)} width={'80%'} />
              <View style={styles.liveBlogSubtitleSpacer} />
              <SkeletonLoader height={actuatedNormalizeVertical(14)} width={'50%'} />
            </View>
            <View style={styles.liveBlogDivider} />
          </View>
        )}
      />
    );
  }

  if (
    (collection === COLLECTION_TYPE.PROGRAMS || collection === COLLECTION_TYPE.INTERACTIVOS) &&
    data
  ) {
    return (
      <FlatList
        key="skeleton-grid-2"
        data={data}
        keyExtractor={(i) => `s-${i}`}
        numColumns={2}
        scrollEnabled={false}
        style={styles.skeletonflatList}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={() => (
          <View style={styles.programsItem}>
            <SkeletonLoader
              height={
                collection === COLLECTION_TYPE.INTERACTIVOS
                  ? actuatedNormalizeVertical(100)
                  : actuatedNormalizeVertical(222)
              }
              width={actuatedNormalize(160)}
            />
            <SkeletonLoader height={actuatedNormalizeVertical(16)} width={actuatedNormalize(140)} />
            <SkeletonLoader height={actuatedNormalizeVertical(14)} width={actuatedNormalize(120)} />
          </View>
        )}
      />
    );
  }

  if (collection === COLLECTION_TYPE.AUTHORS) {
    return (
      <FlatList
        key="skeleton-authors-list"
        data={data}
        keyExtractor={(i) => `a-${i}`}
        contentContainerStyle={styles.talentsContainer}
        scrollEnabled={false}
        renderItem={() => (
          <View style={[styles.talentsRow, { marginTop: spacing.s }]}>
            <SkeletonLoader
              height={actuatedNormalize(52)}
              width={actuatedNormalize(52)}
              style={styles.talentsAvatar}
            />
            <View style={styles.talentsTextCol}>
              <SkeletonLoader height={actuatedNormalizeVertical(16)} width={'70%'} />
              <SkeletonLoader height={actuatedNormalizeVertical(14)} width={'40%'} />
            </View>
            <SkeletonLoader height={actuatedNormalizeVertical(18)} width={'5%'} />
          </View>
        )}
      />
    );
  }

  return (
    <View style={styles.defaultContainer}>
      {data.slice(0, 4).map((i) => (
        <View key={`d-${i}`} style={styles.defaultItem}>
          <SkeletonLoader height={actuatedNormalizeVertical(18)} width={'85%'} />
          <View style={styles.defaultSpacer} />
          <SkeletonLoader height={actuatedNormalizeVertical(14)} width={'55%'} />
        </View>
      ))}
    </View>
  );
};

export default RenderCollectionSkeleton;
