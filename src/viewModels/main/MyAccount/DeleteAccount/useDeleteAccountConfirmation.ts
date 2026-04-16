import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import { DELETE_ACCOUNT_REASONS_QUERY } from '@src/graphql/main/MyAccount/queries';
import { DeleteAccountReasonsResponse } from '@src/models/main/MyAccount/DeleteAccountReasons';
import { logSelectContentEvent } from '@src/services/analytics/selectContentAnalyticsHelpers';
import {
  ANALYTICS_ORGANISMS,
  ANALYTICS_MOLECULES,
  ANALYTICS_PAGE,
  ANALYTICS_COLLECTION,
  SCREEN_PAGE_WEB_URL,
  ANALYTICS_ID_PAGE,
  ANALYTICS_ATOMS
} from '@src/utils/analyticsConstants';

/**
 * Custom hook for managing the delete account confirmation screen state and logic.
 *
 * This hook fetches the possible reasons for account deletion, handles error toasts,
 * and manages user-selected reasons and confirmation flags.
 *
 * @returns {
 *   reasonsList: string[] - List of localized account deletion reasons.
 *   selectedReasons: string[] - Currently selected reasons by the user.
 *   isConfirmed: boolean - Whether user confirmed deletion action via checkbox.
 *   isOtherSelected: boolean - If "Other" reason is selected.
 *   toggleReason: (reason: string) => void - Handler to toggle a reason in user selection.
 *   toggleConfirmation: () => void - Handler to toggle the confirmation checkbox.
 *   deleteInfoHtml: string - HTML snippet to be shown for delete info context.
 *   loading: boolean - Query loading state.
 *   toastMessage: string - Current toast message to display.
 *   toastType: 'success' | 'error' - Type of toast message.
 *   toastVisible: boolean - Toast visibility flag.
 *   setToastVisible: (visible: boolean) => void - Setter for toast visibility.
 * }
 *
 * @example
 * const {
 *   reasonsList,
 *   selectedReasons,
 *   isConfirmed,
 *   isOtherSelected,
 *   toggleReason,
 *   toggleConfirmation,
 *   deleteInfoHtml,
 *   loading,
 *   toastMessage,
 *   toastType,
 *   toastVisible,
 *   setToastVisible
 * } = useDeleteAccountViewModel();
 */

export const useDeleteAccountViewModel = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data, loading, error } = useQuery<DeleteAccountReasonsResponse>(
    DELETE_ACCOUNT_REASONS_QUERY
  );

  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');

  useEffect(() => {
    if (error) {
      const message: string =
        (error?.graphQLErrors?.[0]?.extensions?.message as string) ||
        (error?.graphQLErrors?.[0]?.message as string) ||
        (error?.message as string) ||
        t('screens.login.text.somethingWentWrong');
      setToastMessage(message);
      setToastType('error');
      setToastVisible(true);
    }
  }, [error, t]);

  const reasonsList = useMemo(
    () =>
      data?.deleteAccountReasons?.reasons?.length
        ? data.deleteAccountReasons.reasons
        : [
            t('screens.deleteAccount.text.reasons.notifications'),
            t('screens.deleteAccount.text.reasons.irrelevantContent'),
            t('screens.deleteAccount.text.reasons.experienceIssue'),
            t('screens.deleteAccount.text.reasons.privacyConcern'),
            t('screens.deleteAccount.text.reasons.otherPlatform'),
            t('screens.deleteAccount.text.reasons.takingBreak'),
            t('screens.deleteAccount.text.reasons.other')
          ],
    [data, t]
  );

  const deleteInfoHtml = data?.deleteAccountReasons?.text ?? '';

  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const otherKey = t('screens.deleteAccount.text.reasons.other');
  const isOtherSelected = selectedReasons.includes(otherKey);

  const toggleReason = (reason: string) => {
    logSelectContentEvent({
      screen_name: ANALYTICS_PAGE.ELIMINAR_CUENTA,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.ELIMINAR_CUENTA}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.CHECKBOX_OPTIONS,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.CHECK_BOX,
      content_name: reason,
      content_action: ANALYTICS_ATOMS.TAP
    });

    setSelectedReasons((prev) => {
      if (reason === otherKey) {
        if (prev.includes(otherKey)) {
          return prev.filter((r) => r !== otherKey);
        }
        return [otherKey];
      }
      if (prev.includes(otherKey)) {
        return [reason];
      }
      if (prev.includes(reason)) {
        return prev.filter((r) => r !== reason);
      }
      return [...prev, reason];
    });
  };

  const toggleConfirmation = () => {
    logSelectContentEvent({
      screen_name: ANALYTICS_PAGE.ELIMINAR_CUENTA,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.ELIMINAR_CUENTA}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.CHECKBOX_OPTIONS,
      content_type: ANALYTICS_MOLECULES.MY_ACCOUNT.CHECK_BOX,
      content_name: 'Confirmation',
      content_action: ANALYTICS_ATOMS.TAP
    });
    setIsConfirmed((prev) => !prev);
  };

  const goBack = () => {
    logSelectContentEvent({
      idPage: ANALYTICS_ID_PAGE.MI_CUENTA,
      screen_page_web_url: SCREEN_PAGE_WEB_URL.MI_CUENTA,
      screen_name: ANALYTICS_PAGE.ELIMINAR_CUENTA,
      Tipo_Contenido: `${ANALYTICS_COLLECTION.MY_ACCOUNT}_${ANALYTICS_PAGE.ELIMINAR_CUENTA}`,
      organisms: ANALYTICS_ORGANISMS.MY_ACCOUNT.HEADER,
      content_action: ANALYTICS_ATOMS.BACK
    });
    navigation.goBack();
  };

  return {
    reasonsList,
    deleteInfoHtml,
    loading,
    selectedReasons,
    isConfirmed,
    isOtherSelected,
    toggleReason,
    toggleConfirmation,
    toastVisible,
    setToastVisible,
    toastMessage,
    toastType,
    goBack
  };
};
