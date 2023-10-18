import React from 'react';
import { RouterProvider } from 'react-router-dom';

import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

import { router } from './routes/router.jsx';

export default function Admin() {
	return (
		<MantineProviderWrapper>
			<React.StrictMode>
				<RouterProvider router={router} />
			</React.StrictMode>
		</MantineProviderWrapper>
	);
}
