export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
  fullName: string;
  birthday: Date;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    username: string;
  };
  accessToken: string;
}
