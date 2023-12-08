import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import AdminLayout from '../../../layouts/admin.jsx';

import Detail from './agency/detail.jsx';
import Overview from './agency/overview.jsx';
import Donations from './donations.jsx';
import Administration from './wishcard/administration.jsx';
import WishcardDetail from './wishcard/wishcardDetail.jsx';

export const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <AdminLayout />,
			children: [
				{
					index: true,
					element: <Navigate to="/agency/overview" />,
				},
				{
					path: 'agency/:agencyId',
					element: <Detail />,
				},
				{
					path: 'agency/overview',
					element: <Overview />,
				},
				{
					path: 'wishcards/administration',
					element: <Administration />,
				},
				{
					path: 'donations',
					element: <Donations />,
				},
				{
					path: 'wishcards/:wishcardId',
					element: <WishcardDetail />,
				},
			],
			// TODO: create a 404 page
			errorElement: <div>404</div>,
		},
	],
	{
		basename: '/admin',
	},
);
