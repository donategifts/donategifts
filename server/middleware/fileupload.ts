import path from 'path';

import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-sharp-s3';
import { v4 as UUIDv4 } from 'uuid';

export default class FileUpload {
	private s3: AWS.S3;

	private storage: multer.StorageEngine;

	public upload: multer.Multer;

	constructor() {
		this.s3 = new AWS.S3({
			accessKeyId: process.env.AWS_KEY,
			secretAccessKey: process.env.AWS_SECRET,
		});

		if (process.env.USE_AWS !== 'true') {
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
			this.storage = multerS3({
				s3: this.s3,
				Bucket: process.env.S3BUCKET,
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
