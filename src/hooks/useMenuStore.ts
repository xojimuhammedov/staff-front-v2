import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

type MenuStoreState = {
    menuOpen: boolean;
    setMenuOpen: (menuOpen: MenuStoreState["menuOpen"]) => void;
};
const useMenuStore = create<MenuStoreState>()(
    persist(
        (set) => ({
            setMenuOpen: (data) => {
                set({ menuOpen: data });
            },
            menuOpen: false,
        }),
        {
            name: "menuStore",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

export default useMenuStore;
