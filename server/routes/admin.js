const express = require('express');

const AdminHandler = require('../handler/admin');
const MiddleWare = require('../middleware');

const router = express.Router();

const adminHandler = new AdminHandler();

router.get('/', MiddleWare.checkAdminPermission, adminHandler.handleGetIndex);

router.put('/', MiddleWare.checkAdminPermission, adminHandler.handlePutIndex);

router.get('/single/:wishCardId', MiddleWare.checkAdminPermission, adminHandler.handleGetWishCard);
