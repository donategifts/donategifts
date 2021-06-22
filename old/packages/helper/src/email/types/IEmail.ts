export interface IEmail {
	from: string;
	to: string;
	subject: string;
	message: string;
	attachments: {
		filename: string;
		path: string;
		cid: string;
	}[];
}
