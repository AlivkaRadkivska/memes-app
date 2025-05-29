import { axiosInstance } from '../axios';
import { Comment, CommentFilters, CommentPayload } from '../types/comment';
import { PaginatedData } from '../types/common';

export const fetchComments = async (
  params?: Partial<CommentFilters>
): Promise<PaginatedData<Comment>> => {
  const response = await axiosInstance.get('/comment', { params });
  return response.data;
};

export const commentPublication = async (
  data: CommentPayload
): Promise<void> => {
  const formData = new FormData();
  if (!!data.picture)
    formData.append('picture', data.picture, data.picture.name);
  formData.append('publication', data.publication);
  formData.append('text', data.text);

  const response = await axiosInstance.post('/comment', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteCommentFromPublication = async (
  commentId: string
): Promise<void> => {
  const response = await axiosInstance.delete(`/comment/${commentId}`);
  return response.data;
};
