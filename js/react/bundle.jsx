/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createRoot } from 'react-dom/client';

import Community from './components/community/Main.jsx';
import WishCards from './components/wishcards/Main.jsx';

window.ReactRoot = createRoot;
window.React = React;

window.WishCards = WishCards;
window.Community = Community;
