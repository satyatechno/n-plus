import React, { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@src/hooks/useTheme';
import { themeStyles } from '@src/views/pages/main/MyAccount/MyNotification/styles';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { useMyNotificationViewModel } from '@src/viewModels/main/MyAccount/MyNotification/useMyNotificationViewModel';
import NoNotificationIcon from '@src/assets/icons/NoNotificationIcon';
import { actuatedNormalize } from '@src/utils/pixelScaling';
import CustomText from '@src/views/atoms/CustomText';
import { fontSize } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import { CheckboxIcon, MenuIcon, UncheckedBoxIcon } from '@src/assets/icons';
import CustomButton from '@src/views/molecules/CustomButton';
import NotificationOptionsModal from '@src/views/pages/main/MyAccount/MyNotification/components/NotificationOptionsModal';
import { FallbackImage } from '@src/assets/images';
import MyNotificationSkeleton from '@src/views/pages/main/MyAccount/MyNotification/components/MyNotificationSkeleton';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomImage from '@src/views/atoms/CustomImage';

const MyNotification: React.FC = () => {
  const {
    t,
    goBack,
    notificationLoading,
    notificationData,
    isModalVisible,
    onMenuPress,
    handleCloseModal,
    onViewUnreadPress,
    onMarkReadPress,
    onDeletePress,
    onDeleteAllPress,
    onManageNotificationPress,
    showCheckBox,
    onNotificationPres,
    selectedNotification,
    refreshing,
    onRefresh,
    hasMoreNotification,
    notificationMoreLoader,
    toastType,
    toastMessage,
    setToastMessage,
    onSeeMoreNotificationPress,
    onDeleteSelectedNotificationPress
  } = useMyNotificationViewModel();
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);

  const topHeader = () => (
    <CustomHeader
      variant={'dualVariant'}
      headerText={t('screens.myNotifications.title')}
      onPress={goBack}
      headerTextFontFamily={fonts.franklinGothicURW}
      headerTextWeight="Boo"
      headerTextSize={fontSize.s}
      headerTextStyles={styles.headerText}
      additionalIcon={<MenuIcon fill={theme.greyButtonSecondaryOutline} />}
      onAdditionalButtonPress={onMenuPress}
    />
  );

  const notificationModalView = () => (
    <NotificationOptionsModal
      visible={isModalVisible}
      title={t('screens.myNotifications.text.notificationOptions')}
      onRequestClose={handleCloseModal}
      onViewUnreadPress={onViewUnreadPress}
      onMarkReadPress={onMarkReadPress}
      onDeletePress={onDeletePress}
      onDeleteAllPress={onDeleteAllPress}
      onManageNotificationPress={onManageNotificationPress}
      isListEmpty={!notificationData.length}
    />
  );

  if (notificationLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {topHeader()}
        <MyNotificationSkeleton count={10} />
      </SafeAreaView>
    );
  }

  if (notificationData.length == 0) {
    return (
      <SafeAreaView style={styles.container}>
        {topHeader()}
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <NoNotificationIcon
              width={actuatedNormalize(52)}
              height={actuatedNormalize(52)}
              color={theme.iconIconographyDisabledState2}
              backgrounColor={theme.mainBackgroundDefault}
            />
          </View>
          <CustomText
            fontFamily={fonts.franklinGothicURW}
            size={fontSize.l}
            weight="Med"
            color={theme.subtitleTextSubtitle}
            textStyles={styles.emptyTextStyles}
          >
            {t('screens.myNotifications.text.youDontHaveNotificationsYet')}
          </CustomText>
          <CustomText
            fontFamily={fonts.franklinGothicURW}
            size={fontSize.s}
            color={theme.subtitleTextSubtitle}
            textStyles={styles.emptySubTextStyles}
          >
            {t('screens.myNotifications.text.weWillLetYouKnow')}
          </CustomText>
        </View>
        {notificationModalView()}
      </SafeAreaView>
    );
  }

  const renderNotifications = ({
    item,
    index
  }: {
    item: {
      id: string;
      isRead?: boolean;
      collection?: string;
      slug?: string;
      createdAt: string;
      title?: string;
      content?: string;
      image?: string;
    };
    index: number;
  }) => {
    const publishedAt = formatMexicoDateTime(item.createdAt);
    return (
      <Pressable key={index} style={styles.itemContainer} onPress={() => onNotificationPres(item)}>
        {showCheckBox && (
          <View style={styles.checkboxContainer}>
            {selectedNotification.includes(item?.id ?? '') ? (
              <CheckboxIcon stroke={theme.iconIconographyDisabledState2} />
            ) : (
              <UncheckedBoxIcon stroke={theme.iconIconographyDisabledState2} />
            )}
          </View>
        )}
        <View style={styles.detailsContainer}>
          <View style={styles.titleContainer}>
            {!item?.isRead && <View style={styles.readDot} />}
            <CustomText
              fontFamily={fonts.superclarendon}
              size={fontSize.xxs}
              color={theme.sectionTextTitleSpecial}
              textStyles={styles.titleText}
            >
              {item.title}
            </CustomText>
          </View>
          {item?.content && (
            <CustomText
              fontFamily={fonts.notoSerif}
              size={fontSize.xs}
              color={theme.newsTextPictureCarouselTitle}
              textStyles={styles.contentText}
            >
              {item.content}
            </CustomText>
          )}
          <CustomText
            weight="Med"
            fontFamily={fonts.franklinGothicURW}
            size={fontSize.xxs}
            color={theme.labelsTextLabelPlay}
            textStyles={styles.createdAtText}
          >
            {typeof publishedAt === 'string'
              ? publishedAt
              : publishedAt
                ? `${publishedAt.date} ${publishedAt.time}`
                : ''}
          </CustomText>
        </View>
        <View style={showCheckBox ? styles.imageSmallContainer : styles.imageContainer}>
          {item?.image ? (
            <CustomImage source={{ uri: item.image }} style={styles.imageBlock} />
          ) : (
            <FallbackImage width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {topHeader()}
      <View style={styles.subContainer}>
        <FlatList
          data={notificationData}
          renderItem={renderNotifications}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?.id?.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={() =>
            hasMoreNotification ? (
              <Pressable hitSlop={10} onPress={onSeeMoreNotificationPress}>
                {notificationMoreLoader ? (
                  <MyNotificationSkeleton count={1} />
                ) : (
                  <CustomText
                    weight={'Dem'}
                    fontFamily={fonts.franklinGothicURW}
                    size={fontSize.xs}
                    color={theme.bodyTextOther}
                    textStyles={styles.seeMoreText}
                  >
                    {t('screens.liveBlog.text.seeMore')}
                  </CustomText>
                )}
              </Pressable>
            ) : null
          }
        />
      </View>

      <CustomToast
        type={toastType}
        message={toastMessage}
        isVisible={!!toastMessage}
        onDismiss={() => setToastMessage('')}
        toastContainerStyle={styles.toastContainer}
      />

      {selectedNotification.length > 0 && (
        <CustomButton
          variant={'outlined'}
          buttonText={t('screens.myNotifications.text.deleteNotification')}
          buttonStyles={styles.deleteButton}
          buttonTextColor={theme.primaryCTATextGreyPrimaryText}
          onPress={onDeleteSelectedNotificationPress}
        />
      )}
      {notificationModalView()}
    </SafeAreaView>
  );
};

export default MyNotification;
