import React from 'react';
import { FlatList, Pressable, ScrollView, View, ListRenderItemInfo } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { Newsletter } from '@src/models/main/MyAccount/Newsletters';
import CustomText from '@src/views/atoms/CustomText';
import CustomToast from '@src/views/molecules/CustomToast';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomButton from '@src/views/molecules/CustomButton';
import ConsentFooter from '@src/views/organisms/ConsentFooter';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { themeStyles } from '@src/views/pages/main/MyAccount/Newsletters/styles';
import ModalView from '@src/views/pages//main/MyAccount/Newsletters/components/ModalView';
import NoSubscription from '@src/views/pages//main/MyAccount/Newsletters/components/NoSubscription';
import NewsletterItem from '@src/views/pages//main/MyAccount/Newsletters/components/NewsletterItem';
import useNewslettersViewModel from '@src/viewModels/main/MyAccount/Newsletters/useNewslettersViewModel';
import NewsletterItemSkeleton from '@src/views/pages//main/MyAccount/Newsletters/components/NewsletterItemSkeleton';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import CustomModal from '@src/views/organisms/CustomModal';
import {
  ANALYTICS_COLLECTION,
  ANALYTICS_ORGANISMS,
  ANALYTICS_PAGE
} from '@src/utils/analyticsConstants';

const Newsletters: React.FC = () => {
  const {
    theme,
    goBack,
    t,
    mySubscriptions,
    toggleMySubscriptions,
    flatlistData,
    userNewslettersData,
    openModal,
    isModalVisible,
    checkBoxTopic,
    newsletterSubscribed,
    onCheckBoxPress,
    onUnCheckBoxPress,
    onSubmit,
    changeSubscriptionLoading,
    onSubscribedUnCheckBoxPress,
    onSubscribedCheckBoxPress,
    newsletterNotSubscribed,
    userNewslettersLoading,
    onUnsubscribeResponsePress,
    unSubscribeLoading,
    unSubscribeReason,
    onUnsubscribeResponse,
    getAllNewslettersLoading,
    undoUnsubscribe,
    onDesubscribePress,
    showToastType,
    alertVisible,
    setAlertVisible,
    toastMessage,
    buttonInToast,
    userData,
    internetFail,
    internetLoader,
    isInternetConnection,
    handleRetry,
    closeModal,
    guestToken,
    handlePress,
    visible,
    onClose
  } = useNewslettersViewModel();

  const styles = themeStyles(theme);
  const userEmail = (userData as { email?: string } | undefined)?.email;

  const renderNewsletters = (info: ListRenderItemInfo<Newsletter>) => (
    <NewsletterItem
      item={info}
      mySubscriptions={mySubscriptions}
      userNewslettersData={userNewslettersData ?? []}
      newsletterSubscribed={mySubscriptions ? newsletterNotSubscribed : newsletterSubscribed}
      onCheckBoxPress={(id) => {
        (mySubscriptions ? onSubscribedCheckBoxPress : onCheckBoxPress)(id);
      }}
      onUnCheckBoxPress={(id) => {
        (mySubscriptions ? onSubscribedUnCheckBoxPress : onUnCheckBoxPress)(id);
      }}
    />
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CustomHeader
        onPress={goBack}
        headerText={t('screens.newsletters.title')}
        headerTextWeight="Boo"
        headerTextStyles={styles.headerTextStyles}
        headerTextFontFamily={fonts.franklinGothicURW}
      />

      <View style={styles.toggleContainer}>
        <Pressable
          style={[
            styles.toggleButtonLeft,
            {
              backgroundColor: mySubscriptions ? undefined : theme.tabsBackgroundSelceted
            }
          ]}
          onPress={() => {
            toggleMySubscriptions(false);
          }}
        >
          <CustomText
            size={fontSize['xxs']}
            color={
              mySubscriptions ? theme.outlinedButtonAction : theme.toastAndAlertsTextBackground
            }
            weight={mySubscriptions ? 'Boo' : 'Med'}
            fontFamily={fonts.franklinGothicURW}
            textStyles={styles.subscriptionsText}
          >
            {t('screens.newsletters.text.subscriptions')}
          </CustomText>
        </Pressable>

        <Pressable
          style={[
            styles.toggleButtonRight,
            {
              backgroundColor: mySubscriptions ? theme.tabsBackgroundSelceted : undefined
            }
          ]}
          onPress={() => {
            toggleMySubscriptions(true);
          }}
        >
          <CustomText
            size={fontSize['xxs']}
            color={
              mySubscriptions ? theme.toastAndAlertsTextBackground : theme.outlinedButtonAction
            }
            weight={mySubscriptions ? 'Med' : 'Boo'}
            fontFamily={fonts.franklinGothicURW}
            textStyles={styles.subscriptionsText}
          >
            {t('screens.newsletters.text.mySubscriptions')}
          </CustomText>
        </Pressable>
      </View>
      <>
        {(() => {
          if (internetLoader) {
            return <ErrorScreen status="loading" />;
          }
          const hasConnectionIssue = !isInternetConnection || !internetFail;
          if (hasConnectionIssue) {
            return <ErrorScreen status="noInternet" onRetry={handleRetry} />;
          }
          const hasDataError =
            !flatlistData && (!getAllNewslettersLoading || !userNewslettersLoading);
          if (hasDataError) {
            return <ErrorScreen status="error" />;
          }

          return (
            <>
              {!flatlistData?.length && mySubscriptions ? (
                <NoSubscription />
              ) : (
                <>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    scrollEventThrottle={16}
                  >
                    <CustomHeading
                      isLogoVisible={false}
                      subHeadingText={
                        guestToken
                          ? t('screens.newsletters.text.notLoggedIn')
                          : `${t('screens.newsletters.text.subTitle')}${userEmail ?? ''}${t(
                              'screens.newsletters.text.youCanManageYourPreferences'
                            )}`
                      }
                      subHeadingFont={fonts.franklinGothicURW}
                      subHeadingWeight="Boo"
                      headingText={t('screens.newsletters.text.nPlusNewsletters')}
                      headingStyles={styles.headingStyles}
                    />

                    {changeSubscriptionLoading ||
                    getAllNewslettersLoading ||
                    userNewslettersLoading ||
                    unSubscribeLoading ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <NewsletterItemSkeleton key={index} />
                      ))
                    ) : (
                      <FlatList
                        data={flatlistData ?? []}
                        renderItem={renderNewsletters}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={{
                          ...styles.contentContainerStyle
                        }}
                        scrollEnabled={false}
                      />
                    )}
                  </ScrollView>
                </>
              )}
            </>
          );
        })()}
      </>
      {
        <View>
          {!mySubscriptions ? (
            <>
              <CustomButton
                onPress={() => onSubmit()}
                buttonText={t('screens.newsletters.text.subscribe')}
                buttonTextStyles={styles.buttonTextStyles}
                buttonStyles={styles.buttonStyles}
              />
              <ConsentFooter
                screenName={ANALYTICS_COLLECTION.MY_ACCOUNT}
                organisms={ANALYTICS_ORGANISMS.MY_ACCOUNT.DESUBSCRIBE}
                tipoContenido={
                  userData
                    ? `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`
                    : 'My account_Newsletters guest | suscription'
                }
              />
            </>
          ) : (
            (flatlistData ?? []).length > 0 && (
              <>
                <CustomButton
                  onPress={onDesubscribePress}
                  buttonText={t('screens.newsletters.text.unsubscribe')}
                  variant="outlined"
                  buttonTextColor={theme.toastAndAlertsTextLiveToast}
                  buttonStyles={styles.unSubscribeButtonStyle}
                  buttonTextStyles={styles.buttonTextStyles}
                  getTextColor={(pressed) => (pressed ? theme.highlightTextPrimary : undefined)}
                />

                <CustomButton
                  onPress={openModal}
                  buttonText={t('screens.newsletters.text.unsubscribeEverything')}
                  variant="text"
                  buttonTextColor={theme.titleForegroundInteractiveDefault}
                  buttonStyles={styles.unSubscribeEverything}
                  buttonTextStyles={styles.buttonTextStyles}
                />
              </>
            )
          )}
        </View>
      }

      <ModalView
        visible={isModalVisible}
        onRequestClose={closeModal}
        modalTitle={t('screens.newsletters.text.whyYouUnsubscribed')}
        checkBoxTopic={checkBoxTopic ?? []}
        checkBoxDataSelected={unSubscribeReason}
        onUnsubscribeResponsePress={onUnsubscribeResponsePress}
        onUnsubscribeResponse={onUnsubscribeResponse}
        onCancelPress={closeModal}
        onConfirmPress={onSubmit}
        screenName="Newsletter_Modal"
        tipoContenido={'My account_Newsletters | suscription'}
      />

      <CustomToast
        type={showToastType === 'success' ? 'success' : 'error'}
        message={toastMessage}
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        onButtonPress={undoUnsubscribe}
        buttonText={buttonInToast}
        toastContainerStyle={styles.toastContainerStyle}
      />

      <CustomModal
        visible={visible}
        modalTitle={t('screens.newsletters.text.manageYourSubscriptions')}
        modalMessage={t('screens.newsletters.text.loginToStartReadingArticles')}
        cancelButtonText={t('screens.splash.text.login')}
        confirmButtonText={t('screens.splash.text.signUp')}
        onCancelPress={() => handlePress(true)}
        onConfirmPress={() => handlePress(false)}
        onOutsidePress={onClose}
        onRequestClose={onClose}
      />
    </SafeAreaView>
  );
};

export default Newsletters;
