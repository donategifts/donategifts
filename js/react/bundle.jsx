/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createRoot } from 'react-dom/client';

import Community from './components/community/Main.jsx';

window.ReactRoot = createRoot;
window.React = React;

window.Community = Community;
