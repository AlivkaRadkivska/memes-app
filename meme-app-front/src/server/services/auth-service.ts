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
  const formData = new FormData();
  if (!!signupCredentials.avatar)
    formData.append(
      'avatar',
      signupCredentials.avatar,
      signupCredentials.avatar.name
    );
  formData.append('email', signupCredentials.email);
  formData.append('username', signupCredentials.username);
  formData.append('password', signupCredentials.password);
  formData.append('repeatPassword', signupCredentials.repeatPassword);
  if (!!signupCredentials.fullName)
    formData.append('fullName', signupCredentials.fullName);
  if (!!signupCredentials.birthday)
    formData.append('birthday', signupCredentials.birthday.toISOString());

  const response = await axiosInstance.post('/auth/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get('/auth/profile');
  return response.data;
};
