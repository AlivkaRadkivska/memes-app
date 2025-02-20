import { Publication } from '../types/publication';
import { axiosInstance } from '../axios';

export const fetchPublications = async (): Promise<Publication[]> => {
  const response = await axiosInstance.get('/publication');
  return response.data;
};
