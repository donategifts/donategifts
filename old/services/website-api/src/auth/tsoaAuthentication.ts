/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUser } from '@donategifts/common';
import { Request } from 'express';
import { SecurityMethod } from './SecurityMethod';

export async function expressAuthentication(
	req: Request,
	securityName: string,
	scopes?: string[],
): Promise<IUser> {
	switch (securityName) {
		case SecurityMethod.BasicAuth:
			if (!req.session.user) {
				throw new Error('Authentication missing!');
			}
			break;
		default:
			throw new Error(`invalid security name: ${securityName}`);
	}

	return req.session.user;
}
