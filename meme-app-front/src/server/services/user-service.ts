import axiosInstance from '../axios';
import { FollowResponse } from '../types/user';

export const startFollow = async (
  followingId: string
): Promise<FollowResponse> => {
  const response = await axiosInstance.post(`/follow/${followingId}`);
  return response.data;
};

export const stopFollow = async (followingId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/follow/${followingId}`);
  return response.data;
};
