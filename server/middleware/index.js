const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-sharp-s3');
const { v4: UUIDv4 } = require('uuid');
const path = require('path');
const AgencyRepository = require('../db/repository/AgencyRepository');

module.exports = class MiddleWare {
	#s3;

	#storage;

	#agencyRepository;

	constructor() {
		this.#s3 = new AWS.S3({
			accessKeyId: process.env.AWS_KEY,
			secretAccessKey: process.env.AWS_SECRET,
		});

		this.#agencyRepository = new AgencyRepository();

		if (process.env.USE_AWS !== 'true') {
			this.#storage = multer.diskStorage({
				destination: `${path.join(__dirname, '../../uploads/')}`,
				filename: (_req, file, cb) => {
					cb(
						null,
						`${UUIDv4()}-${file.filename || path.parse(file.originalname).name}.jpeg`,
					);
				},
			});
		} else {
			this.#storage = multerS3({
				s3: this.#s3,
				Bucket: process.env.S3BUCKET,
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
		}

		this.upload = multer({
			storage: this.#storage,
			limits: {
				fileSize: 1024 * 1024 * 5, // up to 5 mbs
			},
			fileFilter: this.#fileFilter,
		});

		this.checkVerifiedUser = this.checkVerifiedUser.bind(this);
		this.renderPermissions = this.renderPermissions.bind(this);
		this.renderPermissionsRedirect = this.renderPermissionsRedirect.bind(this);
	}

	static redirectLogin(_req, res, next) {
		if (!res.locals.user) {
			res.redirect('/login');
		} else {
			next();
		}
	}

	static redirectProfile(_req, res, next) {
		if (res.locals.user) {
			res.redirect('/profile');
		} else {
			next();
		}
	}

	#fileFilter(_req, file, cb) {
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
	}

	#isNull({ agency, foundAgency }) {
		if (!agency || !foundAgency) {
			return true;
		}
		return false;
	}

	#NotVerified({ user, foundAgency }) {
		if (user.userRole !== 'partner' || !foundAgency.isVerified) {
			return true;
		}
		return false;
	}

	async #isNullOrNotVerifiedAgency(userInfo) {
		const { user, agency } = userInfo;
		const foundAgency = await this.#agencyRepository.getAgencyByUserId(user._id);
		const info = { foundAgency, ...userInfo };
		if (this.#isNull(info) || !foundAgency._id.equals(agency._id) || this.#NotVerified(info)) {
			return true;
		}
		return false;
	}

	async renderPermissions(_req, res, next) {
		const { user } = res.locals;
		const agency = this.#agencyRepository.getAgencyByUserId(user._id);
		const userInfo = { user, agency };
		if (!user) {
			res.status(403).send({ success: false, url: '/login' });
		} else if (user.userRole === 'admin') {
			next();
		} else if (await this.#isNullOrNotVerifiedAgency(userInfo)) {
			res.status(403).send({ success: false, url: '/profile' });
		} else {
			next();
		}
	}

	async renderPermissionsRedirect(_req, res, next) {
		const { user } = res.locals;
		const agency = this.#agencyRepository.getAgencyByUserId(user._id);
		const userInfo = { user, agency };
		if (!user) {
			res.status(403).render('error/403');
		} else if (user.userRole === 'admin') {
			next();
		} else if (await this.#isNullOrNotVerifiedAgency(userInfo)) {
			res.status(403).render('error/403');
		} else {
			next();
		}
	}

	async checkVerifiedUser(_req, res, next) {
		const { user } = res.locals;
		if (!user) {
			res.status(403).send({ success: false, url: '/login' });
		}
		if (!user.emailVerified) {
			res.status(403).send({ success: false, url: '/profile' });
		} else {
			next();
		}
	}
};
