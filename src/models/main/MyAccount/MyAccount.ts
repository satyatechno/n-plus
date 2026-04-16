import { StyleProp, ViewStyle } from 'react-native';

export interface MyAccountModalState {
  visible: boolean;
  modalTitle: string;
  modalMessage: string;
  cancelButtonText: string;
  confirmButtonText: string;
  onOutsidePress?: () => void;
  buttonContainerStyle?: StyleProp<ViewStyle>;
}

export interface MyAccountModalHandlers {
  onCancelPress: () => void;
  onConfirmPress: () => void;
  onOutsidePress: () => void;
  onRequestClose: () => void;
}

export type MyAccountModalProps = MyAccountModalState & MyAccountModalHandlers;
