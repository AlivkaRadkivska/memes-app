import axiosInstance from '../axios';
import { Follow, FollowResponse } from '../types/follows';

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

export const fetchFollowers = async (
  followingId: string
): Promise<Follow[]> => {
  const response = await axiosInstance.get(`/follow/followers/${followingId}`);
  return response.data;
};

export const fetchFollowings = async (
  followerId: string
): Promise<Follow[]> => {
  const response = await axiosInstance.get(`/follow/followings/${followerId}`);
  return response.data;
};
