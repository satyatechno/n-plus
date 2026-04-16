import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import SkeletonLoader from '@src/views/atoms/SkeletonLoader';
import { useTheme } from '@src/hooks/useTheme';
import { themeStyles } from '@src/views/pages/main/MyAccount/DeleteAccount/DeleteAccountConfirmation/styles';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { skeletonStyles as s } from '@src/views/pages/main/MyAccount/DeleteAccount/DeleteAccountConfirmation/components/deleteAccountSkeletonStyles';

const DeleteAccountSkeleton = () => {
  const [theme] = useTheme();
  const styles = themeStyles(theme);

  const screenWidth = Dimensions.get('window').width;

  const descriptionWidths = [
    screenWidth * 0.9,
    screenWidth * 0.8,
    screenWidth * 0.6,
    screenWidth * 0.3,
    screenWidth * 0.5
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(36)}
            width={actuatedNormalize(36)}
            style={s.headerIcon}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(15)}
            width="40%"
            style={s.headerTitle}
          />
        </View>

        <View style={styles.accountInfoWrapper}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(20)}
            width="60%"
            style={s.accountEmail}
          />
          <SkeletonLoader height={actuatedNormalizeVertical(18)} width="40%" />
        </View>

        <View style={styles.descriptionWrapper}>
          {descriptionWidths.map((width, index) => (
            <SkeletonLoader
              key={index}
              height={index === 0 ? actuatedNormalizeVertical(40) : actuatedNormalizeVertical(20)}
              width={width}
              style={s.descriptionItem}
            />
          ))}
        </View>

        <View style={styles.reasonListWrapper}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(28)}
            width="100%"
            style={s.reasonTitle}
          />
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <View key={index} style={s.reasonRow}>
                <SkeletonLoader
                  height={actuatedNormalizeVertical(24)}
                  width={actuatedNormalize(24)}
                  style={s.reasonIcon}
                />
                <SkeletonLoader
                  height={actuatedNormalizeVertical(20)}
                  width="80%"
                  style={s.reasonLabel}
                />
              </View>
            ))}
          <SkeletonLoader
            height={actuatedNormalizeVertical(100)}
            width="100%"
            style={s.largeTextArea}
          />
        </View>

        <View style={styles.confirmationWrapper}>
          <SkeletonLoader
            height={actuatedNormalizeVertical(20)}
            width="90%"
            style={s.confirmationText}
          />
          <SkeletonLoader
            height={actuatedNormalizeVertical(40)}
            width="100%"
            style={s.confirmationButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeleteAccountSkeleton;
