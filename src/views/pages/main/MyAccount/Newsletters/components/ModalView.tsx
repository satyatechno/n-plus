import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Animated
} from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { isIos } from '@src/utils/platformCheck';
import { fontSize } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import CustomButton from '@src/views/molecules/CustomButton';
import { CheckboxIcon, UncheckedBoxIcon } from '@src/assets/icons';
import { themeStyles } from '@src/views/pages//main/MyAccount/Newsletters/styles';
import useNewslettersViewModel from '@src/viewModels/main/MyAccount/Newsletters/useNewslettersViewModel';
import ConsentFooter from '@src/views/organisms/ConsentFooter';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_COLLECTION,
  ANALYTICS_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

interface ModalViewProps {
  visible: boolean;
  onRequestClose: () => void;
  modalTitle: string;
  checkBoxTopic: string[];
  onCancelPress?: () => void;
  onConfirmPress?: (customReason?: string) => void;
  checkBoxDataSelected: string[];
  onUnsubscribeResponsePress: (value: string) => void;
  onUnsubscribeResponse: (value: string) => void;
  screenName?: string;
  tipoContenido?: string;
}

const ModalView: React.FC<ModalViewProps> = ({
  visible,
  onRequestClose,
  modalTitle,
  checkBoxTopic,
  onCancelPress,
  onConfirmPress,
  checkBoxDataSelected,
  onUnsubscribeResponsePress,
  onUnsubscribeResponse,
  screenName = 'Newsletter_Modal',
  tipoContenido = 'My account	Newsletters | suscription'
}) => {
  const { theme, t } = useNewslettersViewModel();
  const [otherReason, setOtherReason] = useState('');
  const slideAnim = useMemo(() => new Animated.Value(300), []);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
        velocity: 1
      }).start();
    } else {
      slideAnim.setValue(300);
      setOtherReason('');
    }
  }, [visible, slideAnim]);

  const styles = themeStyles(theme);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={() => [Keyboard.dismiss(), onRequestClose()]}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.scrollViewStyle, { transform: [{ translateY: slideAnim }] }]}
          pointerEvents="box-none"
        >
          <KeyboardAvoidingView
            behavior={isIos ? 'padding' : 'height'}
            keyboardVerticalOffset={isIos ? 10 : 0}
          >
            <ScrollView style={styles.modalContainer} pointerEvents="box-none">
              <CustomText
                fontFamily={fonts.notoSerifExtraCondensed}
                size={fontSize['2xl']}
                textStyles={StyleSheet.flatten(styles.modalTitle)}
              >
                {modalTitle}
              </CustomText>

              <FlatList
                data={checkBoxTopic}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => {
                  const isSelected = checkBoxDataSelected.includes(item);

                  return (
                    <Pressable
                      style={styles.maodalItemContainer}
                      onPress={() => {
                        if (isSelected) {
                          onUnsubscribeResponse(item);
                        } else {
                          onUnsubscribeResponsePress(item);
                        }
                      }}
                    >
                      <View style={styles.checkBox}>
                        {isSelected ? (
                          <CheckboxIcon
                            height={actuatedNormalizeVertical(18)}
                            width={actuatedNormalize(18)}
                            fill={theme.iconIconographyDisabledState2}
                            stroke={theme.iconIconographyDisabledState2}
                            checkStroke={theme.mainBackgroundSecondary}
                          />
                        ) : (
                          <UncheckedBoxIcon
                            height={actuatedNormalizeVertical(18)}
                            width={actuatedNormalize(18)}
                            stroke={theme.iconIconographyDisabledState2}
                          />
                        )}
                      </View>

                      <CustomText
                        color={theme.newsTextPictureCarouselTitle}
                        weight={'Boo'}
                        fontFamily={fonts.franklinGothicURW}
                        textStyles={styles.modalCheckboxText}
                      >
                        {item}
                      </CustomText>
                    </Pressable>
                  );
                }}
                scrollEnabled={false}
              />

              {checkBoxDataSelected.includes(t('screens.newsletters.text.otherReason')) && (
                <>
                  <TextInput
                    style={styles.otherReasonInput}
                    value={otherReason}
                    onChangeText={setOtherReason}
                    placeholder={t('screens.newsletters.text.writeYourReasonHere')}
                    placeholderTextColor={theme.dividerPrimary}
                    multiline
                    scrollEnabled
                    maxLength={500}
                  />
                  <CustomText
                    fontFamily={fonts.franklinGothicURW}
                    weight="Boo"
                    size={fontSize.xxs}
                    color={theme.dividerPrimary}
                    textStyles={styles.otherReasonCounter}
                  >
                    ({otherReason.length}/500)
                  </CustomText>
                </>
              )}

              <View style={styles.buttonContainer}>
                <CustomButton
                  onPress={onCancelPress ?? (() => {})}
                  buttonText={t('screens.newsletters.text.thanks')}
                  buttonStyles={styles.cancelButtonStyle}
                  variant="outlined"
                  buttonTextWeight="Med"
                  buttonTextColor={theme.filledButtonPrimary}
                  buttonTextStyles={styles.buttonTextStyle}
                />
                <CustomButton
                  onPress={
                    checkBoxDataSelected.length > 0
                      ? () => {
                          logSelectContentEvent({
                            screen_name: ANALYTICS_COLLECTION.MY_ACCOUNT,
                            Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.NEWSLETTER}`,
                            organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.ACTION_SHEET,
                            content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.BUTTON_SEND_COMMENTS,
                            content_name: 'Enviar Comentarios',
                            content_action: ANALYTICS_ATOMS.TAP
                          });
                          onConfirmPress?.(otherReason || undefined);
                        }
                      : () => {}
                  }
                  buttonText={t('screens.newsletters.text.sendComments')}
                  buttonStyles={[
                    styles.confirmButtonStyle,
                    {
                      backgroundColor:
                        checkBoxDataSelected.length > 0
                          ? theme.outlinedButtonPrimaryOutline
                          : theme.iconIconographyIconBoundaries
                    }
                  ]}
                  buttonTextStyles={[
                    styles.buttonTextStyle,
                    {
                      color:
                        checkBoxDataSelected.length > 0
                          ? theme.primaryCTATextDefault
                          : theme.primaryCTATextDisabled
                    }
                  ]}
                />
              </View>
              {checkBoxDataSelected.includes(t('screens.newsletters.text.otherReason')) && (
                <ConsentFooter screenName={screenName} tipoContenido={tipoContenido} />
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalView;
