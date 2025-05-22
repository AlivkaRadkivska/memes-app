import axiosInstance from '../axios';

export const startFollow = async (followingId: string): Promise<void> => {
  const response = await axiosInstance.post(`/follow/${followingId}`);
  return response.data;
};

export const deleteFollow = async (followingId: string): Promise<void> => {
  const response = await axiosInstance.delete(`/follow/${followingId}`);
  return response.data;
};
