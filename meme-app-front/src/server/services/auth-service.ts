import { axiosInstance } from '../axios';
import { AuthResult, LoginCredentials, SignupCredentials } from '../types/auth';
import { User } from '../types/user';

export const loginWithCredentials = async (
  loginCredentials: LoginCredentials
): Promise<AuthResult> => {
  const response = await axiosInstance.post('/auth/login', loginCredentials);
  return response.data;
};

export const signupWithCredentials = async (
  signupCredentials: SignupCredentials
): Promise<AuthResult> => {
  const response = await axiosInstance.post('/auth/signup', signupCredentials);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get('/auth/profile');
  return response.data;
};
