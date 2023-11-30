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

import Footer from './components/Footer.jsx';
window.Footer = Footer;

import WishCards from './pages/wishCards.jsx';
window.WishCards = WishCards;

import WishCardsCarousel from './components/home/WishCardsCarousel.jsx';
window.WishCardsCarousel = WishCardsCarousel;

// pages
import Admin from './pages/admin/index.jsx';
window.Admin = Admin;

import WishCardCreate from './pages/wishcard/create.jsx';
window.WishCardCreate = WishCardCreate;

import WishCardManage from './pages/wishcard/manage.jsx';
window.WishCardManage = WishCardManage;

import WishcardsAdministration from './pages/admin/routes/wishcard/administration.jsx';
window.WishcardsAdministration = WishcardsAdministration;

import AgencyRegister from './pages/profile/agency/register.jsx';
window.AgencyRegister = AgencyRegister;

import DonationHistory from './pages/profile/donationhistory.jsx';
window.DonationHistory = DonationHistory;

import Terms from './pages/terms.jsx';
window.Terms = Terms;
