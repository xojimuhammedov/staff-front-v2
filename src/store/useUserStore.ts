import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserStoreState = {
  me: {
    email: string;
    firstName: string;
    group: any[];
    id: string;
    image: string;
    lastName: string;
    role: string;
    token: string;
    username: string;
  } | null;
  setMe: (info: UserStoreState['me']) => void;
};

const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      setMe: (data) => {
        set({ me: data });
      },
      me: null
    }),
    {
      name: 'userStore',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useUserStore;
