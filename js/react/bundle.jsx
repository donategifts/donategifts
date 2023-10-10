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
import Detail from './pages/admin/agency/detail.jsx';
window.AdminAgencyDetail = Detail;

import Overview from './pages/admin/agency/overview.jsx';
window.AdminAgencyOverview = Overview;

import WishCardCreate from './pages/wishcard/WishCardCreate.jsx';
window.WishCardCreate = WishCardCreate;

import WishCardManage from './pages/wishcard/WishCardManage.jsx';
window.WishCardManage = WishCardManage;

import WishcardsAdministrationPage from './pages/admin/wishcardsAdministrationPage.jsx';
window.WishcardsAdministrationPage = WishcardsAdministrationPage;
