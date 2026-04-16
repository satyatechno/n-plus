import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Modal } from 'react-native';

import { ApolloQueryResult } from '@apollo/client';

import { fonts } from '@src/config/fonts';
import { Lottie } from '@src/assets/lottie';
import { AppTheme } from '@src/themes/theme';
import { NPlusIcon } from '@src/assets/icons';
import { isIos } from '@src/utils/platformCheck';
import CustomText from '@src/views/atoms/CustomText';
import SearchIcon from '@src/assets/icons/SearchIcon';
import CustomWebView from '@src/views/atoms/CustomWebView';
import CategoryHeader from '@src/views/molecules/CategoryHeader';
import { borderWidth, fontSize, letterSpacing, lineHeight, spacing } from '@src/config/styleConsts';
import { useHomeHeaderViewModel } from '@src/viewModels/main/Home/Home/useHomeHeaderViewModel';
import CategoryHeaderSkeleton from '@src/views/pages/main/Home/StoryPage/StoryPage/components/SkeletonLoader/CategoryHeaderSkeleton';
import CustomLottieView from '@src/views/atoms/CustomLottieView';
import constants from '@src/config/constants';

interface HomeHeaderProps {
  t: (key: string) => string;
  theme: AppTheme;
  currentTheme: string;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
}

const HomeHeader = ({ t, theme, currentTheme, registerRefetch }: HomeHeaderProps) => {
  const {
    categories,
    loading,
    onCategoryPress,
    onPressingSearch,
    showWebView,
    webUrl,
    handleWebViewClose,
    onLiveTVPress,
    refetchHeader
  } = useHomeHeaderViewModel();

  useEffect(() => {
    registerRefetch(() => refetchHeader());
  }, [registerRefetch, refetchHeader]);

  const styles = themeStyles(theme);

  return (
    <View>
      <View style={styles.mainHeader}>
        <View style={styles.leftSection}>
          <NPlusIcon color={theme.newsTextTitlePrincipal} height={29} width={52} />
        </View>

        <View style={styles.centerSection}>
          <Pressable
            onPress={onLiveTVPress}
            style={({ pressed }) => [
              styles.liveButton,
              pressed && { backgroundColor: theme.toggleIcongraphyDisabledState }
            ]}
          >
            <CustomLottieView
              source={currentTheme == constants.DARK ? Lottie.liveDotPink : Lottie.liveDotRed}
            />
            <CustomText
              size={fontSize.xs}
              fontFamily={fonts.franklinGothicURW}
              weight="Dem"
              color={theme.tagsTextLive}
              textStyles={styles.liveText}
            >
              {t('screens.common.live')}
            </CustomText>
          </Pressable>
        </View>

        <View style={styles.rightSection}>
          <Pressable style={styles.searchButton} onPress={onPressingSearch}>
            <SearchIcon stroke={theme.newsTextTitlePrincipal} />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <CategoryHeaderSkeleton />
      ) : (
        <CategoryHeader
          useHeaderData={false}
          categories={categories}
          onCategoryPress={onCategoryPress}
          variant="homePage"
          containerStyle={styles.categoryHeaderContainer}
          categoryTextStyle={styles.categoryHeaderStyle}
        />
      )}

      {showWebView && (
        <Modal
          visible={showWebView}
          animationType="slide"
          transparent
          onRequestClose={handleWebViewClose}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={handleWebViewClose}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Modal>
      )}
    </View>
  );
};

export default HomeHeader;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: spacing.xs,
      marginVertical: spacing.xs,
      backgroundColor: theme.mainBackgroundDefault
    },
    leftSection: {
      alignItems: 'flex-start',
      marginRight: spacing.m,
      marginLeft: spacing.xs
    },
    centerSection: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-end'
    },
    rightSection: {
      alignItems: 'flex-end'
    },
    liveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xxs,
      paddingVertical: spacing.xxxs,
      borderWidth: borderWidth.m,
      borderColor: theme.dividerGrey,
      backgroundColor: theme.mainBackgroundDefault,
      borderRadius: 20,
      columnGap: spacing.xxxs
    },
    liveText: {
      letterSpacing: letterSpacing.sm,
      top: isIos ? 2 : 0.5
    },
    searchButton: {
      padding: spacing.xxs,
      alignItems: 'center',
      justifyContent: 'center'
    },
    categoryHeaderContainer: {
      marginTop: 0,
      borderBottomColor: theme.dividerGrey
    },
    webViewContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    webViewHeaderContainer: {
      backgroundColor: theme.mainBackgroundDefault,
      marginLeft: spacing.xs
    },
    liveDot: {
      paddingRight: spacing.xxxs
    },
    categoryHeaderStyle: {
      lineHeight: lineHeight['2xl']
    }
  });
