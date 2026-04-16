import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import CustomText from '@src/views/atoms/CustomText';
import { useTheme } from '@src/hooks/useTheme';
import { AppTheme } from '@src/themes/theme';
import { fonts } from '@src/config/fonts';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { borderWidth, fontSize, lineHeight, spacing } from '@src/config/styleConsts';
import { CrossIcon, WhiteTickIcon } from '@src/assets/icons';
import { isIos } from '@src/utils/platformCheck';

/**
 * PasswordCriteria component
 *
 * A component that displays the password criteria.
 *
 * The component takes a single prop criteria, an object with boolean values
 * for the following criteria:
 * - length
 * - uppercase
 * - lowercase
 * - number
 * - specialChar
 *
 * The component renders a list of the criteria with a checkmark (WhiteTickIcon)
 * for each isCriteriaMatched criteria.
 *
 * The component uses the useTranslation hook to get the translations for the
 * criteria titles.
 *
 * @param {Object} criteria - An object with boolean values for the criteria.
 * @return {JSX.Element} A component that displays the password criteria.
 */

export type PasswordCriteriaTypes = {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
};

type PasswordCriteriaProps = {
  criteria: PasswordCriteriaTypes;
  dirtyFields?: boolean;
};

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ criteria, dirtyFields }) => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const renderCriteriaItem = (text: string, isCriteriaMatched: boolean, dirtyFields?: boolean) => (
    <View style={styles.criteriaRow} key={text}>
      <View
        style={[
          styles.circle,
          dirtyFields
            ? isCriteriaMatched
              ? styles.circleFilled
              : styles.circleRedFilled
            : styles.circleEmpty,
          styles.circleWithIcon
        ]}
      >
        {dirtyFields ? (
          isCriteriaMatched ? (
            <WhiteTickIcon
              width={actuatedNormalize(10)}
              height={actuatedNormalizeVertical(12)}
              strokeWidth={0.5}
            />
          ) : (
            <CrossIcon
              stroke={theme.toggleIcongraphySwitch}
              width={actuatedNormalize(8)}
              height={actuatedNormalizeVertical(10)}
              strokeWidth={2}
            />
          )
        ) : null}
      </View>

      <CustomText
        size={fontSize['xs']}
        color={
          dirtyFields
            ? isCriteriaMatched
              ? theme.toastAndAlertsTextSuccess
              : theme.actionCTAToastError
            : theme.bodyTextMain
        }
        weight="Boo"
        textStyles={styles.criteriaText}
        fontFamily={fonts.franklinGothicURW}
      >
        {text}
      </CustomText>
    </View>
  );

  return (
    <View style={styles.criteriaContainer}>
      <CustomText
        size={fontSize['xs']}
        color={theme.sectionTextTitleSpecial}
        weight="Boo"
        textStyles={styles.introText}
        fontFamily={fonts.franklinGothicURW}
      >
        {t('screens.validation.passwordCriteria.title')}
      </CustomText>

      {renderCriteriaItem(
        t('screens.validation.passwordCriteria.length'),
        criteria.length,
        dirtyFields
      )}
      {renderCriteriaItem(
        t('screens.validation.passwordCriteria.specialCharacter'),
        criteria.specialChar,
        dirtyFields
      )}
      {renderCriteriaItem(
        t('screens.validation.passwordCriteria.number'),
        criteria.number,
        dirtyFields
      )}
      {renderCriteriaItem(
        t('screens.validation.passwordCriteria.uppercase'),
        criteria.uppercase,
        dirtyFields
      )}
      {renderCriteriaItem(
        t('screens.validation.passwordCriteria.lowercase'),
        criteria.lowercase,
        dirtyFields
      )}
    </View>
  );
};

export default PasswordCriteria;

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    criteriaContainer: {
      marginTop: actuatedNormalizeVertical(spacing.xxs)
    },
    introText: {
      marginBottom: actuatedNormalizeVertical(spacing.xxs),
      lineHeight: actuatedNormalizeVertical(lineHeight.l)
    },
    criteriaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: actuatedNormalize(spacing.xxs)
    },
    circle: {
      width: actuatedNormalizeVertical(18),
      height: actuatedNormalizeVertical(18),
      borderRadius: actuatedNormalize(18),
      marginRight: actuatedNormalize(spacing.xxs)
    },
    criteriaText: {
      fontSize: actuatedNormalizeVertical(fontSize.xs),
      lineHeight: actuatedNormalizeVertical(lineHeight.l),
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(3)
    },
    circleWithIcon: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    circleFilled: {
      backgroundColor: theme.iconIconographyVerifiedState
    },
    circleRedFilled: {
      backgroundColor: theme.iconIconographyError
    },
    circleEmpty: {
      borderWidth: borderWidth.m,
      borderColor: theme.iconIconographyDisabledState1,
      backgroundColor: 'transparent'
    }
  });
