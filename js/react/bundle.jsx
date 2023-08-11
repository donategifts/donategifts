import React from 'react';
import { createRoot } from 'react-dom/client';

import Community from './components/community/index.jsx';
import Header from './components/header/index.jsx';
import WishCards from './components/wishcards/index.jsx';

window.ReactRoot = createRoot;
window.React = React;

window.Header = Header;
window.Community = Community;
window.WishCards = WishCards;
