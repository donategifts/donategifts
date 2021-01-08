import * as S3 from 'aws-sdk/clients/s3';
import { inject, injectable } from 'inversify';
import * as sharp from 'sharp';
import * as uuidV4 from 'uuid';
import { logger } from '@donategifts/helper';

export interface IS3Config {
	accessKeyId: string;
	secretAccessKey: string;
	bucket: string;
}

@injectable()
export class StorageService {
	private s3: S3;

	constructor(@inject('AmazonS3Config') private s3Config: IS3Config) {
		if (!this.s3Config.accessKeyId || !this.s3Config.secretAccessKey) {
			throw new Error('No accessKeyId or secretAccessKey provided for AWS S3');
		}

		this.s3 = new S3(this.s3Config);

		logger.info('StorageService: created storage client for S3 AWS');
	}

	private static getFilesizeInBytes(base64: string): number {
		const base64Length = base64.length - (base64.indexOf(',') + 1);
		const padding = base64.charAt(base64.length - 2) === '=' ? 2 : 1;
		return base64Length * 0.75 - padding;
	}

	public async upload(file: Express.Multer.File): Promise<string> {
		const fileSize = StorageService.getFilesizeInBytes(file.buffer.toString('base64'));
		// 10mb max upload

		if (fileSize > 10000000) {
			throw new Error(`Filesize limit exceeded, max limit is 10mb. Got ${fileSize / 1000000}mb!`);
		}

		// resize file before upload
		const processedFile = await sharp(file.buffer)
			.resize({ fit: sharp.fit.contain, width: 640 })
			.jpeg()
			.toBuffer();

		const uploadParams = {
			Bucket: this.s3Config.bucket,
			Key: `${uuidV4()}.jpeg`,
			Body: processedFile,
		};

		const result = await this.s3.upload(uploadParams).promise();

		return result.Location;
	}
}
