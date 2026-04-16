import React from 'react';
import { View, FlatList, StyleSheet, StyleProp, ImageStyle } from 'react-native';

import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import CarouselCard from '@src/views/molecules/CarouselCard';
import LiveBlogCard from '@src/views/organisms/LiveBlogCard';
import { CategoryContentListProps } from '@src/views/templates/main/CategoryContentList/interface';
import { TransformedCategoryItem } from '@src/models/main/Home/Category/CategoryTopicDetail';
import { fonts } from '@src/config/fonts';
import { fontSize, spacing } from '@src/config/styleConsts';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import { useTheme } from '@src/hooks/useTheme';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';

const CategoryContentList = ({
  t,
  data,
  heading,
  hasNextPage,
  isLoadingMore,
  onLoadMore,
  onItemPress,
  onBookmarkPress,
  containerStyle,
  listContainerStyle,
  headingStyle,
  dividerStyle,
  seeMoreButtonStyle,
  seeMoreButtonTextStyle,
  seeMoreButtonHitSlop,
  carouselCardContainerStyle,
  carouselHeadingStyle,
  carouselContentContainerStyle,
  carouselImageStyle,
  carouselSubheadingStyle,
  liveBlogBookmarkContainerStyle
}: CategoryContentListProps) => {
  const [theme] = useTheme();

  const renderItem = ({ item, index }: { item: TransformedCategoryItem; index: number }) => {
    if (item.collection === 'live-blogs') {
      const publishedAt = formatMexicoDateTime(item?.publishedAt ?? '');

      const isLive = Boolean(item?.liveblogStatus);
      const hasEmptyMediaUrl = !item?.imageUrl || item?.imageUrl === '';

      return (
        <View style={styles.liveBlogContainer}>
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
            subHeadingFont={fonts.franklinGothicURW}
            subHeadingSize={fontSize.xxs}
            subHeadingWeight="Med"
            subHeadingColor={theme.labelsTextLabelPlace}
            isLive={isLive}
            mediaUrl={item?.imageUrl ?? ''}
            handleMedia={true}
            hasEmptyMediaUrl={hasEmptyMediaUrl}
            showBookmark
            isBookmarked={item?.isBookmarked}
            onBookmarkPress={() => onBookmarkPress?.(item, index)}
            bookmarkIconContainerStyle={StyleSheet.flatten(liveBlogBookmarkContainerStyle)}
            liveBlogTextBlockStyle={
              hasEmptyMediaUrl ? styles.liveBlogTextBlockWithMargin : undefined
            }
            headingStyle={hasEmptyMediaUrl && !isLive ? styles.headingWithMargin : undefined}
            onPress={() => onItemPress(item, index)}
            bottomTitleContainerStyle={styles.bottomTitleContainer}
          />
        </View>
      );
    }

    return (
      <View style={carouselCardContainerStyle}>
        <CarouselCard
          item={item}
          onPress={() => onItemPress(item, index)}
          headingStyles={StyleSheet.flatten(carouselHeadingStyle)}
          contentContainerStyle={StyleSheet.flatten(carouselContentContainerStyle)}
          imageStyle={carouselImageStyle as StyleProp<ImageStyle>}
          subheadingStyles={StyleSheet.flatten(carouselSubheadingStyle)}
          imagePosition="right"
          showBookmark
          onBookmarkPress={() => onBookmarkPress?.(item, index)}
        />
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      {heading && (
        <CustomText
          fontFamily={fonts.notoSerifExtraCondensed}
          size={fontSize['2xl']}
          textStyles={StyleSheet.flatten(headingStyle)}
        >
          {heading}
        </CustomText>
      )}

      {data.length > 0 && (
        <FlatList
          scrollEnabled={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={listContainerStyle}
          ItemSeparatorComponent={() => <View style={dividerStyle} />}
          ListFooterComponent={() => <View style={dividerStyle} />}
        />
      )}

      {hasNextPage && onLoadMore && (
        <CustomButton
          onPress={onLoadMore}
          buttonText={t('screens.common.seeMore')}
          variant="text"
          buttonTextColor={theme.newsTextTitlePrincipal}
          buttonTextWeight="Dem"
          buttonTextFontFamily={fonts.franklinGothicURW}
          buttonTextStyles={StyleSheet.flatten(seeMoreButtonTextStyle)}
          buttonStyles={StyleSheet.flatten(seeMoreButtonStyle)}
          hitSlop={seeMoreButtonHitSlop}
          disabled={isLoadingMore}
          isLoading={isLoadingMore}
        />
      )}
    </View>
  );
};

export default CategoryContentList;

const styles = StyleSheet.create({
  liveBlogContainer: {
    marginHorizontal: actuatedNormalize(spacing.xs)
  },
  liveBlogTextBlockWithMargin: {
    marginTop: actuatedNormalizeVertical(spacing.xs)
  },
  headingWithMargin: {
    marginTop: actuatedNormalizeVertical(spacing.xs)
  },
  bottomTitleContainer: {
    marginHorizontal: -actuatedNormalize(spacing.xs)
  }
});
