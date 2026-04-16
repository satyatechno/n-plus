import React, { useMemo } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@src/hooks/useTheme';
import CustomHeader from '@src/views/molecules/CustomHeader';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { UnreadMailIcon } from '@src/assets/icons';
import { themeStyles } from '@src/views/pages/main/MyAccount/ContactUs/styles';
import { fonts } from '@src/config/fonts';
import CustomDivider from '@src/views/atoms/CustomDivider';
import CustomButton from '@src/views/molecules/CustomButton';
import { fontSize } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import { useContactUsViewModel } from '@src/viewModels/main/MyAccount/MyAccount/useContactUsViewModel';

/**
 * ContactUs is a screen that displays contact information for the company.
 * It allows the user to send an email to the company.
 */

const ContactUs = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const { goBack, handleContactPress } = useContactUsViewModel();

  return (
    <SafeAreaView style={styles.fullContainer}>
      <View style={styles.headerWrapper}>
        <CustomHeader
          headerText={t('screens.contactUs.title')}
          onPress={goBack}
          headerTextFontFamily={fonts.franklinGothicURW}
          headerTextWeight="Boo"
          headerTextStyles={styles.headerText}
        />
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.contentCard}>
          <View style={styles.primaryHeadingWrapper}>
            <CustomHeading
              headingText={t('screens.contactUs.heading')}
              subHeadingText={t('screens.contactUs.subheading')}
              headingColor={theme.sectionTextTitleSpecial}
              headingStyles={styles.primaryHeading}
              subHeadingColor={theme.subtitleTextSubtitle}
              subHeadingStyles={styles.primarySubheading}
              isLogoVisible={false}
              subHeadingFont={fonts.franklinGothicURW}
            />

            <CustomDivider style={styles.divider} />
          </View>

          <View style={styles.iconWrapper}>
            <UnreadMailIcon />
          </View>

          <CustomText
            weight="Boo"
            fontFamily={fonts.franklinGothicURW}
            color={theme.labelsTextLabelName}
            size={fontSize['xs']}
            textStyles={styles.secondaryHeading}
          >
            {t('screens.contactUs.emailTitle')}
          </CustomText>

          <CustomButton
            buttonTextFontFamily={fonts.franklinGothicURW}
            underlineColor={theme.carouselTextOther}
            variant="text"
            buttonText={t('screens.contactUs.email')}
            onPress={handleContactPress}
            buttonTextSize={fontSize['xs']}
            buttonTextColor=""
            buttonTextWeight="Med"
            style={styles.contactUsButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ContactUs;
