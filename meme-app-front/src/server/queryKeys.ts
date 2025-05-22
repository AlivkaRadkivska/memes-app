import { CommentFilters } from './types/comment';
import { PublicationFilters } from './types/publication';

const getPublications = (filters?: Partial<PublicationFilters>) => [
  'get-publications',
  filters,
];
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
