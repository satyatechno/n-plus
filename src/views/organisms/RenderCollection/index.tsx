import React from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { COLLECTION_TYPE } from '@src/config/enum';
import InfoCard from '@src/views/molecules/InfoCard';
import CustomText from '@src/views/atoms/CustomText';
import CustomDivider from '@src/views/atoms/CustomDivider';
import LiveBlogCard from '@src/views/organisms/LiveBlogCard';
import CarouselCard from '@src/views/molecules/CarouselCard';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import { BookmarkIcon, SearchOffIcon } from '@src/assets/icons';
import BookmarkCard from '@src/views/molecules/CustomBookmarkCard';
import { routeNames, screenNames } from '@src/navigation/screenNames';
import { Props, SearchContentItem } from '@src/models/main/MyAccount/Bookmarks';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import RenderCollectionSkeleton from '@src/views/organisms/RenderCollectionSkeleton';

const RenderCollection = ({
  data,
  styles,
  collection,
  onToggleBookmark,
  theme,
  onPress,
  hasNext = false,
  loadingMore = false,
  onLoadMore,
  emptyIcon,
  emptyTitle,
  emptySubtitle
}: Props) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        {emptyIcon ?? (
          <SearchOffIcon width={actuatedNormalize(48)} height={actuatedNormalizeVertical(44)} />
        )}
        <CustomText
          size={fontSize.l}
          weight="Med"
          fontFamily={fonts.franklinGothicURW}
          textStyles={styles.emptyStateTitle}
        >
          {emptyTitle ?? t('screens.search.text.noResultsTitle')}
        </CustomText>
        <CustomText
          size={fontSize.s}
          weight="Boo"
          fontFamily={fonts.franklinGothicURW}
          textStyles={styles.emptyStateSubtitle}
        >
          {emptySubtitle ?? t('screens.search.text.noResultsSubtitle')}
        </CustomText>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {collection === COLLECTION_TYPE.VIDEOS && (data?.length ?? 0) > 0 && (
        <FlatList<SearchContentItem>
          showsHorizontalScrollIndicator={false}
          data={data ?? []}
          keyExtractor={(item, index) => item?.id ?? String(index)}
          scrollEnabled={false}
          contentContainerStyle={styles.carouselContainerVideo}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            hasNext ? (
              <>
                {loadingMore ? (
                  <RenderCollectionSkeleton
                    key={`skeleton-${collection}`}
                    styles={styles}
                    collection={collection}
                  />
                ) : (
                  <Pressable
                    onPress={onLoadMore}
                    disabled={loadingMore}
                    style={styles.loadMoreButton}
                  >
                    <CustomText
                      size={fontSize.s}
                      weight="Dem"
                      fontFamily={fonts.franklinGothicURW}
                      color={theme.colorSecondary600}
                    >
                      {t('screens.common.seeMore')}
                    </CustomText>
                  </Pressable>
                )}
              </>
            ) : null
          }
          renderItem={({ item, index }) => (
            <CarouselCard
              type="videos"
              showPlayIcon={true}
              item={{
                ...item,
                category: item?.category ? { id: undefined, title: item.category.title } : undefined
              }}
              topic={item?.category?.title ?? ''}
              title={item?.title ?? ''}
              imageUrl={
                Array.isArray(item?.heroImages) && item?.heroImages[0]?.url
                  ? item.heroImages[0].url
                  : ''
              }
              isBookmarked={item?.isBookmarked}
              headingStyles={styles.verticalHeading}
              contentContainerStyle={styles.verticalVideoContainer}
              imageStyle={styles.verticalImageStyle}
              onBookmarkPress={() =>
                onToggleBookmark(item?.id ?? '', 'Content', item?.title, index + 1)
              }
              onPress={() =>
                onPress({
                  routeName: routeNames.VIDEOS_STACK,
                  screenName: screenNames.EPISODE_DETAIL_PAGE,
                  slug: item?.slug,
                  index: index + 1
                })
              }
            />
          )}
        />
      )}
      {(collection === COLLECTION_TYPE.POSTS || collection === COLLECTION_TYPE.PRESS_ROOM) &&
        (data?.length ?? 0) > 0 && (
          <FlatList<SearchContentItem>
            data={data ?? []}
            keyExtractor={(item, index) => item?.id ?? String(index)}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              hasNext ? (
                <>
                  {loadingMore ? (
                    <RenderCollectionSkeleton
                      key={`skeleton-${collection}`}
                      styles={styles}
                      collection={collection}
                    />
                  ) : (
                    <Pressable
                      onPress={onLoadMore}
                      disabled={loadingMore}
                      style={styles.loadMoreButton}
                    >
                      <CustomText
                        size={fontSize.s}
                        weight="Dem"
                        fontFamily={fonts.franklinGothicURW}
                        color={theme.colorSecondary600}
                        textStyles={styles.verMasButton}
                      >
                        {t('screens.common.seeMore')}
                      </CustomText>
                    </Pressable>
                  )}
                </>
              ) : null
            }
            renderItem={({ item, index }) => {
              const publishedAt = formatMexicoDateTime(item?.publishedAt ?? '');
              return (
                <BookmarkCard
                  key={index.toString()}
                  category={
                    collection === COLLECTION_TYPE.PRESS_ROOM
                      ? ''
                      : (item?.topics?.[0]?.title ?? item?.category?.title ?? '')
                  }
                  heading={item?.title ?? ''}
                  index={index}
                  subHeading={
                    typeof publishedAt === 'string'
                      ? publishedAt
                      : publishedAt
                        ? `${publishedAt.date} ${publishedAt.time}`
                        : ''
                  }
                  isBookmarkChecked={item?.isBookmarked}
                  id={item?.id ?? ''}
                  containerStyle={styles.bookmarkContainer}
                  subHeadingColor={theme.labelsTextLabelPlay}
                  onPressingBookmark={() =>
                    onToggleBookmark(item?.id ?? '', 'Content', item?.title, index + 1)
                  }
                  onPress={() =>
                    COLLECTION_TYPE.POSTS === collection
                      ? onPress({
                          routeName: routeNames.HOME_STACK,
                          screenName: screenNames.STORY_PAGE_RENDERER,
                          slug: item?.slug,
                          index: index + 1
                        })
                      : onPress({
                          interactiveUrl: item?.fullPath ?? '',
                          id: item?.id,
                          slug: item?.slug,
                          index: index + 1
                        })
                  }
                />
              );
            }}
          />
        )}

      {collection === COLLECTION_TYPE.LIVE_BLOGS && (
        <FlatList
          data={data ?? []}
          renderItem={({ item, index }) => {
            const publishedAt = formatMexicoDateTime(item?.publishedAt ?? '');
            return (
              <LiveBlogCard
                t={t}
                title={item?.title ?? ''}
                subTitle={
                  typeof publishedAt === 'string'
                    ? publishedAt
                    : publishedAt
                      ? `${publishedAt.date} ${publishedAt.time}`
                      : ''
                }
                isLive={Boolean(item?.liveblogStatus)}
                subHeadingFont={fonts.franklinGothicURW}
                subHeadingSize={fontSize.xxs}
                subHeadingWeight="Dem"
                subHeadingColor={theme.labelsTextLabelPlay}
                mediaUrl={
                  Array.isArray(item?.heroImages)
                    ? (item?.heroImages[0]?.url ?? '')
                    : (item?.heroImages?.url ?? '')
                }
                handleMedia={true}
                showBookmark
                isBookmarked={item?.isBookmarked}
                onBookmarkPress={() =>
                  onToggleBookmark(item?.id ?? '', 'Content', item?.title, index + 1)
                }
                bookmarkIconContainerStyle={styles.liveBlogBookmarkIconContainerStyle}
                onPress={() =>
                  onPress({
                    routeName: routeNames.HOME_STACK,
                    screenName: screenNames.LIVE_BLOG,
                    slug: item?.slug,
                    index: index + 1
                  })
                }
              />
            );
          }}
          keyExtractor={(item, index) => item?.id ?? `${index}`}
          decelerationRate={0.8}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <CustomDivider style={styles.liveBlogItemSeparator} />}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            hasNext ? (
              <>
                {loadingMore ? (
                  <RenderCollectionSkeleton
                    key={`skeleton-${collection}`}
                    styles={styles}
                    collection={collection}
                  />
                ) : (
                  <Pressable
                    onPress={onLoadMore}
                    disabled={loadingMore}
                    style={styles.loadMoreButton}
                  >
                    <CustomText
                      size={fontSize.s}
                      weight="Dem"
                      fontFamily={fonts.franklinGothicURW}
                      color={theme.colorSecondary600}
                      textStyles={styles.verMasButton}
                    >
                      {t('screens.common.seeMore')}
                    </CustomText>
                  </Pressable>
                )}
              </>
            ) : null
          }
        />
      )}

      {(collection === COLLECTION_TYPE.PROGRAMS || collection === COLLECTION_TYPE.INTERACTIVOS) && (
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            const publishedAt = formatMexicoDateTime(item?.publishedAt ?? '');
            return (
              <InfoCard
                title={item?.title}
                titleFontFamily={fonts.notoSerifExtraCondensed}
                titleFontWeight="R"
                titleFontSize={fontSize.m}
                subTitleColor={theme.labelsTextLabelPlay}
                imageUrl={
                  collection === COLLECTION_TYPE.INTERACTIVOS
                    ? Array.isArray(item?.heroImages) && item?.heroImages[0]?.url
                    : Array.isArray(item?.heroImages) && item?.heroImages[0]?.sizes?.vintage?.url
                      ? item.heroImages?.[0].sizes?.vintage?.url
                      : ''
                }
                subTitle={
                  collection === COLLECTION_TYPE.INTERACTIVOS
                    ? typeof publishedAt === 'string'
                      ? publishedAt
                      : publishedAt
                        ? `${publishedAt.date} ${publishedAt.time}`
                        : ''
                    : item?.schedule
                }
                item={{
                  ...item,
                  category: item?.category
                    ? { id: undefined, title: item.category.title }
                    : undefined
                }}
                aspectRatio={collection === COLLECTION_TYPE.INTERACTIVOS ? 16 / 9 : 4 / 5}
                imageWidth={actuatedNormalize(178)}
                contentContainerStyle={styles.contentContainerStyle}
                titleStyles={styles.titleStyles}
                subTitleStyles={styles.subTitleStyles}
                onAdditionalIconPress={() =>
                  onToggleBookmark(item?.id ?? '', 'Content', item?.title, index + 1)
                }
                bookmarkIconContainerStyle={styles.bookmarkIconContainerStyle}
                isBookmark={item?.isBookmarked}
                onPress={() =>
                  collection === COLLECTION_TYPE.INTERACTIVOS
                    ? onPress({
                        interactiveUrl: item?.fullPath ?? '',
                        id: item?.id,
                        slug: item?.slug,
                        index: index + 1
                      })
                    : onPress({
                        routeName: routeNames.VIDEOS_STACK,
                        screenName: screenNames.PROGRAMS,
                        slug: item?.slug,
                        id: item?.id,
                        index: index + 1
                      })
                }
              />
            );
          }}
          numColumns={2}
          keyExtractor={(_, i) => `item-${i}`}
          style={styles.flatList}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            hasNext ? (
              <>
                {loadingMore ? (
                  <RenderCollectionSkeleton
                    key={`skeleton-${collection}`}
                    styles={styles}
                    collection={collection}
                  />
                ) : (
                  <Pressable
                    onPress={onLoadMore}
                    disabled={loadingMore}
                    style={styles.loadMoreButton}
                  >
                    <CustomText
                      size={fontSize.s}
                      weight="Dem"
                      fontFamily={fonts.franklinGothicURW}
                      color={theme.colorSecondary600}
                    >
                      {t('screens.common.seeMore')}
                    </CustomText>
                  </Pressable>
                )}
              </>
            ) : null
          }
        />
      )}

      {collection === COLLECTION_TYPE.AUTHORS && (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item?.id || index}`}
          contentContainerStyle={styles.talentsContainer}
          renderItem={({ item, index }) => (
            <InfoCard
              title={item?.title}
              titleFontFamily={fonts.notoSerif}
              titleFontWeight="R"
              titleFontSize={fontSize.m}
              imageUrl={
                Array.isArray(item?.heroImages) && item?.heroImages[0]?.url
                  ? item.heroImages[0].url
                  : ''
              }
              item={{
                ...item,
                category: item?.category ? { id: undefined, title: item.category.title } : undefined
              }}
              imageHeight={actuatedNormalize(52)}
              imageWidth={actuatedNormalize(52)}
              imageStyle={styles.talentsAvatar}
              contentContainerStyle={styles.talentsRow}
              titleStyles={styles.titleRowStyles}
              additionalIcon={<BookmarkIcon />}
              isBookmark={item?.isBookmarked}
              onAdditionalIconPress={() =>
                onToggleBookmark(item?.id ?? '', 'Content', item?.title, index + 1)
              }
              onPress={() =>
                onPress({
                  routeName: routeNames.HOME_STACK,
                  screenName: screenNames.AUTHOR_DETAILS,
                  id: item?.id,
                  slug: item?.slug,
                  index: index + 1
                })
              }
            />
          )}
          scrollEnabled={false}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            hasNext ? (
              <>
                {loadingMore ? (
                  <RenderCollectionSkeleton
                    key={`skeleton-${collection}`}
                    styles={styles}
                    collection={collection}
                  />
                ) : (
                  <Pressable
                    onPress={onLoadMore}
                    disabled={loadingMore}
                    style={styles.loadMoreButton}
                  >
                    <CustomText
                      size={fontSize.s}
                      weight="Dem"
                      fontFamily={fonts.franklinGothicURW}
                      color={theme.colorSecondary600}
                      textStyles={styles.verMasButton}
                    >
                      {t('screens.common.seeMore')}
                    </CustomText>
                  </Pressable>
                )}
              </>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default RenderCollection;
