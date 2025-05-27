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
}

export interface FollowResponse {
  id: string;
  startFollowingAt: Date;
  follower: { id: string; email: string };
  following: { id: string };
}
