import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import CustomButton from '@src/views/molecules/CustomButton';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { useTheme } from '@src/hooks/useTheme';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';
import { themeStyles } from '@src/views/templates/auth/SuccessScreen/styles';

interface SuccessScreenProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  iconComponent?: React.ReactNode;
  headingStyle?: StyleProp<TextStyle>;
  subHeadingStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * SuccessScreen is a React functional component that renders an OTP success screen.
 *
 * This component displays a success icon, a heading, a subheading, and a button.
 * It is styled based on the current theme and is used to indicate successful OTP
 * verification.
 *
 * Props:
 * - title: The main title text displayed as a heading.
 * - subtitle: The text displayed as a subheading.
 * - buttonText: The text displayed on the button.
 * - onButtonPress: A callback function triggered when the button is pressed.
 */

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  title,
  subtitle,
  buttonText,
  onButtonPress,
  buttonStyle,
  iconComponent,
  headingStyle,
  subHeadingStyle,
  containerStyle
}) => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      <View style={styles.innerContainer}>
        {iconComponent ?? null}

        <CustomHeading
          headingText={title}
          subHeadingText={subtitle}
          headingStyles={StyleSheet.flatten([styles.headingStyle, headingStyle])}
          subHeadingStyles={StyleSheet.flatten([styles.subHeadingStyle, subHeadingStyle])}
          isLogoVisible={false}
          headingFont={fonts.franklinGothicURW}
          headingWeight="Med"
          headingColor={theme.subtitleTextSubtitle}
          subHeadingColor={theme.inputFillforegroundInteractiveDefault}
          subHeadingWeight="Boo"
          subHeadingFont={fonts.franklinGothicURW}
        />
      </View>

      <CustomButton
        onPress={onButtonPress}
        buttonText={buttonText}
        buttonTextSize={fontSize['s']}
        buttonTextColor={theme.primaryCTATextDefault}
        buttonStyles={buttonStyle as ViewStyle}
        buttonTextStyles={styles.continueText}
      />
    </View>
  );
};

export default SuccessScreen;
