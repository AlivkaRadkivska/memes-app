import { axiosInstance } from '../axios';
import { PaginatedData } from '../types/common';
import {
  AiImageResponse,
  Publication,
  PublicationFilters,
} from '../types/publication';

export const fetchPublications = async (
  params?: Partial<PublicationFilters>
): Promise<PaginatedData<Publication>> => {
  const response = await axiosInstance.get('/publication', { params });
  return response.data;
};

export const generateAiImage = async (
  prompt: string
): Promise<AiImageResponse> => {
  const response = await fetch('/api/ai-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  }).then((res) => res.json());

  return response;
};
