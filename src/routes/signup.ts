import express from 'express';

import { database } from '../db/postgresconnection';
import AgenciesRepository from '../db/repository/postgres/AgenciesRepository';

const router = express.Router();

router.get('/', async (req, res, _next) => {
    if (req.session?.user) {
        const { role, id } = req.session.user;
        if (role === 'partner') {
            const agency = await new AgenciesRepository(database).getByAccountManagerId(id);

            if (!agency.is_verified) {
                return res.render('pages/signup/agencydata');
            }
        }

        return res.redirect('pages/profile');
    } else {
        return res.render('pages/signup/basecontact');
    }
});

export default router;
