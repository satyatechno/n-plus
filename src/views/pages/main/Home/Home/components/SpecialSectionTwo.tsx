import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { ApolloQueryResult } from '@apollo/client';

import HorizontalInfoListSkeleton from '@src/views/organisms/HorizontalInfoListSkeleton';
import useSpecialSectionTwoViewModel from '@src/viewModels/main/Home/Home/useSpecialSectionTwoViewModel';
import { type HorizontalInfoItem } from '@src/views/organisms/HorizontalInfoList';
import { ExclusiveItem } from '@src/models/main/Videos/Videos';
import { fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import SnapHorizontalList from '@src/views/organisms/SnapHorizontalList';

interface SpecialSectionOneProps {
  onExclusivePress: (item: ExclusiveItem) => void;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const SpecialSectionTwo: React.FC<SpecialSectionOneProps> = ({
  onExclusivePress,
  registerRefetch,
  sectionGapStyle
}) => {
  const { data, loading, refetchSpecialSectionTwo, handleAnalyticsPress } =
    useSpecialSectionTwoViewModel();
  const styles = useMemo(() => themeStyles(), []);

  useEffect(() => {
    registerRefetch(() =>
      refetchSpecialSectionTwo({
        section: 'section_2',
        isBookmarked: true
      })
    );
  }, [registerRefetch, refetchSpecialSectionTwo]);

  return (
    <View style={sectionGapStyle}>
      {loading ? (
        <HorizontalInfoListSkeleton itemCount={5} showSeeAll={false} />
      ) : data?.videos?.length > 0 ? (
        <SnapHorizontalList
          heading={data?.title}
          titleFontSize={fontSize.s}
          titleFontFamily={fonts.notoSerif}
          titleFontWeight="R"
          titleStyles={styles.titleStyles}
          headingFontSize={spacing['7xl']}
          data={
            data?.videos?.map((item: ExclusiveItem) => ({
              ...item,
              specialImage: { url: item.specialImage }
            })) || []
          }
          onPress={(item: HorizontalInfoItem, index?: number) => {
            const exclusiveItem = item as unknown as ExclusiveItem;
            handleAnalyticsPress(exclusiveItem, index ?? 0);
            onExclusivePress(exclusiveItem);
          }}
          headingStyles={styles.exclusiveHeadingStyles}
          getImageUrl={(item) => {
            const exclusiveItem = item as unknown as ExclusiveItem;
            return exclusiveItem?.heroImage?.sizes?.portrait?.url ?? '';
          }}
          aspectRatio={9 / 16}
        />
      ) : null}
    </View>
  );
};

export default React.memo(SpecialSectionTwo);

const themeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1
    },
    exclusiveHeadingStyles: {
      marginHorizontal: spacing.xs,
      marginBottom: letterSpacing.s,
      fontSize: fontSize['15xl'],
      lineHeight: lineHeight['12xl'],
      paddingTop: spacing.xxs
    },
    titleStyles: {
      lineHeight: lineHeight.l,
      marginTop: spacing.xxs
    }
  });
