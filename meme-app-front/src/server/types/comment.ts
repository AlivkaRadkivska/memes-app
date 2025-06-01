import { MiniUser } from './user';

export interface Comment {
  id: string;
  text: string;
  picture: string | null;
  createdAt: Date;
  user: MiniUser;
  publication: string;
}

export interface CommentPayload {
  publication: string;
  text: string;
  picture: File | null;
}

export interface CommentFilters {
  publicationId?: string;
  userId?: string;

  limit?: number;
  page?: number;
}
