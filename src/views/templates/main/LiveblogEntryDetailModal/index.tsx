import React, { useEffect, useMemo } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { fonts } from '@src/config/fonts';
import { AppTheme } from '@src/themes/theme';
import { CrossIcon } from '@src/assets/icons';
import { useTheme } from '@src/hooks/useTheme';
import { isIos } from '@src/utils/platformCheck';
import CustomText from '@src/views/atoms/CustomText';
import { NetworkStatus, useQuery } from '@apollo/client';
import ErrorScreen from '@src/views/organisms/ErrorScreen';
import CustomButton from '@src/views/molecules/CustomButton';
import { formatMexicoDateTime } from '@src/utils/dateFormatter';
import { GET_LIVE_BLOG_ENTRY_QUERY } from '@src/graphql/main/home/queries';
import LexicalContentRenderer from '@src/views/organisms/LexicalContentRenderer';
import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fontSize, letterSpacing, lineHeight, radius, spacing } from '@src/config/styleConsts';
import EntryModalSkeleton from '@src/views/templates/main/LiveblogEntryDetailModal/EntryModalSkeleton';

interface LiveblogEntryDetailModalProps {
  entryId: string;
  visible: boolean;
  onClose: () => void;
}

const LiveblogEntryDetailModal: React.FC<LiveblogEntryDetailModalProps> = ({
  entryId,
  visible,
  onClose
}) => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const styles = useMemo(() => themeStyles(theme), [theme]);
  const slideAnim = useMemo(() => new Animated.Value(1000), []);

  useEffect(() => {
    if (!visible || !entryId) return;

    if (visible) {
      requestAnimationFrame(() => {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 12
        }).start();
      });
    } else {
      Animated.spring(slideAnim, {
        toValue: 1000,
        useNativeDriver: true,
        tension: 50,
        friction: 12
      }).start();
    }
  }, [visible, entryId, slideAnim]);

  const {
    data: entryData,
    loading: entryLoading,
    error: entryError,
    networkStatus,
    refetch: refetchEntry
  } = useQuery(GET_LIVE_BLOG_ENTRY_QUERY, {
    variables: {
      id: entryId
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip: !entryId || !visible
  });

  const entryDate = useMemo(() => {
    const createdAt = entryData?.LiveBlogEntry?.createdAt ?? '';
    const formatted = formatMexicoDateTime(createdAt, 'dateTimeObject');
    if (typeof formatted === 'string') return { date: '', time: '' };
    return formatted;
  }, [entryData]);

  const entryTitle = useMemo((): string => entryData?.LiveBlogEntry?.title ?? '', [entryData]);
  const entryContent = useMemo((): string => entryData?.LiveBlogEntry?.content ?? '', [entryData]);

  if (!visible || !entryId) return null;

  const hasEntry = Boolean(entryData?.LiveBlogEntry);
  const isLoading = entryLoading || networkStatus === NetworkStatus.refetch;
  const hasError = Boolean(entryError);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Pressable onPress={onClose} style={styles.closeIconContainer}>
            <CrossIcon
              height={actuatedNormalizeVertical(12)}
              width={actuatedNormalizeVertical(12)}
              stroke={theme.dividerBlack}
              strokeWidth={1.4}
            />
          </Pressable>
          {isLoading ? (
            <EntryModalSkeleton />
          ) : hasError ? (
            <ErrorScreen
              status="error"
              OnPressRetry={() => refetchEntry()}
              containerStyles={styles.errorContainer}
              contentContainerStyle={styles.errorContent}
              buttonText={'Reintentar'}
            />
          ) : !hasEntry ? (
            <ErrorScreen status="error" showErrorButton={false} />
          ) : (
            <>
              <CustomText
                fontFamily={fonts.franklinGothicURW}
                weight={'Dem'}
                size={fontSize.xs}
                color={theme.tagsTextLive}
                textStyles={styles.date}
              >
                {entryDate.time}
                <CustomText
                  fontFamily={fonts.notoSerif}
                  weight={'R'}
                  size={fontSize.s}
                  color={theme.tagsTextLive}
                  textStyles={styles.time}
                >
                  {' | '}
                  {entryDate.date}
                </CustomText>
              </CustomText>
              <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                nestedScrollEnabled={true}
              >
                <CustomText
                  fontFamily={fonts.franklinGothicURW}
                  weight={'Dem'}
                  size={fontSize.m}
                  color={theme.liveBlogTextBulletsBodyDescription}
                  textStyles={styles.title}
                >
                  {entryTitle}
                </CustomText>

                <LexicalContentRenderer content={entryContent} />
              </ScrollView>
              <View style={styles.buttonContainer}>
                <CustomButton
                  onPress={() => onClose()}
                  buttonText={t('screens.liveBlog.text.hererIsTheCompleteNote')}
                  buttonStyles={styles.confirmButtonStyle}
                  buttonTextStyles={styles.buttonTextStyle}
                />
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const themeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: actuatedNormalize(spacing['2xl']),
      backgroundColor: theme.modalBackground
    },
    modalContainer: {
      zIndex: 999,
      maxHeight: '70%',
      borderRadius: radius.xs,
      backgroundColor: theme.mainBackgroundDefault,
      paddingTop: actuatedNormalizeVertical(spacing.xs),
      paddingBottom: actuatedNormalizeVertical(spacing.xs)
    },
    dateView: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'lightblue'
    },
    date: {
      paddingHorizontal: spacing.xs,
      marginBottom: spacing.xxxs,
      textAlignVertical: 'center'
    },
    time: {
      letterSpacing: letterSpacing.s,
      lineHeight: lineHeight.l
    },
    title: {
      lineHeight: lineHeight.l,
      letterSpacing: letterSpacing.xl,
      marginTop: spacing.xxs,
      paddingHorizontal: spacing.xs
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: actuatedNormalize(spacing.xs),
      marginTop: actuatedNormalizeVertical(spacing.s),
      marginBottom: actuatedNormalizeVertical(spacing.xs)
    },
    confirmButtonStyle: {
      width: '100%'
    },
    buttonTextStyle: {
      top: isIos ? actuatedNormalizeVertical(2) : actuatedNormalizeVertical(1)
    },
    closeIconContainer: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      justifyContent: 'center',
      paddingTop: actuatedNormalize(spacing.xxxs),
      paddingHorizontal: actuatedNormalize(spacing.s)
    },
    errorContainer: {
      flex: undefined
    },
    errorContent: {
      flex: undefined,
      marginTop: actuatedNormalizeVertical(spacing.xs),
      marginBottom: actuatedNormalizeVertical(spacing.s)
    }
  });

export default LiveblogEntryDetailModal;
