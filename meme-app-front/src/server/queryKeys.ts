import { CommentFilters } from './types/comment';

const getPublications = () => ['get-publications'];
const generateAiImage = () => ['generate-ai-image'];
const getComments = (filters?: Partial<CommentFilters>) => [
  'get-comments',
  filters,
];

export const queryKeys = {
  getPublications,
  generateAiImage,
  getComments,
} as const;
