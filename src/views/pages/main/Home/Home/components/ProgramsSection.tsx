import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import { ApolloQueryResult } from '@apollo/client';

import TopicChips from '@src/views/organisms/TopicChips';
import SnapHorizontalList from '@src/views/organisms/SnapHorizontalList';
import HorizontalInfoListSkeleton from '@src/views/organisms/HorizontalInfoListSkeleton';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import useProgramSectionViewModel from '@src/viewModels/main/Home/Home/useProgramSectionViewModel';
import { ProgramItem } from '@src/models/main/Videos/Programs';

interface Props {
  t: (key: string) => string;
  theme: AppTheme;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

const ProgramsSection: React.FC<Props> = ({ t, theme, registerRefetch, sectionGapStyle }) => {
  const styles = useMemo(() => themeStyles(theme), [theme]);

  const {
    chipsTopic,
    programasNPlusData,
    programasNPlusLoading,
    onProgramsTogglePress,
    onProgramsCardPress,
    onSeeAllProgramsPress,
    refetchChannels,
    refetchProgramas,
    programasChannel,
    programasListRef
  } = useProgramSectionViewModel();

  useEffect(() => {
    registerRefetch(() => refetchChannels());

    if (programasChannel) {
      registerRefetch(() => refetchProgramas({ channel: programasChannel }));
    }
  }, [programasChannel, refetchChannels, refetchProgramas]);

  return (
    <View style={sectionGapStyle}>
      <TopicChips
        topics={chipsTopic}
        key={chipsTopic?.length ?? 0}
        headingFontSize={52}
        headingFontWeight="M"
        headingFontFamily={fonts.mongoose}
        preselect={true}
        isCategory={true}
        headingTextstyle={styles.topicChipsTitle}
        heading={t('screens.videos.text.programNplus')}
        mainContainerstyle={styles.mainContainerStyle}
        onPress={onProgramsTogglePress}
      />

      {programasNPlusLoading ? (
        <HorizontalInfoListSkeleton
          itemCount={5}
          showHeadingSkeleton={false}
          imageHeight={222}
          imageWidth={178}
          containerStyle={styles.programasSkeletonContainer}
        />
      ) : (
        <SnapHorizontalList
          listRef={programasListRef}
          imageWidth={164}
          aspectRatio={4 / 5}
          onPress={onProgramsCardPress}
          data={programasNPlusData?.HomepagePrograms}
          titleColor={theme.iconIconographyGenericState}
          titleFontFamily={fonts.notoSerifExtraCondensed}
          titleFontWeight="R"
          titleFontSize={fontSize.xs}
          titleStyles={styles.programTitleStyle}
          subTitleColor={theme.labelsTextLabelPlay}
          subTitleStyles={styles.programSubtitleStyle}
          subTitleFontFamily={fonts.franklinGothicURW}
          subTitleFontWeight="R"
          subTitleFontSize={fontSize.xxs}
          seeAllText={t('screens.videos.text.allPrograms')}
          onSeeAllPress={onSeeAllProgramsPress}
          seeAllButtonStyles={styles.seeAllButtonStyles}
          containerStyle={styles.containerStyleProgram}
          getImageUrl={(item: ProgramItem) => item?.heroImage?.sizes?.vintage?.url ?? ''}
          resizeMode="cover"
          contentContainerStyle={styles.programasContainer}
          itemSpacing={spacing.xs}
        />
      )}
    </View>
  );
};

export default React.memo(ProgramsSection);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    topicChipsTitle: {
      lineHeight: lineHeight['14xl'],
      textTransform: 'uppercase',
      letterSpacing: -0.25,
      marginBottom: -spacing.s,
      color: theme.tagsTextAuthor,
      marginTop: 0,
      fontWeight: '400'
    },
    mainContainerStyle: {
      bottom: spacing.xx,
      marginHorizontal: spacing.xs
    },
    programTitleStyle: {
      lineHeight: lineHeight['m'],
      marginTop: spacing.xxxs,
      letterSpacing: 0.056
    },
    programSubtitleStyle: {
      lineHeight: lineHeight.xs,
      marginTop: spacing.xxxxs
    },
    programasSkeletonContainer: {
      marginTop: spacing.s
    },
    containerStyleProgram: {
      bottom: spacing.s
    },
    programasContainer: {
      marginTop: spacing.m,
      marginBottom: spacing.s
    },
    seeAllButtonStyles: {
      marginTop: -spacing.xxxxs
    }
  });
