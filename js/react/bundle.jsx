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

import WishCardsCarousel from './components/home/WishCardsCarousel.jsx';
window.WishCardsCarousel = WishCardsCarousel;

// pages
import Admin from './pages/admin/index.jsx';
window.Admin = Admin;

import AgencyRegister from './pages/profile/agency/register.jsx';
window.AgencyRegister = AgencyRegister;

import Contact from './pages/contact.jsx';
window.Contact = Contact;

import DonationHistory from './pages/profile/donation.jsx';
window.DonationHistory = DonationHistory;

import Login from './pages/login.jsx';
window.Login = Login;

import PaymentSuccess from './pages/payment/success.jsx';
window.PaymentSuccess = PaymentSuccess;

import Signup from './pages/signup.jsx';
window.Signup = Signup;

import Terms from './pages/terms.jsx';
window.Terms = Terms;

import WishCardCreate from './pages/wishcard/create.jsx';
window.WishCardCreate = WishCardCreate;

import WishCardManage from './pages/wishcard/manage.jsx';
window.WishCardManage = WishCardManage;

import WishCardSingle from './pages/wishcard/single.jsx';
window.WishCardSingle = WishCardSingle;

import WishcardsAdministration from './pages/admin/routes/wishcard/administration.jsx';
window.WishcardsAdministration = WishcardsAdministration;

import WishCards from './pages/wishcards.jsx';
window.WishCards = WishCards;
