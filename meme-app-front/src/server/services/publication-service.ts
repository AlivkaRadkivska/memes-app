import { axiosInstance } from '../axios';
import { PaginatedData } from '../types/common';
import { Publication, PublicationFilters } from '../types/publication';

export const fetchPublications = async (
  params?: Partial<PublicationFilters>
): Promise<PaginatedData<Publication>> => {
  const response = await axiosInstance.get('/publication', { params });
  return response.data;
};
