export interface Author {
  id: string;
  username: string;
  fullName: string;
  email: string;
}

export interface Publication {
  id: string;
  pictures: string[];
  description: string;
  keywords: string[];
  author: Author;
  createdAt: Date;
  lastUpdatedAt: Date;
  status: string;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: Date;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export interface PublicationFilters {
  keywords?: string;
  status?: string;
  isBanned?: boolean;
  search?: string;
  author?: string;
  createdAtDesc?: boolean;

  limit?: number;
  page?: number;
}

export interface AiImageResponse {
  mimeType: string;
  base64: string;
}
