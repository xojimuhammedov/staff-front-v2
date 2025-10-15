import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearAccessToken: () => void;
};

const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (accessToken) => {
        set({
          accessToken
        });
      },
      setRefreshToken: (refreshToken) => {
        set({ refreshToken });
      },
      clearAccessToken: () => {
        set({ accessToken: null });
      }
    }),
    {
      name: 'authStore',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useAuthStore;
