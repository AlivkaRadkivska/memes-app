export interface Publication {
  id: string;
  pictures: string[];
  description: string;
  keywords: string[];
  author: {
    id: string;
    username: string;
    fullName: string;
    email: string;
  };
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
