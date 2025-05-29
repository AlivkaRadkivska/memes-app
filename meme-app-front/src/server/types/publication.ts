import { MiniUser } from './user';

export interface Publication {
  id: string;
  pictures: string[];
  description: string;
  keywords: string[];
  author: MiniUser;
  createdAt: Date;
  lastUpdatedAt: Date;
  status: 'active' | 'hidden';
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: Date;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isFollowing: boolean;
}

export interface PublishMemesPayload {
  pictures: File[];
  description: string;
  keywords: string[];
  status: 'active' | 'hidden';
}

export interface PublicationFilters {
  keywords?: string;
  status?: 'active' | 'hidden';
  search?: string;
  author?: string;
  authorId?: string;
  createdAtDesc?: boolean;
  onlyFollowing?: boolean;

  limit?: number;
  page?: number;
}

export interface AiImageResponse {
  mimeType: string;
  base64: string;
}
