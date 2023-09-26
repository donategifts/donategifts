import React from 'react';
import { createRoot } from 'react-dom/client';

import Community from './components/community/index.jsx';
import Header from './components/header/index.jsx';
import WishCardsCarousel from './components/home/WishCardsCarousel.jsx';
import Nav from './components/nav/index.jsx';
import WishCards from './components/wishcards/index.jsx';
import AgencyCardsPage from './pages/agencycards.jsx';

window.ReactRoot = createRoot;
window.React = React;

window.Header = Header;
window.Community = Community;
window.WishCards = WishCards;
window.WishCardsCarousel = WishCardsCarousel;
// window.Login = Login;
window.Nav = Nav;
window.AgencyCardsPage = AgencyCardsPage;
