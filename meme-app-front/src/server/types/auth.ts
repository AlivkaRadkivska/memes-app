import { User } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
  fullName?: string;
  birthday?: Date;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    username: string;
  };
  accessToken: string;
}

export interface AuthContextType {
  user?: User;
  token?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchUser: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setAuthFromRedirect: (token: string, user: string) => void;
}
