import React from 'react';
import { View, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeader from '@src/views/molecules/CustomHeader';
import { fonts } from '@src/config/fonts';
import { colors } from '@src/themes/colors';
import { fontSize } from '@src/config/styleConsts';
import CustomModal from '@src/views/organisms/CustomModal';
import CustomToast from '@src/views/molecules/CustomToast';
import { useSettingsViewModel } from '@src/viewModels/main/MyAccount/Settings/useSettingsViewModel';
import { themeStyles } from '@src/views/pages/main/MyAccount/Settings/styles';
import SettingsSection from '@src/views/pages/main/MyAccount/Settings/components/SettingsSection';
import CustomToggleGroup from '@src/views/pages/main/MyAccount/Settings/components/CustomToggleGroup';
import SettingsOption from '@src/views/pages/main/MyAccount/Settings/components/SettingsOption';
import { TextSize } from '@src/models/main/MyAccount/Settings';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import CustomLoader from '@src/views/molecules/CustomLoader';

/**
 * Settings is a screen that displays the application settings.
 *
 * It uses the {@link useSettingsViewModel} hook to manage the state of the settings.
 * The screen is divided into sections using the {@link SettingsSection} component.
 * Each section displays a setting, such as the theme, text size, and video auto play,
 * using the {@link ToggleGroup} or {@link TextSizeToggleGroup} components.
 *
 * The screen also includes a button to delete the account and a modal to confirm
 * clearing the cache.
 */

const Settings = () => {
  const {
    t,
    setTheme,
    textSize,
    setTextSize,
    videoAutoPlay,
    setVideoAutoPlay,
    theme,
    isModalVisible,
    setModalVisible,
    isImageDownloadEnabled,
    themeOptions,
    textSizeOptions,
    videoAutoPlayOptions,
    handlePress,
    lastCustomSize,
    goBack,
    handleNotification,
    alertVisible,
    setAlertVisible,
    selectedTheme,
    handleClearCache,
    handleToggleDownloadImages,
    getThemeAnalyticsData,
    getTextSizeAnalyticsData,
    getAutoplayAnalyticsData,
    isLoading
  } = useSettingsViewModel();

  const styles = themeStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onPress={goBack}
        headerText={t('screens.settings.text.configuration')}
        headerTextFontFamily={fonts.franklinGothicURW}
        headerTextWeight="Boo"
        headerTextStyles={styles.headerText}
      />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.appearanceContainer}>
          <SettingsSection
            title={t('screens.settings.text.systemAppearance')}
            subtitle={t('screens.settings.text.systemAppearanceDesc')}
          >
            <CustomToggleGroup<'light' | 'dark' | 'system'>
              options={themeOptions as Array<{ label: string; value: 'light' | 'dark' | 'system' }>}
              selected={selectedTheme}
              onChange={(value) => {
                const analyticsData = getThemeAnalyticsData(value);
                logSelectContentEvent({
                  idPage: ANALYTICS_PAGE.CONFIGURACION,
                  screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION,
                  screen_name: ANALYTICS_PAGE.CONFIGURACION,
                  Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION}`,
                  organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.APPEARANCE_OF_THE_SYSTEM,
                  content_type: analyticsData.molecule,
                  content_name: analyticsData.name,
                  content_action: ANALYTICS_ATOMS.TAP
                });
                setTheme(value);
              }}
              dividerHeight="50%"
            />
          </SettingsSection>
        </View>

        <View style={styles.textContainer}>
          <SettingsSection title={t('screens.settings.text.textSize')}>
            <View style={styles.settingOptionContainer}>
              <SettingsOption
                label={t('screens.settings.text.textSizeSystem')}
                description={t('screens.settings.text.textSizeSystemDesc')}
                isCustomSwitchVisible={true}
                value={textSize === 'System'}
                onToggle={() => {
                  logSelectContentEvent({
                    idPage: ANALYTICS_PAGE.CONFIGURACION,
                    screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION,
                    screen_name: ANALYTICS_PAGE.CONFIGURACION,
                    Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION}`,
                    organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.TEXT_SIZE,
                    content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.SYSTEM_SIZE,
                    content_name: 'System size',
                    content_action: ANALYTICS_ATOMS.TAP
                  });
                  if (textSize === 'System') {
                    setTextSize(lastCustomSize);
                  } else {
                    setTextSize('System');
                  }
                }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionContainer}>
              <SettingsSection
                title={t('screens.settings.text.setTypography')}
                subtitle={t('screens.settings.text.preferredTextSizeSubtitle')}
                titleFontSize={fontSize['s']}
                titleFontFamily={fonts.franklinGothicURW}
                titleFontWeight="Boo"
                subtitleFontFamily={fonts.franklinGothicURW}
                subtitleFontSize={fontSize['xxs']}
                subtitleFontWeight="Boo"
                subtitleTextStyle={styles.subtitleText}
              />
            </View>

            <CustomToggleGroup<TextSize>
              variant="textSize"
              options={textSizeOptions as Array<{ label: string; value: TextSize }>}
              selected={textSize}
              onChange={(value) => {
                const analyticsData = getTextSizeAnalyticsData(value);
                logSelectContentEvent({
                  idPage: ANALYTICS_PAGE.CONFIGURACION,
                  screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION,
                  screen_name: ANALYTICS_PAGE.CONFIGURACION,
                  Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION}`,
                  organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.TEXT_SIZE,
                  content_type: analyticsData.molecule,
                  content_name: analyticsData.name,
                  content_action: ANALYTICS_ATOMS.TAP
                });
                setTextSize(value);
              }}
              disabled={textSize === 'System'}
            />
          </SettingsSection>
        </View>

        <View style={styles.textContainer}>
          <SettingsSection
            title={t('screens.settings.text.dataUsage')}
            labelAction={t('screens.settings.text.clearCache')}
            onLabelPress={() => {
              logSelectContentEvent({
                idPage: ANALYTICS_PAGE.CONFIGURACION,
                screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION,
                screen_name: ANALYTICS_PAGE.CONFIGURACION,
                Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION}`,
                organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.DELETE_CACHE,
                content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_DELETE,
                content_name: 'Borrar cache',
                content_action: ANALYTICS_ATOMS.TAP
              });
              setModalVisible(true);
            }}
            showSeparator={true}
          >
            <View style={styles.settingOptionContainer}>
              <SettingsOption
                label={t('screens.settings.text.downloadImages')}
                description={t('screens.settings.text.downloadImagesDesc')}
                isCustomSwitchVisible={true}
                value={isImageDownloadEnabled}
                onToggle={handleToggleDownloadImages}
                descriptionStyles={styles.description}
              />
            </View>
          </SettingsSection>
        </View>

        <View style={styles.textContainer}>
          <SettingsSection
            title={t('screens.settings.text.autoPlay')}
            subtitle={t('screens.settings.text.autoPlayDesc')}
          >
            <CustomToggleGroup
              options={videoAutoPlayOptions}
              selected={videoAutoPlay}
              onChange={(value) => {
                const analyticsData = getAutoplayAnalyticsData(value);
                logSelectContentEvent({
                  idPage: ANALYTICS_PAGE.CONFIGURACION,
                  screen_page_web_url: ANALYTICS_PAGE.CONFIGURACION,
                  screen_name: ANALYTICS_PAGE.CONFIGURACION,
                  Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.CONFIGURACION}`,
                  organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.AUTOPLAY_VIDEOS,
                  content_type: analyticsData.molecule,
                  content_name: analyticsData.name,
                  content_action: ANALYTICS_ATOMS.TAP
                });
                setVideoAutoPlay(value);
              }}
              dividerHeight="100%"
            />
          </SettingsSection>
        </View>

        <View style={styles.textContainer}>
          <SettingsSection
            title={t('screens.settings.text.notifications')}
            labelAction={t('screens.settings.text.manage')}
            onLabelPress={handleNotification}
          >
            <SettingsOption
              description={t('screens.settings.text.notificationsDesc')}
              descriptionStyles={styles.descriptionStyles}
            />
          </SettingsSection>
        </View>

        <CustomButton
          variant="text"
          buttonStyles={styles.deleteAccountButton}
          buttonText={t('screens.settings.text.deleteAccount')}
          onPress={handlePress}
          buttonTextColor={colors.darkCharcoal}
          buttonTextSize={fontSize['s']}
          buttonTextWeight="Dem"
          buttonTextStyles={styles.deleteAccountButtonText}
          getTextColor={(pressed) =>
            pressed ? theme.adaptiveDangerSecondary : theme.titleForegroundInteractiveDefault
          }
        />
      </ScrollView>

      <CustomModal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        modalTitle={t('screens.settings.text.clearCacheModalTitle')}
        modalMessage={t('screens.settings.text.clearCacheModalMessage')}
        modalSubtitle={t('screens.settings.text.clearCacheModalSubtitle')}
        cancelButtonText={t('screens.settings.text.cancel')}
        confirmButtonText={t('screens.settings.text.clearCache')}
        onCancelPress={() => {
          logSelectContentEvent({
            screen_name: ANALYTICS_PAGE.BORRAR_CACHE,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.BORRAR_CACHE}`,
            organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET,
            content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.CANCELAR,
            content_name: 'Cancel',
            content_action: ANALYTICS_ATOMS.TAP
          });
          setModalVisible(false);
        }}
        onConfirmPress={handleClearCache}
        onOutsidePress={() => {
          logSelectContentEvent({
            screen_name: ANALYTICS_PAGE.BORRAR_CACHE,
            Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.BORRAR_CACHE}`,
            organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET,
            content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.EXIT,
            content_name: 'Exit',
            content_action: ANALYTICS_ATOMS.DISMISS_BUTTON
          });
          setModalVisible(false);
        }}
      />

      <CustomToast
        type="success"
        message={t('screens.settings.text.cacheClearedSuccessfully')}
        isVisible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
      />
      {isLoading && <CustomLoader />}
    </SafeAreaView>
  );
};

export default Settings;
