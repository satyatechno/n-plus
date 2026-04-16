import React from 'react';
import { View, Pressable, Linking } from 'react-native';

import { useTranslation } from 'react-i18next';

import { fonts } from '@src/config/fonts';
import CustomText from '@src/views/atoms/CustomText';
import CustomDivider from '@src/views/atoms/CustomDivider';
import { fontSize, spacing } from '@src/config/styleConsts';
import { actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { useTheme } from '@src/hooks/useTheme';
import { ArrowForwardIcon } from '@src/assets/icons';

interface OptionItem {
  label: string;
  icon: React.FC<{ color?: string }>;
  actionType: string;
  target: string;
}

interface SocialIconItem {
  icon: React.FC<{ color: string }>;
  link: string;
}

interface Props {
  isLoggedIn: boolean;
  filteredOptions: OptionItem[];
  secondaryOptions: OptionItem[];
  socialIcons: SocialIconItem[];
  handleOptionPress: (actionType: string, target: string) => void;
  handleSocialPress?: (link: string) => void;
  styles: ReturnType<typeof import('../styles').themeStyles>;
}

const MyAccountOptionsSection = ({
  isLoggedIn,
  filteredOptions,
  secondaryOptions,
  socialIcons,
  handleOptionPress,
  handleSocialPress,
  styles
}: Props) => {
  const { t } = useTranslation();
  const [theme] = useTheme();

  return (
    <>
      <View>
        {isLoggedIn ? (
          <>
            {filteredOptions.slice(0, 2).map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleOptionPress(item.actionType, item.target)}
                style={[
                  styles.optionWrapper,
                  {
                    marginBottom:
                      index === 0
                        ? actuatedNormalizeVertical(spacing['xs'])
                        : actuatedNormalizeVertical(spacing['m'])
                  }
                ]}
              >
                <View style={styles.iconWrapper}>
                  <item.icon color={theme.greyButtonSecondaryOutline} />
                </View>
                <View style={styles.labelWrapper}>
                  <CustomText
                    size={fontSize['xs']}
                    weight="Boo"
                    fontFamily={fonts.franklinGothicURW}
                    textStyles={styles.label}
                  >
                    {item.label}
                  </CustomText>
                  <View style={styles.arrowWrapper}>
                    <ArrowForwardIcon color={theme.greyButtonSecondaryOutline} />
                  </View>
                </View>
              </Pressable>
            ))}

            <CustomDivider style={styles.dividerAfterTwo} />

            {filteredOptions.slice(2).map((item, index) => (
              <Pressable
                key={index + 2}
                onPress={() => handleOptionPress(item.actionType, item.target)}
                style={styles.optionWrapper}
              >
                <View style={styles.iconWrapper}>
                  <item.icon color={theme.greyButtonSecondaryOutline} />
                </View>
                <View style={styles.labelWrapper}>
                  <CustomText
                    size={fontSize['xs']}
                    weight="Boo"
                    fontFamily={fonts.franklinGothicURW}
                    textStyles={styles.label}
                  >
                    {item.label}
                  </CustomText>
                  <View style={styles.arrowWrapper}>
                    <ArrowForwardIcon color={theme.greyButtonSecondaryOutline} />
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        ) : (
          <>
            <CustomDivider style={styles.dividerAfterHeading} />

            {filteredOptions.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleOptionPress(item.actionType, item.target)}
                style={styles.optionWrapper}
              >
                <View style={styles.iconWrapper}>
                  <item.icon color={theme.greyButtonSecondaryOutline} />
                </View>
                <View style={styles.labelWrapper}>
                  <CustomText
                    size={fontSize['xs']}
                    weight="Boo"
                    fontFamily={fonts.franklinGothicURW}
                    textStyles={styles.label}
                  >
                    {item.label}
                  </CustomText>
                  <View style={styles.arrowWrapper}>
                    <ArrowForwardIcon color={theme.greyButtonSecondaryOutline} />
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        )}
      </View>

      <CustomDivider style={styles.endingDivider} />

      <View style={styles.socialIconContainer}>
        <CustomText weight="Dem" fontFamily={fonts.franklinGothicURW} textStyles={styles.followUs}>
          {t('screens.myAccount.followUs')}
        </CustomText>

        <View style={styles.socialRow}>
          {socialIcons.map(({ icon: Icon, link }, index) => (
            <Pressable
              key={index}
              style={styles.iconOnly}
              onPress={() => {
                Linking.openURL(link);
                handleSocialPress?.(link);
              }}
            >
              <Icon color={theme.greyButtonSecondaryOutline} />
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        {secondaryOptions.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => handleOptionPress(item.actionType, item.target)}
            style={styles.optionWrapper}
          >
            <View style={styles.iconWrapper}>
              <item.icon color={theme.greyButtonSecondaryOutline} />
            </View>
            <View style={styles.labelWrapper}>
              <CustomText
                size={fontSize['xs']}
                weight="Boo"
                fontFamily={fonts.franklinGothicURW}
                textStyles={styles.label}
              >
                {item.label}
              </CustomText>
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
};

export default MyAccountOptionsSection;
