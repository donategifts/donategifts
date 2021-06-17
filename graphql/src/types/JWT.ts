export interface ITokenPayLoad {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  roles?: string | string[];
  isRefreshToken?: boolean;
  customerSessionId?: string;
}
