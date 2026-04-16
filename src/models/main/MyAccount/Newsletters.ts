import { AppTheme } from '@src/themes/theme';

export interface NewslettersViewModel {
  theme: AppTheme;
  t: (key: string) => string;
  setIsFormError: (value: boolean) => void;
  isFormError?: boolean;
  goBack: () => void;
  mySubscriptions: boolean;
  toggleMySubscriptions: (value: boolean) => void;
  flatlistData?: Newsletter[];
  openModal: () => void;
  onDesubscribePress: () => void;
  isModalVisible: boolean;
  checkBoxTopic?: string[];
  newsletterSubscribed: SubscriptionEntry[];
  onCheckBoxPress: (id: string) => void;
  onUnCheckBoxPress: (id: string) => void;
  onSubmit: (customReason?: string) => Promise<void>;
  changeSubscriptionLoading: boolean;
  onSubscribedUnCheckBoxPress: (id: string) => void;
  onSubscribedCheckBoxPress: (id: string) => void;
  newsletterNotSubscribed: SubscriptionEntry[];
  userNewslettersLoading: boolean;
  onUnsubscribeResponsePress: (value: string) => void;
  unSubscribeLoading: boolean;
  unSubscribeReason: string[];
  onUnsubscribeResponse: (value: string) => void;
  getAllNewslettersLoading: boolean;
  undoUnsubscribe: () => Promise<void>;
  showToastType: string;
  alertVisible: boolean;
  setAlertVisible: (value: boolean) => void;
  toastMessage: string;
  buttonInToast: string;
  userData?: object;
  userNewslettersData?: Newsletter[];
  internetFail: boolean;
  internetLoader: boolean;
  isInternetConnection: boolean;
  handleRetry: () => void;
  closeModal: () => void;
  guestToken?: string;
  handlePress: (showLogin?: boolean) => void;
  visible: boolean;
  onClose: () => void;
  onValidSubmit: (
    data: import('@src/models/auth/SocialMediaAuth').SocialMediaAuthFormValues
  ) => void;
  changeSubscriptionData?: {
    changeNewsletterSubscriptionStatus: boolean;
  };
}

export interface Newsletter {
  _id: string;
  name: string;
  desc: string;
  thumbnail: string;
  interval: string;
  isSubscribed: boolean;
}

export interface SubscriptionEntry {
  newsletter: string;
  isSubscribed: boolean;
  unsubscribeReason?: string;
}

export interface GetAllNewslettersResponse {
  getAllNewsletters: Newsletter[];
}

export interface NewsletterSubscriptionInput {
  newsletter: string;
  isSubscribed: boolean;
}

export interface ChangeNewsletterSubscriptionResult {
  changeNewsletterSubscriptionStatus: boolean;
}

export interface ModalViewProps {
  visible: boolean;
  onRequestClose: () => void;
  modalTitle: string;
  checkBoxTopic: string[];
  onCancelPress?: () => void;
  onConfirmPress?: (customReason?: string) => void;
  checkBoxDataSelected: string[];
  onUnsubscribeResponsePress: (value: string) => void;
  onUnsubscribeResponse: (value: string) => void;
}

export interface NewsletterItemProps {
  item: { item: Newsletter };
  newsletterSubscribed: SubscriptionEntry[];
  onCheckBoxPress: (id: string) => void;
  onUnCheckBoxPress: (id: string) => void;
}

export type GetNewsletterUnsubscribeReasonsResponse = {
  getNewsletterUnsubscribeReasons: string[];
};
