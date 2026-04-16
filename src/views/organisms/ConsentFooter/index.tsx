import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Modal, Animated } from 'react-native';

import { useTranslation } from 'react-i18next';

import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import CustomWebView from '@src/views/atoms/CustomWebView';
import CustomButton from '@src/views/molecules/CustomButton';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import {
  PRIVACY_POLICY_URL,
  TERMS_CONDITIONS_URL
} from '@src/views/pages/main/MyAccount/MyAccount/config/socialLinks';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

/**
 * ConsentFooter is a React functional component that renders a footer with
 * terms and conditions and a link to the privacy policy.
 *
 * The component displays a text that the user is accepting the terms and
 * conditions and the privacy policy by continuing. The text is customizable
 * using the i18next translation system.
 *
 * The component also renders a link to the terms and conditions and the
 * privacy policy. The links are customizable using the i18next translation
 * system.
 *
 * When the user presses a link, the component opens a web view with the
 * corresponding URL.
 *
 * @returns {JSX.Element} A footer component with terms and conditions and a
 * link to the privacy policy.
 */

interface ConsentFooterProps {
  screenName?: string;
  tipoContenido?: string;
  organisms?: string;
}

const ConsentFooter: React.FC<ConsentFooterProps> = ({
  screenName = 'Create account',
  tipoContenido = 'Onboarding_Create account',
  organisms
}) => {
  const { t } = useTranslation();
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const openWebViewWithUrl = (url: string, buttonType: 'terms' | 'privacy') => {
    logSelectContentEvent({
      screen_name: screenName,
      Tipo_Contenido: tipoContenido,
      organisms: organisms || ANALYTICS_ORGANISMS.ONBOARDING.LEGALS,
      content_type:
        buttonType === 'terms'
          ? ANALYTICS_MOLECULES.ONBOARDING.TERMINOS_Y_CONDICIONES
          : ANALYTICS_MOLECULES.ONBOARDING.AVISO_DE_PRIVACIDAD,
      content_name: buttonType === 'terms' ? 'Terms and conditions' : 'Privacy notice',
      content_action: ANALYTICS_ATOMS.TAP
    });

    setWebUrl(url);
    setShowWebView(true);
  };

  const slideAnim = useMemo(() => new Animated.Value(1000), []);

  useEffect(() => {
    if (showWebView) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      slideAnim.setValue(1000);
    }
  }, [showWebView, slideAnim]);

  if (showWebView) {
    return (
      <Modal
        visible={showWebView}
        animationType="fade"
        transparent
        onRequestClose={() => setShowWebView(false)}
      >
        <Animated.View style={[styles.containerStyle, { transform: [{ translateY: slideAnim }] }]}>
          <CustomWebView
            uri={webUrl}
            isVisible={true}
            containerStyle={styles.webViewContainer}
            onClose={() => setShowWebView(false)}
            headerContainerStyle={styles.webViewHeaderContainer}
          />
        </Animated.View>
      </Modal>
    );
  }

  return (
    <View style={styles.footerContainer}>
      <CustomText
        size={fontSize['xxs']}
        weight="Boo"
        fontFamily={fonts.franklinGothicURW}
        textStyles={styles.descriptionText}
      >
        {t('screens.notificationAlert.text.byContinuingYouAreAcceptingOur')}
      </CustomText>

      <View style={styles.tAndCContainer}>
        <CustomButton
          variant="link"
          buttonText={t('screens.notificationAlert.text.terms&Conditions')}
          onPress={() => openWebViewWithUrl(TERMS_CONDITIONS_URL, 'terms')}
          buttonTextSize={fontSize['xxs']}
          buttonTextWeight="Boo"
          getTextColor={(pressed) =>
            pressed ? theme.textAccentSecondary : theme.bodyTextHyperlinked
          }
        />

        <CustomText size={fontSize['xxs']} weight="Boo" fontFamily={fonts.franklinGothicURW}>
          {t('screens.notificationAlert.text.asWellAsThe')}
        </CustomText>

        <CustomButton
          variant="text"
          buttonText={t('screens.notificationAlert.text.privacyPolicy')}
          onPress={() => openWebViewWithUrl(PRIVACY_POLICY_URL, 'privacy')}
          buttonTextColor={theme.bodyTextHyperlinked}
          buttonTextSize={fontSize['xxs']}
          buttonTextWeight="Boo"
          buttonTextStyles={styles.linkText}
          getTextColor={(pressed) =>
            pressed ? theme.textAccentSecondary : theme.bodyTextHyperlinked
          }
        />
      </View>
    </View>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    footerContainer: {
      alignSelf: 'stretch',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    descriptionText: {
      textAlign: 'center',
      lineHeight: actuatedNormalizeVertical(lineHeight['m'])
    },
    tAndCContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%'
    },
    linkText: {
      color: theme.bodyTextHyperlinked,
      textDecorationLine: 'underline',
      top: actuatedNormalizeVertical(3)
    },
    linkWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    linkChar: {
      color: theme.bodyTextHyperlinked
    },
    underline: {
      textDecorationLine: 'underline'
    },
    noUnderline: {
      textDecorationLine: 'none'
    },
    webViewContainer: {
      flex: 1
    },
    webViewWrapper: {
      flex: 1,
      ...StyleSheet.absoluteFillObject
    },
    webViewHeaderContainer: {
      paddingLeft: actuatedNormalize(spacing['xl']),
      backgroundColor: theme.mainBackgroundDefault
    },
    containerStyle: {
      flex: 1
    }
  });

export default ConsentFooter;
