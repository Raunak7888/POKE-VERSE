import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthState } from "@/components/utils/types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setAuth: (user, accessToken, refreshToken) => {
    // save in zustand
    set({ user, accessToken });

    // persist to cookies
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    Cookies.set("accessToken", accessToken, { expires: 1 }); // short lived
    Cookies.set("refreshToken", refreshToken, { expires: 7 });
  },

  clearAuth: () => {
    set({ user: null, accessToken: null });
    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  },

  loadFromCookies: () => {
    const user = Cookies.get("user");
    const accessToken = Cookies.get("accessToken");

    if (user && accessToken) {
      set({
        user: JSON.parse(user),
        accessToken,
      });
    }
  },
}));
