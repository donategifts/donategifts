export interface IEmail {
	from: string | undefined;
	to: string;
	subject: string;
	message: string;
	attachments?: unknown;
}
