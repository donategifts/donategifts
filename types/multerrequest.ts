import type { Request } from 'express';

export interface MulterRequest extends Request {
	file?: {
		filename: string;
		Location: string;
		path: string;
		mimetype: string;
		size: number;
		fieldname: string;
		originalname: string;
		encoding: string;
		destination: string;
		buffer: Buffer;
		stream: any;
	};
}
