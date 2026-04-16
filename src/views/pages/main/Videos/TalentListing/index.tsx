import React from 'react';
import { FlatList } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { BookmarkIcon, SearchIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { themeStyles } from '@src/views/pages/main/Videos/TalentListing/styles';
import useTalentListingViewModel from '@src/viewModels/main/Videos/TalentListing/useTalentListingViewModel';
import TopicChips from '@src/views/organisms/TopicChips';
import InfoCard from '@src/views/molecules/InfoCard';
import { fontSize } from '@src/config/styleConsts';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import CustomDivider from '@src/views/atoms/CustomDivider';

const TalentListing = () => {
  const { theme, t, goBack, chipsTopic, nPlusTalentData, onProgramsTogglePress, onBookmarkPress } =
    useTalentListingViewModel();

  const styles = themeStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
      <CustomHeader
        onPress={goBack}
        headerText={t('screens.talentListing.text.ourTeam')}
        headerTextWeight="Dem"
        headerTextFontFamily={fonts.franklinGothicURW}
        headerTextStyles={styles.headerTextStyles}
        additionalIcon={<SearchIcon stroke={theme.greyButtonSecondaryOutline} />}
        variant="dualVariant"
        additionalButtonStyle={styles.searchButton}
        headerStyle={styles.headerStyle}
      />

      <TopicChips
        topics={chipsTopic}
        headingFontSize={actuatedNormalize(fontSize['4xl'])}
        headingFontWeight="R"
        headingFontFamily={fonts.notoSerifExtraCondensed}
        preselect={true}
        headingTextstyle={styles.topicChipsTitle}
        heading={t('screens.talentListing.text.ourTeam')}
        mainContainerstyle={styles.topicChipsContainerStyle}
        onPress={() => onProgramsTogglePress()}
      />

      <FlatList
        data={nPlusTalentData}
        keyExtractor={(item, index) => `${item?.id || index}`}
        contentContainerStyle={styles.mainContainerStyle}
        renderItem={({ item }) => (
          <InfoCard
            title={item?.title}
            titleFontFamily={fonts.notoSerif}
            titleFontWeight="R"
            titleFontSize={fontSize.m}
            imageUrl={item?.image}
            item={item}
            imageHeight={actuatedNormalize(52)}
            imageWidth={actuatedNormalize(52)}
            imageStyle={styles.imageStyle}
            contentContainerStyle={styles.contentContainerStyle}
            titleStyles={styles.titleStyles}
            additionalIcon={<BookmarkIcon />}
            onAdditionalIconPress={() => onBookmarkPress()}
          />
        )}
        ItemSeparatorComponent={() => <CustomDivider style={styles.divider} />}
      />
    </SafeAreaView>
  );
};

export default TalentListing;
