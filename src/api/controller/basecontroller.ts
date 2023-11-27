import { Response } from 'express';
import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit';

import AgenciesRepository from '../../db/repository/postgres/AgenciesRepository';
import ChildrenRepository from '../../db/repository/postgres/ChildrenRepository';
import CommunityPostsRepository from '../../db/repository/postgres/CommunityPostsRepository';
import ImagesRepository from '../../db/repository/postgres/ImagesRepository';
import ItemsRepository from '../../db/repository/postgres/ItemsRepository';
import MessagesRepository from '../../db/repository/postgres/MessagesRepository';
import OrdersRepository from '../../db/repository/postgres/OrdersRepository';
import UsersRepository from '../../db/repository/postgres/UsersRepository';
import VerificationTokensRepository from '../../db/repository/postgres/VerificationTokensRepository';
import WishCardsRepository from '../../db/repository/postgres/WishCardsRepository';
import logger from '../../helper/logger';

export default class BaseController {
    protected log: typeof logger;
    public limiter: RateLimitRequestHandler;
    protected agenciesRepository = AgenciesRepository;
    protected childrenRepository = ChildrenRepository;
    protected communityPostsRepository = CommunityPostsRepository;
    protected imagesRepository = ImagesRepository;
    protected itemsRepository = ItemsRepository;
    protected messagesRepository = MessagesRepository;
    protected ordersRepository = OrdersRepository;
    protected usersRepository = UsersRepository;
    protected verificationTokensRepository = VerificationTokensRepository;
    protected wishCardsRepository = WishCardsRepository;

    constructor(limitTime = 15) {
        this.log = logger;

        this.limiter = rateLimit({
            windowMs: limitTime * 60 * 1000,
            max: 100,
        });

        this.bindMethods();
    }

    private bindMethods() {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

        methods.forEach((method) => {
            const property = this[method as keyof this];

            if (typeof property === 'function' && method.startsWith('handle')) {
                this[method as keyof this] = property.bind(this);
            }
        });
    }

    protected sendResponse<T>(response: Response, data: T, status = 200) {
        return response.status(status).send(data);
    }

    protected handleError(response: Response, error: any, code = 400) {
        let statusCode: number;

        if (typeof error === 'object' && error.statusCode) {
            statusCode = error.statusCode;
        } else {
            statusCode = code;
        }

        return response.status(statusCode).send(error);
    }
}
