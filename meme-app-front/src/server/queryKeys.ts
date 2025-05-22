import { CommentFilters } from './types/comment';
import { PublicationFilters } from './types/publication';

const getPublications = () => ['get-publications'];
const getPublication = (filters?: Partial<PublicationFilters>) => [
  'get-publication',
  filters,
];
const generateAiImage = () => ['generate-ai-image'];
const getComments = (filters?: Partial<CommentFilters>) => [
  'get-comments',
  filters,
];

export const queryKeys = {
  getPublications,
  getPublication,
  generateAiImage,
  getComments,
} as const;
