import React from 'react';
import { createRoot } from 'react-dom/client';

import Community from './components/community/index.jsx';

window.ReactRoot = createRoot;
window.React = React;

window.Community = Community;
