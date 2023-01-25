export class ServerSideTokensDto {
  accessToken: { token: string; maxAge: number };
  refreshToken: { token: string; maxAge: number };
}
