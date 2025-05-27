import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserData {
  username: string | undefined;
}

interface AuthStoreState {
  user: UserData | null;
  isAuthenticated: boolean;
}

interface AuthStoreActions {
  login: (userData: UserData) => void;
  logout: () => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,

        login: (userData: UserData) =>
          set(() => ({
            user: userData,
            isAuthenticated: true,
          })),

        logout: () =>
          set(() => ({
            user: null,
            isAuthenticated: false,
          })),
      }),
      {
        name: "auth-storage",

        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: "Auth Store",
    },
  ),
);

export default useAuthStore;
