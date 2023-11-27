import { NextFunction, Request, Response } from 'express';
import { Selectable } from 'kysely';

import { Orderstatus, Wishcards } from '../../db/types/generated/database';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class ProfileController extends BaseController {
    private async sendEmail(email: string, verificationHash: string) {
        const emailResponse = await Messaging.sendVerificationEmail(email, verificationHash);
        const response = emailResponse ? emailResponse.data : '';
        if (config.NODE_ENV === 'development') {
            this.log.info(response);
        }
    }

    async handlePostResendVerificationLink(req: Request, res: Response, _next: NextFunction) {
        try {
            const { userId } = req.body;

            const user = await this.usersRepository.getById(userId);

            if (!user) {
                return this.handleError(res, 'User not found');
            }

            if (user.is_verified) {
                return this.handleError(res, 'User is already verified');
            }

            const { token } = await this.verificationTokensRepository.getByUserId(userId);

            await this.sendEmail(user.email, token);

            return this.sendResponse(res, {
                success: true,
                message: 'Verification email sent',
            });
        } catch (error) {
            this.log.error('[ProfileController] postResendVerificationLink: ', error);
            return this.handleError(res, error);
        }
    }

    async handlePutIndex(req: Request, res: Response, _next: NextFunction) {
        try {
            const { first_name, last_name, bio } = req.body;

            let user = await this.usersRepository.getById(res.locals.user.id);

            if (!user) {
                return this.handleError(res, 'User could not be found');
            }

            const updatedUser = await this.usersRepository.update(user.id, {
                first_name,
                last_name,
                bio,
            });
            // include eslint line disable because of the false positive error
            // Possible race condition: `req.session.user` might be assigned based on an outdated state of `req`
            if (updatedUser) {
                req.session.user = updatedUser;
            }
            user = updatedUser;

            return this.sendResponse(res, {
                success: true,
                message: null,
                data: user,
            });
        } catch (error) {
            this.log.error('[ProfileController] handlePutIndex: ', error);
            return this.handleError(res, error);
        }
    }

    async handlePostImage(req: Request, res: Response, _next: NextFunction) {
        if (!req.file) {
            return this.handleError(
                res,
                'File must be in jpeg, jpg, gif, or png format. The file must also be less than 5 megabytes.',
            );
        }

        try {
            let filePath;

            if (config.NODE_ENV === 'development') {
                // locally when using multer images are saved inside this folder
                filePath = `/uploads/${req.file.filename}`;
            }
            const profileImage = config.AWS.USE ? req.file.location : filePath;

            if (res.locals.user.image_id) {
                await this.imagesRepository.update(res.locals.user.image_id, { url: profileImage });
            } else {
                const newImage = await this.imagesRepository.create({
                    url: profileImage as string,
                    created_by: res.locals.user.id,
                });
                await this.usersRepository.update(res.locals.user.id, { image_id: newImage.id });
            }

            this.log.info({
                msg: 'Profile picture updated',
                type: 'user_profile_picture_update',
                user: res.locals.user.id,
            });

            return this.sendResponse(res, {
                success: true,
                message: null,
                data: profileImage,
            });
        } catch (error) {
            this.log.error('[ProfileController] handlePostImage: ', error);
            return this.handleError(res, error);
        }
    }

    async handleDeleteImage(_req: Request, res: Response, _next: NextFunction) {
        try {
            // if users had deleted picture replace it with string for the default avatar
            // const defaultImage = '/svg/default_profile_avatar.svg';
            // To do: Create a default user who links to the default image
            const defaultUser = await this.usersRepository.getByEmail('');
            // @ts-ignore
            const defaultImage = await this.imagesRepository.getById(defaultUser.image_id);

            await this.usersRepository.update(res.locals.user.id, {
                image_id: defaultImage.id,
            });

            this.log.info({
                msg: 'Profile picture deleted',
                type: 'user_profile_picture_delete',
                user: res.locals.user.id,
            });

            return this.sendResponse(res, {
                success: true,
                message: null,
                data: defaultImage,
            });
        } catch (error) {
            this.log.error('[ProfileController] handleDeleteImage: ', error);
            return this.handleError(res, error);
        }
    }

    async handlePutAccount(req: Request, res: Response, _next: NextFunction) {
        try {
            const { fName, lName } = req.body;

            if (!res.locals.user) {
                return this.handleError(res, 'No user id in request', 403);
            }

            const user = await this.usersRepository.getById(res.locals.user.id);

            if (!user) {
                return this.handleError(res, 'User could not be found', 404);
            }

            const updatedUser = await this.usersRepository.update(user.id, {
                first_name: fName,
                last_name: lName,
            });
            // include eslint line disable because of the false positive error
            // Possible race condition: `req.session.user` might be assigned based on an outdated state of `req`
            if (updatedUser) {
                req.session.user = updatedUser;
            }

            return res.status(200).send({
                success: true,
                message: null,
                data: { fName, lName },
            });
        } catch (error) {
            this.log.error('[ProfileController] handlePutAccount: ', error);
            return this.handleError(res, error);
        }
    }

    async handlePutAgency(req: Request, res: Response, _next: NextFunction) {
        try {
            const {
                agencyBio,
                agencyPhone,
                agencyWebsite,
                address1,
                address2,
                city,
                state,
                country,
                zipcode,
            } = req.body;

            const agency = await this.agenciesRepository.getByAccountManagerId(res.locals.user.id);

            if (!agency) {
                return this.handleError(res, 'Agency could not be found', 404);
            }

            await this.agenciesRepository.update(agency.id, {
                bio: agencyBio,
                phone: agencyPhone,
                website: agencyWebsite,
                address_line_1: address1,
                address_line_2: address2,
                city,
                state,
                country_code: country,
                zip_code: zipcode,
            });

            return this.sendResponse(res, {
                success: true,
                message: null,
                data: {
                    agencyBio,
                    agencyPhone,
                    agencyWebsite,
                    address1,
                    address2,
                    city,
                    state,
                    country,
                    zipcode,
                },
            });
        } catch (error) {
            this.log.error('[ProfileController] handlePutAgency: ', error);
            return this.handleError(res, error);
        }
    }

    // TODO: needs testing, not sure if it works
    async handleGetDonations(_req: Request, res: Response, _next: NextFunction) {
        try {
            const orders = await this.ordersRepository.getByDonorId(res.locals.user.id);

            if (!orders) {
                return this.handleError(res, 'Donation data could not be found');
            }

            const donations: {
                from: string;
                to: string;
                orderDate: Date;
                card: Selectable<Wishcards>;
                price: number;
                status: Orderstatus;
            }[] = [];

            for (const order of orders) {
                const wishCard = await this.wishCardsRepository.getById(order.wishcard_id);
                const item = await this.itemsRepository.getById(wishCard.item_id);

                donations.push({
                    from: order.donor_id,
                    to: wishCard.child_id,
                    orderDate: order.created_at,
                    card: wishCard,
                    price: parseFloat(item.price),
                    status: order.status,
                });
            }

            return this.sendResponse(res, donations);
        } catch (error) {
            this.log.error('[ProfileController] handlePutAgency: ', error);
            return this.handleError(res, error);
        }
    }
}
