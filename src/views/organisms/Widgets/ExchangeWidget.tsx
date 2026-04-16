import React, { useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, StyleProp, ViewStyle } from 'react-native';

import { ApolloQueryResult, useQuery } from '@apollo/client';

import { AppTheme } from '@src/themes/theme';
import { useTheme } from '@src/hooks/useTheme';
import { borderWidth, fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import { fonts } from '@src/config/fonts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { EXCHANGE_RATE_WIDGET_QUERY, PAGE_WIDGETS_QUERY } from '@src/graphql/main/home/queries';

const ROW_HEIGHT = actuatedNormalizeVertical(29);
const PAUSE_DURATION = 5000;
const SLIDE_DURATION = 2000;

interface PageWidgetProps {
  page: string;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  containerStyle?: StyleProp<ViewStyle>;
  sectionGapStyle?: StyleProp<ViewStyle>;
  slug?: string;
  onVisibilityChange?: (visible: boolean) => void;
}

interface ExchangeRateItem {
  baseCode: string;
  targetCode: string;
  currentRate: number;
  percentageChange: number;
}

/**
 * Renders a widget that displays exchange rates for two currencies.
 *
 * The widget will auto-scroll every 5 seconds with a slide animation.
 *
 * The widget will register a refetch function to the parent component.
 *
 * @param {{ page: string, registerRefetch: (fn: () => Promise<ApolloQueryResult<T>>) => void }}
 * @returns {JSX.Element} The rendered widget.
 */

const ExchangeWidget = ({
  page,
  registerRefetch,
  slug,
  onVisibilityChange,
  sectionGapStyle
}: PageWidgetProps) => {
  const { data, refetch } = useQuery(PAGE_WIDGETS_QUERY, {
    variables: { page, slug },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network'
  });

  const { data: exchangeData } = useQuery(EXCHANGE_RATE_WIDGET_QUERY, {
    fetchPolicy: 'cache-first'
  });

  useEffect(() => {
    if (registerRefetch) {
      registerRefetch(refetch);
    }
  }, [registerRefetch, refetch]);

  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const translateY = useRef(new Animated.Value(0)).current;

  const isExchangeWidgetEnabled = data?.PageWidgets?.exchangeRateWidget?.appEnabled;
  const exchangeRates = exchangeData?.getExchangeRate ?? [];

  const rowsData = useMemo(() => {
    if (exchangeRates.length < 4) return [];
    const rows = [exchangeRates.slice(0, 2), exchangeRates.slice(2, 4)];
    return [...rows, rows[0]];
  }, [exchangeRates]);

  useEffect(() => {
    if (rowsData.length < 3) return;

    let index = 0;
    const animate = () => {
      Animated.sequence([
        Animated.delay(PAUSE_DURATION),
        Animated.timing(translateY, {
          toValue: -(index + 1) * ROW_HEIGHT,
          duration: SLIDE_DURATION,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ]).start(() => {
        index += 1;
        if (index === 2) {
          translateY.setValue(0);
          index = 0;
        }
        animate();
      });
    };

    animate();
  }, [rowsData, translateY]);

  const isVisible = !!isExchangeWidgetEnabled && rowsData.length > 0;

  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  if (!isExchangeWidgetEnabled || rowsData.length === 0) {
    return null;
  }

  return (
    <View style={sectionGapStyle}>
      <View style={styles.container}>
        <View style={styles.mask}>
          <Animated.View style={{ transform: [{ translateY }] }}>
            {rowsData.map((rowItems, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {rowItems.map((item: ExchangeRateItem) => {
                  const isUp = item.percentageChange > 0;
                  const color = isUp ? theme.toastAndAlertsTextSuccess : theme.filledButtonPrimary;

                  return (
                    <View key={item.baseCode} style={styles.tickerItem}>
                      <CustomText
                        fontFamily={fonts.notoSerifExtraCondensed}
                        size={fontSize.xs}
                        style={styles.label}
                      >
                        {item.baseCode}/{item.targetCode}
                      </CustomText>

                      <CustomText
                        fontFamily={fonts.franklinGothicURW}
                        size={fontSize.xs}
                        weight="Boo"
                        style={styles.value}
                      >
                        {item.currentRate.toFixed(4)}
                      </CustomText>

                      <CustomText
                        fontFamily={fonts.franklinGothicURW}
                        size={fontSize.xs}
                        weight="Med"
                        style={[styles.percent, { color }]}
                      >
                        {isUp ? '+' : ''}
                        {item.percentageChange}%
                      </CustomText>
                    </View>
                  );
                })}
              </View>
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default ExchangeWidget;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      height: ROW_HEIGHT,
      borderTopColor: theme.dividerGrey,
      borderTopWidth: borderWidth.m,
      borderBottomWidth: borderWidth.m,
      borderBottomColor: theme.dividerGrey,
      justifyContent: 'center'
    },
    mask: {
      height: ROW_HEIGHT,
      overflow: 'hidden'
    },
    row: {
      height: ROW_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: actuatedNormalize(spacing.xx)
    },
    tickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: actuatedNormalize(spacing.xxxs)
    },
    label: {
      color: theme.newsTextPictureCarouselTitle,
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    value: {
      color: theme.bodyTextSecondary,
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    percent: {
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    }
  });
