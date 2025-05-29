export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatar?: string;
  role: string;
  birthday?: Date;
  signature?: string;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: Date;
  followerCount: number;
  followingCount: number;
  publicationCount: number;
  isFollowing: boolean;
}

export interface MiniUser {
  id: string;
  avatar: string;
  username: string;
  fullName: string;
  email: string;
}

export interface UserUpdatePayload {
  email?: string;
  username?: string;
  password?: string;
  newPassword?: string;
  fullName?: string;
  signature?: string;
  birthday?: Date;
  avatar?: File;
}
