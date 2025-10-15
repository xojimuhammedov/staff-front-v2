import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface StoreState {
  user: any;
  isAuthenticated: boolean;
  breadcrumbs: any[];
}

interface SettingsState {
  token: string | null;
  darkMode: boolean;
  isMenuOpen: boolean;
  lang: string;
}

const store = (set: (fn: (state: StoreState) => StoreState) => void) => ({
  user: null,
  isAuthenticated: false,
  breadcrumbs: [],
  setUser: (user: any) => set((state) => ({ ...state, user })),
  setAuth: (isAuthenticated: boolean) => set((state) => ({ ...state, isAuthenticated }))
});

const settingsStore = (set: (fn: (state: SettingsState) => SettingsState) => void) => ({
  token: null,
  darkMode: false,
  isMenuOpen: true,
  lang: 'en',
  setToken: (token: string | null) => set((state) => ({ ...state, token })),
  setLang: (lang: string) => set((state) => ({ ...state, lang })),
  setMode: () => set((state) => ({ ...state, darkMode: !state.darkMode })),
  setOpenMenu: () => set((state) => ({ ...state, isMenuOpen: !state.isMenuOpen }))
});

const storeValue = devtools<StoreState>(store);

export const useStore = create(storeValue);

// let devtoolsStore = devtools<StoreState>(store);
// let devtoolsSettingsStore = devtools<SettingsState>(settingsStore);
// devtoolsSettingsStore = persist(devtoolsSettingsStore, { name: "setting" });

// export const useStore = create<StoreState>(store);
// export const useSettingsStore = create<SettingsState>(settingsStore);
