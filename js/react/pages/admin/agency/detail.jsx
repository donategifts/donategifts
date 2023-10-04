import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import MantineProviderWrapper from '../../../utils/mantineProviderWrapper.jsx';

export default function Detail({ agencyId }) {
	const basePath = '/api/admin';
	const [agency, setAgency] = useState({});

	useEffect(async () => {
		const result = await fetch(`${basePath}/agencyDetail/${agencyId}`);

		setAgency(await result.json());
	}, [agencyId]);

	return (
		<MantineProviderWrapper>
			<div>{agency.name}</div>
		</MantineProviderWrapper>
	);
}

Detail.propTypes = {
	agencyId: PropTypes.string.isRequired,
};
