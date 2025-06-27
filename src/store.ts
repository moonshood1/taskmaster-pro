import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "./interfaces/User";

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearToken: () => void;
  clearUser: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clearToken: () => set({ token: null }),
      clearUser: () => set({ user: null }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

interface UIState {
  useMUI: boolean;
  setUseMUI: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  useMUI: JSON.parse(localStorage.getItem("useMUI") ?? "false"),
  setUseMUI: (value) => {
    localStorage.setItem("useMUI", JSON.stringify(value));
    set({ useMUI: value });
  },
}));
