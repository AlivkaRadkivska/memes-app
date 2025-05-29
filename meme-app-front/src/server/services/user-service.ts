import axiosInstance from '../axios';
import { User, UserUpdatePayload } from '../types/user';

export const getUserByEmail = async (email: string): Promise<User> => {
  const response = await axiosInstance.get(`/user/email/${email}`);
  return response.data;
};

export const updateCurrentUser = async (
  updatePayload: UserUpdatePayload
): Promise<User> => {
  const formData = new FormData();
  if (!!updatePayload.avatar)
    formData.append('avatar', updatePayload.avatar, updatePayload.avatar.name);
  if (!!updatePayload.email) formData.append('email', updatePayload.email);
  if (!!updatePayload.username)
    formData.append('username', updatePayload.username);
  if (!!updatePayload.password)
    formData.append('password', updatePayload.password);
  if (!!updatePayload.newPassword)
    formData.append('newPassword', updatePayload.newPassword);
  if (!!updatePayload.fullName)
    formData.append('fullName', updatePayload.fullName);
  if (!!updatePayload.signature)
    formData.append('signature', updatePayload.signature);
  if (!!updatePayload.birthday)
    formData.append('birthday', updatePayload.birthday.toISOString());

  const response = await axiosInstance.patch('/user/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
