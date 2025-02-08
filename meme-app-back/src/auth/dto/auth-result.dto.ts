export class AuthResultDto {
  user: {
    id: string;
    email: string;
    username: string;
  };
  accessToken: string;
}
