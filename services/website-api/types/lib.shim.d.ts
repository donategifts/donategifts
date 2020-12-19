/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { ISessionUser, IDBAgency } from '../../../packages/common/src/types';

declare global {
	var io: any;
}

declare module 'express-session' {
	interface SessionData {
		user: ISessionUser;
		agency: IDBAgency;
	}
}
