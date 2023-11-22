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

import WishCards from './pages/wishcards.jsx';
window.WishCards = WishCards;

import WishCardsCarousel from './components/home/WishCardsCarousel.jsx';
window.WishCardsCarousel = WishCardsCarousel;

// pages
import Admin from './pages/admin/index.jsx';
window.Admin = Admin;

import Create from './pages/wishcard/create.jsx';
window.Create = Create;

import Manage from './pages/wishcard/manage.jsx';
window.Manage = Manage;

import DonationHistory from './pages/profile/DonationHistory.jsx';
window.DonationHistory = DonationHistory;
