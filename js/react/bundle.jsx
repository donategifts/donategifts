/* eslint-disable import/first */
/* eslint-disable import/order */
import React from 'react';
import { createRoot } from 'react-dom/client';

window.ReactRoot = createRoot;
window.React = React;

// components
import Community from './pages/community.jsx';
window.Community = Community;

import Header from './components/Header.jsx';
window.Header = Header;

import Nav from './components/NavBar.jsx';
window.Nav = Nav;

import WishCards from './pages/wishCards.jsx';
window.WishCards = WishCards;

import WishCardsCarousel from './components/home/WishCardsCarousel.jsx';
window.WishCardsCarousel = WishCardsCarousel;

// pages
import Admin from './pages/admin/index.jsx';
window.Admin = Admin;

import WishCardCreate from './pages/wishcard/WishCardCreate.jsx';
window.WishCardCreate = WishCardCreate;

import WishCardManage from './pages/wishcard/WishCardManage.jsx';
window.WishCardManage = WishCardManage;

import WishcardsAdministration from './pages/admin/routes/wishcard/administration.jsx';
window.WishcardsAdministration = WishcardsAdministration;

import AgencyRegister from './pages/signup/AgencyRegister.jsx';
window.AgencyRegister = AgencyRegister;
