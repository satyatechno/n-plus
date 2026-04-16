import { View } from 'react-native';
import React from 'react';

import { themeStyles } from '@src/views/pages//main/MyAccount/Newsletters/styles';
import useNewslettersViewModel from '@src/viewModels/main/MyAccount/Newsletters/useNewslettersViewModel';
import { UnSubscribe } from '@src/assets/icons';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import CustomHeading from '@src/views/molecules/CustomHeading';
import { fonts } from '@src/config/fonts';
import { fontSize } from '@src/config/styleConsts';

const NoSubscription = () => {
  const { theme, t } = useNewslettersViewModel();
  const styles = themeStyles(theme);
  return (
    <View style={styles.noSubscriptionContainer}>
      <UnSubscribe
        height={actuatedNormalizeVertical(64)}
        width={actuatedNormalize(64)}
        fill={theme.colorSecondary600}
      />

      <CustomHeading
        isLogoVisible={false}
        subHeadingText={t('screens.newsletters.text.stayInformed')}
        subHeadingSize={fontSize['s']}
        headingText={t('screens.newsletters.text.haveNoSubscriptions')}
        headingFont={fonts.franklinGothicURW}
        headingWeight="Med"
        headingSize={fontSize['l']}
        headingStyles={styles.noSubscriptionText}
        subHeadingStyles={styles.noSubscriptionText}
      />
    </View>
  );
};

export default NoSubscription;
