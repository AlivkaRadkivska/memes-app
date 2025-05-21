export interface Comment {
  id: string;
  text: string;
  picture: string | null;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    email: string;
  };
  publication: string;
}
