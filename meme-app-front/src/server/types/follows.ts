import { MiniUser } from './user';

export interface Follow {
  id: string;
  follower: MiniUser;
  following: MiniUser;
  startFollowAt: Date;
}

export interface FollowResponse {
  id: string;
  startFollowingAt: Date;
  follower: { id: string; email: string };
  following: { id: string };
}
