export interface ITokenPayLoad {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isRefreshToken?: boolean;
  isDeveloper?: boolean;
  customerSessionId?: string;
}
