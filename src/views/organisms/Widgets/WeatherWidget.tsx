import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Image, ViewStyle, StyleProp } from 'react-native';

import { useTranslation } from 'react-i18next';
import { ApolloQueryResult, useQuery } from '@apollo/client';

import { DropletsIcon, WindIcon, WindSpeedIcon } from '@src/assets/icons';
import { fonts } from '@src/config/fonts';
import { borderWidth, fontSize, lineHeight, radius, spacing } from '@src/config/styleConsts';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme, darkTheme } from '@src/themes/theme';
import CustomText from '@src/views/atoms/CustomText';
import { PAGE_WIDGETS_QUERY, WEATHER_WIDGET_QUERY } from '@src/graphql/main/home/queries';
import WidgetSkeleton from '@src/views/organisms/Widgets/components/WidgetsSkeletonLoader';
import { getDayandWeeekdayFromDate } from '@src/utils/dateFormatter';

interface PageWidgetProps {
  page: string;
  registerRefetch: <T>(fn: () => Promise<ApolloQueryResult<T>>) => void;
  slug?: string;
  containerStyle?: StyleProp<ViewStyle>;
  sectionGapStyle?: StyleProp<ViewStyle>;
}

/**
 * WeatherWidget is a widget that displays the current weather and its forecast.
 * It receives the page prop which is used to fetch the data from the server.
 * It also receives the enabled prop which is used to determine whether the widget is enabled or not.
 * If the widget is enabled, it fetches the data from the server and displays the current weather and its forecast.
 * If the widget is not enabled, it displays nothing.
 *
 * @param {PageWidgetProps} props - The props received by the widget.
 * @returns {JSX.Element} - The JSX element to be rendered.
 */

const WeatherWidget = ({
  page,
  registerRefetch,
  slug,
  containerStyle,
  sectionGapStyle
}: PageWidgetProps) => {
  const [theme] = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const isDarkMode = theme === darkTheme;

  const { data } = useQuery(PAGE_WIDGETS_QUERY, {
    variables: { page, slug },
    fetchPolicy: 'cache-first'
  });

  const weatherWidgetEnabled = data?.PageWidgets?.weatherWidget?.enabled;

  const city = data?.PageWidgets?.weatherWidget?.location?.city;

  const {
    data: weatherData,
    loading: weatherLoading,
    refetch
  } = useQuery(WEATHER_WIDGET_QUERY, {
    variables: { city },
    fetchPolicy: 'cache-first',
    skip: !weatherWidgetEnabled || !city
  });

  const location = weatherData?.getCurrentWeather?.location;
  const aqiText = weatherData?.getCurrentWeather?.air_quality?.usEpaIndex;
  let aqiColorBackground = '#24B354';
  let aqiColor = '#08253F';

  if (aqiText == 'Aceptable') {
    aqiColorBackground = '#FCFF33';
  }

  if (aqiText == 'Mala') {
    aqiColorBackground = '#FF9633';
  }

  if (aqiText == 'Muy mala') {
    aqiColorBackground = '#D33038';
    aqiColor = '#FFFFFF';
  }

  if (aqiText == 'Extremadamente mala') {
    aqiColorBackground = '#8C00E7';
    aqiColor = '#FFFFFF';
  }

  useEffect(() => {
    if (registerRefetch) {
      registerRefetch(refetch);
    }
  }, [registerRefetch, refetch]);

  if (weatherLoading) {
    return <WidgetSkeleton />;
  }

  if (!weatherData) return null;

  if (!weatherWidgetEnabled) {
    return null;
  }

  return (
    <View style={sectionGapStyle}>
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        <View style={styles.topWrapper}>
          <CustomText
            fontFamily={fonts.notoSerifExtraCondensed}
            weight="B"
            size={fontSize.xs}
            textStyles={styles.location}
          >
            {location?.name}, {location?.country}
          </CustomText>
          <CustomText
            fontFamily={fonts.franklinGothicURW}
            weight="Dem"
            size={fontSize.xxs}
            textStyles={styles.day}
          >
            {getDayandWeeekdayFromDate(location?.localtime)}
          </CustomText>
        </View>

        <View style={styles.middleWrapper}>
          <View style={styles.tempWrapper}>
            <CustomText textStyles={styles.temp} fontFamily={fonts.mongoose} size={50} weight="M">
              {Math.round(weatherData?.getCurrentWeather?.temp_c)}
            </CustomText>
            <View style={styles.degree} />
          </View>

          <View style={styles.vSeparator} />

          <View style={styles.middCenter}>
            <Image
              source={{ uri: 'https:' + weatherData?.getCurrentWeather?.condition?.icon }}
              style={styles.icon}
            />
          </View>

          <View style={styles.middRight}>
            <CustomText
              textStyles={styles.condition}
              size={fontSize.xxs}
              fontFamily={fonts.franklinGothicURW}
              weight="Dem"
            >
              {weatherData?.getCurrentWeather?.condition?.text}
            </CustomText>

            <View style={styles.minMaxWrapper}>
              <CustomText
                fontFamily={fonts.franklinGothicURW}
                weight="Dem"
                size={fontSize.xxs}
                textStyles={styles.minmax}
              >
                {t('screens.weatherWidget.max')}{' '}
              </CustomText>
              <CustomText
                fontFamily={fonts.franklinGothicURW}
                weight="Boo"
                size={fontSize.xxs}
                textStyles={styles.minmax}
              >
                {Math.round(weatherData?.getCurrentWeather?.maxtemp_c)}
                {t('screens.weatherWidget.degrees')}
              </CustomText>
              <CustomText
                weight="Dem"
                size={fontSize.xxs}
                textStyles={styles.minmax}
                fontFamily={fonts.franklinGothicURW}
              >
                {' '}
                {t('screens.weatherWidget.min')}{' '}
              </CustomText>
              <CustomText
                weight="Boo"
                size={fontSize.xxs}
                textStyles={styles.minmax}
                fontFamily={fonts.franklinGothicURW}
              >
                {Math.round(weatherData?.getCurrentWeather?.mintemp_c)}
                {t('screens.weatherWidget.degrees')}
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.bottomWrapper}>
          <View style={styles.iconRow}>
            {isDarkMode ? <WindSpeedIcon /> : <WindIcon />}
            <CustomText
              weight="Dem"
              size={fontSize.xxs}
              fontFamily={fonts.franklinGothicURW}
              textStyles={styles.minmax}
            >
              {weatherData?.getCurrentWeather?.wind_kph} {t('screens.weatherWidget.windSpeed')}
            </CustomText>
          </View>

          <View style={styles.iconRow}>
            <DropletsIcon strokeColor={theme.specificSectionBackgroundSurface3} />
            <CustomText
              weight="Dem"
              size={fontSize.xxs}
              fontFamily={fonts.franklinGothicURW}
              textStyles={styles.minmax}
            >
              {weatherData?.getCurrentWeather?.humidity}%
            </CustomText>
          </View>

          <View style={[styles.aqiChip, { backgroundColor: aqiColorBackground }]}>
            <CustomText
              textStyles={styles.aqiChipText}
              size={fontSize.xxxs}
              fontFamily={fonts.franklinGothicURW}
              weight="Dem"
              color={aqiColor}
            >
              {weatherData?.getCurrentWeather?.air_quality?.pm2_5?.toFixed(0)}
              {' - '}
              {aqiText}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WeatherWidget;

export const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.widgetBackground,
      marginHorizontal: spacing.xs,
      borderWidth: borderWidth.ss,
      borderColor: theme.neutralBackground,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
      flexDirection: 'column',
      flex: 1,
      gap: spacing.xs
    },
    topWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    location: {
      lineHeight: lineHeight.s,
      color: theme.specificSectionBackgroundSurface3
    },
    day: {
      color: theme.specificSectionBackgroundSurface3,
      lineHeight: lineHeight.xs,
      textTransform: 'capitalize'
    },
    middleWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.ss
    },
    tempWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      top: spacing.xxxs
    },
    temp: {
      color: theme.specificSectionBackgroundSurface3,
      lineHeight: 50,
      alignSelf: 'center'
    },
    degree: {
      borderWidth: borderWidth.m,
      width: 4,
      height: 4,
      borderRadius: radius.xxs,
      marginTop: spacing.xxxs,
      borderColor: theme.specificSectionBackgroundSurface3
    },
    vSeparator: {
      width: borderWidth.m,
      height: '100%',
      backgroundColor: theme.dividerPrimary
    },
    middCenter: {
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    icon: {
      width: 40,
      height: 40
    },
    middRight: {
      alignItems: 'flex-start',
      gap: spacing.xxxxs
    },
    condition: {
      lineHeight: lineHeight.xs,
      color: theme.specificSectionBackgroundSurface3
    },
    minMaxWrapper: {
      justifyContent: 'center',
      flexDirection: 'row'
    },
    minmax: {
      color: theme.specificSectionBackgroundSurface3,
      lineHeight: lineHeight.xs
    },
    bottomWrapper: {
      flexDirection: 'row',
      gap: spacing.s,
      justifyContent: 'center'
    },
    aqiChip: {
      paddingHorizontal: spacing.ss,
      paddingVertical: spacing.xxxs,
      borderRadius: radius['2xl'],
      alignItems: 'center'
    },
    aqiChipText: {
      lineHeight: lineHeight.xxs,
      top: 1
    },
    iconRow: {
      flexDirection: 'row',
      gap: spacing.xxxs,
      alignItems: 'center'
    }
  });
