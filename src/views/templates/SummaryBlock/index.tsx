import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useTheme } from '@src/hooks/useTheme';
import { themeStyles } from '@src/views/templates/SummaryBlock/styles';
import { fontSize } from '@src/config/styleConsts';
import { fonts } from '@src/config/fonts';
import CustomHeading from '@src/views/molecules/CustomHeading';

interface SummaryBlockProps {
  title?: string;
  summaryText: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  customTheme?: 'light' | 'dark';
}

const SummaryBlock: React.FC<SummaryBlockProps> = ({
  title,
  summaryText,
  contentContainerStyle,
  customTheme
}) => {
  const [theme] = useTheme(customTheme);
  const { t } = useTranslation();
  const styles = themeStyles(theme);

  if (!summaryText) return null;

  return (
    <View style={StyleSheet.flatten([styles.summaryContainer, contentContainerStyle])}>
      <CustomHeading
        headingText={title ?? t('screens.storyPage.summary.title')}
        headingSize={fontSize['2xl']}
        headingFont={fonts.notoSerifExtraCondensed}
        headingStyles={styles.summarheading}
        headingColor={theme.newsTextTitlePrincipal}
        subHeadingText={summaryText}
        subHeadingSize={fontSize.xs}
        subHeadingWeight="R"
        subHeadingFont={fonts.notoSerif}
        subHeadingColor={theme.newsTextTitlePrincipal}
        subHeadingStyles={styles.summarySubHeading}
        customTheme={customTheme}
      />
    </View>
  );
};

export default SummaryBlock;
