import React from 'react';
import { createRoot } from 'react-dom/client';

import Community from './components/community/index.jsx';
// TBD import Login when nav is converted to react component in order to control the open/close modal state
// import Login from './components/login/index.jsx';
import Nav from './components/nav/index.jsx';
import WishCards from './components/wishcards/index.jsx';

window.ReactRoot = createRoot;
window.React = React;

window.Community = Community;
window.WishCards = WishCards;
// window.Login = Login;
window.Nav = Nav;
