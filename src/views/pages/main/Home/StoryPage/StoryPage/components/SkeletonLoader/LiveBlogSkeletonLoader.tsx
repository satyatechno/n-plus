import React from 'react';
import { View, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@src/hooks/useTheme';
import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import RecommendedSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/RecommendationSkeletonLoader';
import CategoryHeaderSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/CategoryHeaderSkeleton';
import CustomDivider from '@src/views/atoms/CustomDivider';
import { spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { themeStyles } from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/styles';

//Using this array to render the timeline skeleton UI
const timeLine = [
  { timeStamp: true, isHideShare: false },
  { video: true },
  { onlyText: true, isHideShare: true },
  { timeStamp: true, isHideShare: true },
  { timeStamp: true, isHideShare: true },
  { timeStamp: true, isHideShare: false },
  { embedded: true },
  { onlyText: true, isHideShare: true },
  { embedded: true },
  { onlyText: true, isHideShare: true },
  { video: true }
];

const LiveBlogSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <CategoryHeaderSkeleton />
        <View style={styles.topRowContainer}>
          <View style={styles.flexContainer}>
            <View style={styles.rowAlignCenter}>
              <SkeletonLoader
                height={actuatedNormalize(spacing['xxs'])}
                width={actuatedNormalize(spacing['xxs'])}
                style={styles.dotCircle}
              />
              <SkeletonLoader
                height={actuatedNormalizeVertical(spacing['s'])}
                width={actuatedNormalize(82)}
                style={styles.barMarginRightSmall}
              />
            </View>
            <SkeletonLoader
              height={actuatedNormalizeVertical(spacing['s'])}
              width={'75%'}
              style={styles.barMarginTopSmall}
            />
          </View>
          <View style={styles.rowEnd}>
            <SkeletonLoader
              height={actuatedNormalizeVertical(42)}
              width={actuatedNormalize(42)}
              style={styles.bellButton}
            />
          </View>
        </View>

        <View style={styles.sectionSpacing}>
          {[1, 2].map((_, idx) => (
            <SkeletonLoader
              key={`large-block-${idx}`}
              height={actuatedNormalizeVertical(spacing['3xl'])}
              width={'96%'}
              style={styles.largeBlockContainer}
            />
          ))}
        </View>

        {[1, 2, 3, 4, 5].map((_, idx) => (
          <SkeletonLoader
            key={`line-${idx}`}
            height={actuatedNormalizeVertical(spacing['s'])}
            width={'96%'}
            style={styles.largeBlockContainerTight}
          />
        ))}

        <SkeletonLoader
          height={actuatedNormalizeVertical(spacing['xs'])}
          width={'96%'}
          style={styles.mediumBlockContainer}
        />

        <SkeletonLoader
          height={actuatedNormalizeVertical(492)}
          width={'100%'}
          style={styles.videoBlock}
        />

        <SkeletonLoader
          height={actuatedNormalizeVertical(spacing['xs'])}
          width={'96%'}
          style={styles.midBlockContainer}
        />

        <SkeletonLoader
          height={actuatedNormalizeVertical(spacing['3xl'])}
          width={'96%'}
          style={styles.midBlockContainerSpaced}
        />

        <CustomDivider style={styles.horizontalDivider} />

        {[4, 2, 2].map((line, sectionIdx) => (
          <View key={`section-${sectionIdx}`} style={styles.pointBlockContainer}>
            <View style={styles.singlePointBlockContainer}>
              <SkeletonLoader
                height={actuatedNormalizeVertical(6)}
                width={actuatedNormalize(6)}
                style={styles.roundedMedium}
              />
            </View>
            <View style={styles.flexContainer}>
              {Array.from({ length: line }).map((_, lineIdx) => (
                <SkeletonLoader
                  key={`section-${sectionIdx}-line-${lineIdx}`}
                  height={actuatedNormalizeVertical(spacing['xs'])}
                  width={'98%'}
                  style={{
                    ...styles.radiusBar,
                    marginBottom: lineIdx !== 3 ? actuatedNormalizeVertical(spacing['s']) : 0
                  }}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.timeLineContainer}>
          {timeLine.map((item, idx) => (
            <View key={`timeline-item-${idx}`} style={styles.timelineElement}>
              {item?.video && (
                <View style={styles.flexContainer}>
                  <SkeletonLoader
                    height={actuatedNormalizeVertical(190)}
                    width={'100%'}
                    style={styles.videoBlockContainer}
                  />
                  <SkeletonLoader
                    height={actuatedNormalizeVertical(spacing['s'])}
                    width={'90%'}
                    style={styles.timeBar}
                  />
                </View>
              )}

              {item?.embedded && (
                <View style={styles.embedBlockContainer}>
                  <View style={styles.embedTopBlockContainer}>
                    <SkeletonLoader
                      height={actuatedNormalizeVertical(spacing['4xl'])}
                      width={actuatedNormalize(spacing['4xl'])}
                      style={styles.roundedSmall}
                    />
                    <View style={styles.embedTextBlockContainer}>
                      <View style={styles.embedTitleContainer}>
                        <SkeletonLoader
                          height={actuatedNormalizeVertical(spacing['xs'])}
                          width={actuatedNormalize(spacing['3xl'])}
                          style={styles.roundedSmall}
                        />
                        <SkeletonLoader
                          height={actuatedNormalizeVertical(spacing['s'])}
                          width={actuatedNormalize(spacing['s'])}
                          style={styles.marginLeftSmall}
                        />
                      </View>
                      <SkeletonLoader
                        height={actuatedNormalizeVertical(spacing['xs'])}
                        width={actuatedNormalize(89)}
                        style={styles.roundedSmall}
                      />
                    </View>
                  </View>

                  {[1, 2, 3, 4, 5].map((_, idx) => (
                    <SkeletonLoader
                      key={`Timeline-${idx}`}
                      height={actuatedNormalizeVertical(spacing['xs'])}
                      width={'96%'}
                      style={styles.timelineBlock}
                    />
                  ))}

                  <SkeletonLoader
                    key={`Timeline-${idx}`}
                    height={actuatedNormalizeVertical(spacing['xs'])}
                    width={'96%'}
                    style={styles.timelineBlockSpaced}
                  />

                  <SkeletonLoader
                    height={actuatedNormalizeVertical(100)}
                    width={'50%'}
                    style={styles.halfBlock}
                  />

                  <SkeletonLoader
                    height={actuatedNormalizeVertical(190)}
                    width={'100%'}
                    style={styles.videoBlockContainer}
                  />
                </View>
              )}

              {(item?.timeStamp || item?.onlyText) && (
                <>
                  <View style={styles.timelineTimestamp}>
                    <SkeletonLoader
                      height={actuatedNormalizeVertical(spacing['xs'])}
                      width={actuatedNormalize(40)}
                      backgroundColor={
                        item?.onlyText
                          ? theme.mainBackgroundDefault
                          : theme.skeletonLoaderBackground
                      }
                      style={styles.timelineItem}
                    />
                    <SkeletonLoader
                      height={actuatedNormalizeVertical(spacing['xs'])}
                      width={actuatedNormalize(60)}
                      backgroundColor={
                        item?.onlyText
                          ? theme.mainBackgroundDefault
                          : theme.skeletonLoaderBackground
                      }
                      style={styles.roundedSmall}
                    />
                  </View>
                  <View style={styles.timeLogContainer}>
                    <View style={styles.timelineBlockSmall}>
                      {item?.timeStamp && (
                        <SkeletonLoader
                          height={actuatedNormalizeVertical(spacing['xxs'])}
                          width={actuatedNormalize(spacing['xxs'])}
                          style={styles.roundedSmall}
                        />
                      )}
                      <CustomDivider style={styles.timelineDivider} />
                    </View>
                    <View style={styles.flexContainer}>
                      {[1, 2, 3, 4, 5].map((__, lineIdx) => (
                        <SkeletonLoader
                          key={`timeline-item-${idx}-line-${lineIdx}`}
                          height={actuatedNormalizeVertical(spacing['xs'])}
                          width={lineIdx === 4 ? '40%' : '100%'}
                          style={styles.timelineItem}
                        />
                      ))}
                      {item?.isHideShare && (
                        <View style={styles.alignItemsEndContainer}>
                          <SkeletonLoader
                            height={actuatedNormalizeVertical(spacing['m'])}
                            width={actuatedNormalize(spacing['m'])}
                            style={styles.shareIconContainer}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </>
              )}
            </View>
          ))}
        </View>

        <View style={styles.recommendedWrapper}>
          <RecommendedSkeleton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LiveBlogSkeleton;
