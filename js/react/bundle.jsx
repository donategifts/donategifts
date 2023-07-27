import React from 'react';
import { createRoot } from 'react-dom/client';

import Community from './components/community/index.jsx';
import WishCards from './components/wishcards/index.jsx';

window.ReactRoot = createRoot;
window.React = React;

window.Community = Community;
window.WishCards = WishCards;
