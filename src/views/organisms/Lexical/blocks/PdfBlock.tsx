import React, { memo, useCallback, useState } from 'react';
import { View, StyleSheet, Alert, Modal, Pressable } from 'react-native';

import { useTranslation } from 'react-i18next';

import { borderWidth, fontSize, radius, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { isIos } from '@src/utils/platformCheck';
import CustomWebView from '@src/views/atoms/CustomWebView';
import CustomText from '@src/views/atoms/CustomText';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { fonts } from '@src/config/fonts';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';
import { logSelectContentEvent, StoryData } from '@src/utils/storyAnalyticsHelpers';

interface PdfFileData {
  url?: string;
  title?: string;
  filename?: string;
}

interface PdfBlockProps {
  pdfFile?: PdfFileData;
  customTheme?: 'light' | 'dark';
  story?: StoryData | null;
  currentSlug?: string;
  slugHistory?: string[];
  collection?: string;
  page?: string;
}

/**
 * Reusable block to display a PDF using CustomWebView
 */

const PdfBlock = ({
  pdfFile,
  customTheme,
  story,
  currentSlug,
  slugHistory = [],
  collection,
  page
}: PdfBlockProps) => {
  const { t } = useTranslation();
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const [theme] = useTheme(customTheme);
  const styles = themeStyles(theme);

  const url = pdfFile?.url;
  const filename = pdfFile?.title;

  const openPdf = useCallback(() => {
    if (!url) {
      Alert.alert('Error', t('screens.lexical.text.pdfBlock.notAvailable'));
      return;
    }

    if (story && currentSlug) {
      const previousSlug =
        slugHistory.length > 1 ? slugHistory[slugHistory.length - 2] : 'undefined';
      logSelectContentEvent(story, {
        organism: ANALYTICS_ORGANISMS.STORY_PAGE.BODY,
        molecule: ANALYTICS_MOLECULES.STORY_PAGE.TEXT_BLOCK,
        contentName: filename || 'undefined',
        currentSlug: currentSlug || 'undefined',
        previousSlug,
        screenName: page || 'undefined',
        tipoContenido: collection && page ? `${collection}_${page}` : 'undefined',
        contentAction: ANALYTICS_ATOMS.DOWNLOAD_PDF
      });
    }

    const pdfUrl = isIos
      ? url
      : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

    setWebUrl(pdfUrl);
    setShowWebView(true);
  }, [url, t, story, currentSlug, slugHistory, filename]);

  if (!url) {
    return (
      <View style={styles.container}>
        <CustomText textStyles={styles.fallback}>
          {t('screens.lexical.text.pdfBlock.fallback')}
        </CustomText>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <CustomText size={fontSize.xs} color={theme.chipTextActive} textStyles={styles.filename}>
          {filename}
        </CustomText>

        <Pressable style={styles.btnContainer} onPress={openPdf}>
          <CustomText
            fontFamily={fonts.franklinGothicURW}
            weight={'Dem'}
            color={theme.primaryCTATextDefault}
            textStyles={styles.link}
          >
            {t('screens.lexical.text.pdfBlock.viewPdf')}
          </CustomText>
        </Pressable>
      </View>

      {showWebView && (
        <Modal
          visible={showWebView}
          animationType="slide"
          transparent
          onRequestClose={() => setShowWebView(false)}
        >
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            onClose={() => setShowWebView(false)}
            containerStyle={styles.webViewContainer}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Modal>
      )}
    </>
  );
};

export default memo(PdfBlock);

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingTop: actuatedNormalizeVertical(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.s),
      alignItems: 'center',
      borderWidth: borderWidth.m,
      borderRadius: radius.m,
      borderColor: theme.dividerGrey,
      marginTop: actuatedNormalizeVertical(spacing.m),
      paddingHorizontal: actuatedNormalize(spacing.m),
      backgroundColor: theme.mainBackgroundSecondary
    },
    btnContainer: {
      backgroundColor: theme.filledButtonPrimary,
      borderRadius: radius.m,
      alignItems: 'center',
      paddingVertical: actuatedNormalizeVertical(spacing.xs),
      paddingHorizontal: actuatedNormalize(spacing['4xl']),
      marginTop: actuatedNormalizeVertical(spacing.xs)
    },
    icon: {
      fontSize: fontSize.l
    },
    link: {
      fontSize: fontSize.s,
      top: isIos ? actuatedNormalizeVertical(1) : actuatedNormalizeVertical(0)
    },
    filename: {
      fontSize: fontSize.s,
      textAlign: 'center'
    },
    fallback: {
      fontSize: fontSize.s
    },
    webViewContainer: {
      flex: 1
    },
    webViewHeaderContainer: {
      marginLeft: actuatedNormalize(spacing.xs),
      color: theme.mainBackgroundDefault
    }
  });
