const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-sharp-s3');
const { v4: UUIDv4 } = require('uuid');
const path = require('path');

const config = require('../../config');

module.exports = class FileUpload {
	#s3;

	#storage;

	constructor() {
		this.#s3 = new AWS.S3({
			accessKeyId: config.AWS.KEY,
			secretAccessKey: config.AWS.SECRET,
		});

		if (config.AWS.USE) {
			this.#storage = multerS3({
				s3: this.#s3,
				Bucket: config.AWS.S3BUCKET,
				ACL: 'public-read',
				cacheControl: 'max-age=31536000',
				key(_req, _file, cb) {
					cb(null, `${UUIDv4()}.jpeg`);
				},
				resize: {
					height: 640,
				},
				toFormat: 'jpeg',
			});
		} else {
			this.#storage = multer.diskStorage({
				destination: `${path.join(__dirname, '../../uploads/')}`,
				filename: (_req, file, cb) => {
					cb(
						null,
						`${UUIDv4()}-${file.filename || path.parse(file.originalname).name}.jpeg`,
					);
				},
			});
		}

		this.upload = multer({
			storage: this.#storage,
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
};
