import { MyProfileDataResult } from '@src/models/main/MyAccount/UpdateProfile';
import { create } from 'zustand';

type UserProfile = MyProfileDataResult['myProfile'];

interface UserStore {
  userData: UserProfile | null;
  setUserData: (data: UserProfile) => void;
  clearUserData: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
  clearUserData: () => set({ userData: null })
}));

export default useUserStore;
