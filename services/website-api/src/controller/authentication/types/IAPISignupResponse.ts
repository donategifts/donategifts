import { IAPIUser } from '../../user/types/IAPIUser';

export interface IAPISignupResponse {
	user: IAPIUser;
	url: string;
}
