const express = require('express');
const moment = require('moment');

const router = express.Router();
const log = require('../helper/logger');
const { handleError } = require('../helper/error');
const WishCardMiddleWare = require('./middleware/wishCard.middleware');
const { redirectLogin } = require('./middleware/login.middleware');
const { donationPostValidation, validate } = require('./validations/donationPost.validations');
const PostRepository = require('../db/repository/PostRepository');
const AgencyRepository = require('../db/repository/AgencyRepository');

router.get('/', async (req, res) => {
	try {
		const { user } = req.session;
		const posts = await PostRepository.getAllPosts();
		res.status(200).render('community', { user, posts, moment });
	} catch (error) {
		log.error(req, error);
		return handleError(res, 400, error);
	}
});

router.post(
	'/',
	WishCardMiddleWare.upload.single('postImage'),
	redirectLogin,
	donationPostValidation(),
	validate,
	async (req, res) => {
		try {
			const { user } = req.session;
			// only partner users can publish donation thank you posts
			if (user.userRole !== 'partner') {
				res.status(401).send(
					JSON.stringify({
						success: false,
						error: 'Only partners user can publish thank you posts',
						data: null,
					}),
				);
			}
			const agency = await AgencyRepository.getAgencyByUserId(user._id);
			let profileImage;
			if (req.file !== undefined) {
				let filePath;
				if (process.env.NODE_ENV === 'development') {
					// locally when using multer images are saved inside this folder
					filePath = `/uploads/${req.file.filename}`;
				}
				profileImage = process.env.USE_AWS === 'true' ? req.file.Location : filePath;
			}

			const newPost = {
				message: req.body.postText,
				image: profileImage || null,
				belongsTo: agency,
				agency,
			};

			await PostRepository.createNewPost(newPost);
			res.status(200).send(
				JSON.stringify({
					success: true,
					error: null,
					data: newPost,
				}),
			);
		} catch (error) {
			log.error(req, error);
			res.status(400).send(
				JSON.stringify({
					success: false,
					error,
					data: null,
				}),
			);
		}
	},
);

module.exports = router;
