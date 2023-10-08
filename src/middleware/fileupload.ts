import path from 'path';

import { S3 } from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-sharp-s3';
import { v4 as uuidv4 } from 'uuid';

import config from '../helper/config';

export default class FileUpload {
	private storage: multer.StorageEngine;

	public upload: multer.Multer;

	constructor() {
		if (!config.AWS.USE) {
			this.storage = multer.diskStorage({
				destination: `${path.join(__dirname, '../../uploads/')}`,
				filename: (_req, file, cb) => {
					cb(
						null,
						`${uuidv4()}-${file.filename || path.parse(file.originalname).name}.jpeg`,
					);
				},
			});
		} else {
			if (!config.AWS.KEY || !config.AWS.SECRET || !config.AWS.S3BUCKET) {
				throw new Error(
					'AWS is enabled but missing one or more required environment variables.',
				);
			}

			this.storage = multerS3({
				s3: new S3({
					accessKeyId: config.AWS.KEY,
					secretAccessKey: config.AWS.SECRET,
				}),
				Bucket: config.AWS.S3BUCKET,
				ACL: 'public-read',
				CacheControl: 'max-age=31536000',
				Key(_req, _file, cb) {
					cb(null, `${uuidv4()}.jpeg`);
				},
				resize: {
					height: 420,
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
