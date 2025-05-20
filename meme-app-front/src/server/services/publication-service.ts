import { axiosInstance } from '../axios';
import { PaginatedData } from '../types/common';
import {
  AiImageResponse,
  Publication,
  PublicationFilters,
  PublishMemesPayload,
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

export const publishMemes = async (
  data: PublishMemesPayload
): Promise<Publication> => {
  const formData = new FormData();
  formData.append('description', data.description);
  formData.append('status', data.status);
  data.keywords.forEach((keyword) => {
    formData.append('keywords[]', keyword);
  });
  data.pictures.forEach((picture) => {
    formData.append('pictures', picture, picture.name);
  });

  const response = await axiosInstance.post('/publication', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
