import express from 'express';

import Permissions from '../middleware/permissions';

const router = express.Router();

router.get('/', (_req, res, _next) => res.render('pages/wishcards'));

router.get('/single/:id', (_req, res, _next) => res.render('pages/wishcard/single'));

router.get('/donate/:id', Permissions.redirectLogin, (_req, res, _next) => res.render('pages/wishcard/donate'));

// ------------- only agencies and admins from here on -------------

router.get('/edit/:id', Permissions.isAdminOrAgency, (_req, res, _next) => res.render('pages/wishcard/edit'));

router.get('/manage', Permissions.isAdminOrAgency, (_req, res, _next) => res.render('pages/wishcard/manage'));

router.get('/create', Permissions.isAdminOrAgency, (_req, res, _next) => res.render('pages/wishcard/create'));

export default router;
