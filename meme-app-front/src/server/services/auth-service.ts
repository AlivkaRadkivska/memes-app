import { axiosInstance } from '../axios';
import { AuthResult, LoginCredentials, SignupCredentials } from '../types/auth';

export const login = async (
  loginCredentials: LoginCredentials
): Promise<AuthResult> => {
  const response = await axiosInstance.post('/auth/login', loginCredentials);
  return response.data;
};

export const signup = async (
  signupCredentials: SignupCredentials
): Promise<AuthResult> => {
  const response = await axiosInstance.post('/auth/signup', signupCredentials);
  return response.data;
};
