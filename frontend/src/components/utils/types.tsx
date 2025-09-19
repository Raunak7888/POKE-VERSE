export interface User {
  id: number;
  name: string;
  email: string;
  image?: string;
}


export interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  loadFromCookies: () => void;
}
