import path from 'path';

import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-sharp-s3';
import { v4 as UUIDv4 } from 'uuid';

import config from '../../config';

export default class FileUpload {
	private s3: AWS.S3 | undefined;

	private storage: multer.StorageEngine;

	public upload: multer.Multer;

	constructor() {
		if (!config.AWS.USE) {
			this.storage = multer.diskStorage({
				destination: `${path.join(__dirname, '../../uploads/')}`,
				filename: (_req, file, cb) => {
					cb(
						null,
						`${UUIDv4()}-${file.filename || path.parse(file.originalname).name}.jpeg`,
					);
				},
			});
		} else {
			if (!config.AWS.KEY || !config.AWS.SECRET || !config.AWS.S3BUCKET) {
				throw new Error(
					'AWS is enabled but missing one or more required environment variables.',
				);
			}

			this.s3 = new AWS.S3({
				accessKeyId: config.AWS.KEY,
				secretAccessKey: config.AWS.SECRET,
			});

			this.storage = multerS3({
				s3: this.s3,
				Bucket: config.AWS.S3BUCKET,
				ACL: 'public-read',
				CacheControl: 'max-age=31536000',
				Key(_req, _file, cb) {
					cb(null, `${UUIDv4()}.jpeg`);
				},
				resize: {
					height: 640,
				},
				toFormat: 'jpeg',
			});
		}

		this.upload = multer({
			storage: this.storage,
			limits: {
				fileSize: 1024 * 1024 * 5, // up to 5 mbs
			},
			fileFilter: (_req, file, cb) => {
				if (
					file.mimetype === 'image/jpeg' ||
					file.mimetype === 'image/jpg' ||
					file.mimetype === 'image/gif' ||
					file.mimetype === 'image/png'
				) {
					cb(null, true);
				} else {
					cb(null, false);
				}
			},
		});
	}
}
