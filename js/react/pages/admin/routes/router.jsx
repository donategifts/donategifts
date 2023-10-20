import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import AdminLayout from '../../../layouts/admin.jsx';

import Detail from './agency/detail.jsx';
import Overview from './agency/overview.jsx';
import Administration from './wishcard/administration.jsx';

export const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <AdminLayout />,
			children: [
				{
					path: '/',
					// TODO: create a dashboard page
					element: <div>Dashboard</div>,
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
			],
			// TODO: create a 404 page
			errorElement: <div>404</div>,
		},
	],
	{
		basename: '/admin',
	},
);
