/* eslint-disable import/no-extraneous-dependencies */
import { createRoot } from 'react-dom/client';
import React from 'react';

import WishCards from './components/wishcards/Main.jsx';
import Community from './components/community/Main.jsx';

window.ReactRoot = createRoot;
window.React = React;

window.WishCards = WishCards;
window.Community = Community;
