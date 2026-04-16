import { useRef } from 'react';

import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DeleteAccountResponse } from '@src/models/main/MyAccount/DeleteAccountReasons';
import { screenNames } from '@src/navigation/screenNames';
import { MyAccountStackParamList } from '@src/navigation/types';
import { DELETE_ACCOUNT_MUTATION } from '@src/graphql/main/MyAccount/mutations';

type DeleteAccountParams = {
  email: string;
  finalReason: string;
};

export const useDeleteAccount = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MyAccountStackParamList>>();

  const paramsRef = useRef<DeleteAccountParams | null>(null);

  const [deleteAccountMutation, { data, loading, error }] = useMutation<DeleteAccountResponse>(
    DELETE_ACCOUNT_MUTATION,
    {
      onCompleted: () => {
        const { email, finalReason } = paramsRef.current ?? {};
        if (email && finalReason) {
          navigation.navigate(screenNames.DELETE_ACCOUNT_OTP, {
            email,
            finalReason
          });
        }
      }
    }
  );

  const deleteAccount = ({ email, finalReason }: DeleteAccountParams) => {
    paramsRef.current = { email, finalReason };
    deleteAccountMutation();
  };

  return {
    deleteAccount,
    data,
    loading,
    error
  };
};
