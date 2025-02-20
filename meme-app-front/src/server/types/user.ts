export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  role: string;
  birthday?: Date;
  signature?: string;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: Date;
  followerCount: number;
  followingCount: number;
}
