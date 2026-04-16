import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ApolloQueryResult, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { PAGE_WIDGETS_QUERY } from '@src/graphql/main/home/queries';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { formatEventDate, getDayFromDate } from '@src/utils/dateFormatter';
import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import WidgetSkeleton from '@src/views/organisms/Widgets/components/WidgetsSkeletonLoader';
import CustomWebView from '@src/views/atoms/CustomWebView';

interface PageWidgetProps {
  page: string;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  containerStyle?: StyleProp<ViewStyle>;
  sectionGapStyle?: StyleProp<ViewStyle>;
  slug?: string;
}

/**
 * CountdownTimerWidget is a widget that displays a countdown timer for an event.
 * It receives the page prop which is used to fetch the data from the server.
 * It also receives the enabled prop which is used to determine whether the widget is enabled or not.
 * If the widget is enabled, it fetches the data from the server and displays the countdown timer.
 * If the widget is not enabled, it displays nothing.
 *
 * @param {PageWidgetProps} props - The props received by the widget.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */

const CountdownTimerWidget = ({
  page,
  registerRefetch,
  containerStyle,
  sectionGapStyle,
  slug
}: PageWidgetProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const { t } = useTranslation();
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>('');

  const { data, loading, refetch } = useQuery(PAGE_WIDGETS_QUERY, {
    variables: { page, slug },
    fetchPolicy: 'cache-first'
  });

  useEffect(() => {
    if (registerRefetch) {
      registerRefetch(refetch);
    }
  }, [registerRefetch, refetch]);

  const countdownTimer = data?.PageWidgets?.countdownTimer;
  const url = countdownTimer?.redirectUrl;

  useEffect(() => {
    if (!countdownTimer?.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(countdownTimer.endDate).getTime();
      const difference = end - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownTimer?.endDate]);

  if (loading) {
    return <WidgetSkeleton />;
  }

  if (!countdownTimer) {
    return null;
  }

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const handleRedirectToWidget = () => {
    setWebUrl(url);
    setShowWebView(true);
  };

  const handleWebViewClose = () => {
    setShowWebView(false);
    setWebUrl('');
  };

  return (
    <View style={sectionGapStyle}>
      <Pressable
        style={StyleSheet.flatten([styles.container, containerStyle])}
        onPress={handleRedirectToWidget}
      >
        <View style={styles.leftSection}>
          <CustomText
            textStyles={styles.title}
            fontFamily={fonts.notoSerifExtraCondensed}
            size={fontSize.xs}
          >
            {countdownTimer.title}
          </CustomText>

          <View style={styles.dateContainer}>
            <CustomText
              fontFamily={fonts.franklinGothicURW}
              size={fontSize.xxs}
              weight="Med"
              textStyles={styles.description}
            >
              {countdownTimer.description}
            </CustomText>

            <CustomText fontFamily={fonts.franklinGothicURW} size={fontSize.xxs} weight="Med">
              {getDayFromDate(countdownTimer.eventDate)},{' '}
              {formatEventDate(countdownTimer.eventDate)}
            </CustomText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.timerWrapper}>
          <View style={styles.unit}>
            <CustomText
              size={fontSize.xxs}
              fontFamily={fonts.franklinGothicURW}
              weight="Med"
              textStyles={styles.days}
            >
              {t('screens.countDownTimerWidget.text.days')}
            </CustomText>

            <CustomText
              size={fontSize.xl}
              fontFamily={fonts.franklinGothicURW}
              weight="Med"
              textStyles={styles.daysStyles}
            >
              {formatTime(timeLeft.days)}
            </CustomText>
          </View>

          <View style={styles.timer}>
            <View style={styles.unit}>
              <CustomText
                size={fontSize.xxs}
                fontFamily={fonts.franklinGothicURW}
                weight="Boo"
                textStyles={styles.hours}
              >
                {t('screens.countDownTimerWidget.text.hours')}
              </CustomText>

              <CustomText
                fontFamily={fonts.franklinGothicURW}
                size={fontSize['2xl']}
                weight="Boo"
                textStyles={styles.hourStyles}
              >
                {formatTime(timeLeft.hours)}:
              </CustomText>
            </View>

            <View style={styles.unit}>
              <CustomText
                size={fontSize.xxs}
                fontFamily={fonts.franklinGothicURW}
                weight="Boo"
                textStyles={styles.hours}
              >
                {t('screens.countDownTimerWidget.text.minutes')}
              </CustomText>
              <CustomText
                fontFamily={fonts.franklinGothicURW}
                size={fontSize['2xl']}
                weight="Boo"
                textStyles={styles.hourStyles}
              >
                {formatTime(timeLeft.minutes)}:
              </CustomText>
            </View>

            <View style={styles.unit}>
              <CustomText
                size={fontSize.xxs}
                fontFamily={fonts.franklinGothicURW}
                weight="Boo"
                textStyles={styles.hours}
              >
                {t('screens.countDownTimerWidget.text.seconds')}
              </CustomText>
              <CustomText
                fontFamily={fonts.franklinGothicURW}
                size={fontSize['2xl']}
                weight="Boo"
                textStyles={styles.hourStyles}
              >
                {formatTime(timeLeft.seconds)}
              </CustomText>
            </View>
          </View>
        </View>

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
      </Pressable>
    </View>
  );
};

export default CountdownTimerWidget;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.widgetBackground,
      flexDirection: 'row',
      marginHorizontal: actuatedNormalize(spacing.xs),
      borderWidth: borderWidth.m,
      borderColor: theme.neutralBackground,
      paddingHorizontal: actuatedNormalize(spacing.xs),
      paddingVertical: actuatedNormalizeVertical(spacing.xxs)
    },
    title: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    divider: {
      width: 1,
      height: actuatedNormalizeVertical(spacing['3xl']),
      backgroundColor: theme.dividerPrimary,
      alignSelf: 'center',
      marginRight: actuatedNormalize(spacing.s),
      top: actuatedNormalizeVertical(spacing.xxxs)
    },
    section: {
      flex: 1
    },
    description: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m)
    },
    dateContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    timerWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      gap: actuatedNormalize(spacing.xxs),
      minWidth: actuatedNormalize(140),
      flexShrink: 0,
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    unit: {
      alignItems: 'center'
    },
    days: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m)
    },
    daysStyles: {
      lineHeight: actuatedNormalizeVertical(lineHeight['4xl']),
      top: actuatedNormalizeVertical(spacing.xxxs)
    },
    hours: {
      lineHeight: actuatedNormalizeVertical(lineHeight.m),
      color: theme.dividerAdaptive
    },
    hourStyles: {
      lineHeight: lineHeight['4xl'],
      color: theme.dividerAdaptive,
      top: actuatedNormalizeVertical(spacing.xxxs)
    },
    timer: {
      flexDirection: 'row'
    },
    leftSection: {
      flex: 1
    },
    webViewContainer: {
      flex: 1,
      backgroundColor: theme.mainBackgroundDefault
    },
    webViewHeaderContainer: {
      backgroundColor: theme.mainBackgroundDefault,
      marginLeft: actuatedNormalize(spacing.xs)
    }
  });
