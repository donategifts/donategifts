export interface IEmail {
	from: string | undefined;
	to: string;
	subject: string;
	message: string;
	attachments?: {
		filename: string;
		path: string;
		cid: string;
	}[];
}
