import PropType from 'prop-types';
import React from 'react';

import AgencyDetails from '../../components/wishcard/AgencyDetails.jsx';
import ChildDetails from '../../components/wishcard/ChildDetails.jsx';

const AboutChild = ({ childData, agencyData }) => (
	<div className="card-body bg-white p-4 mb-4 shadow-lg rounded-3 border border-1">
		<div className="row m-2">
			<ChildDetails {...childData} />
			<AgencyDetails {...agencyData} />
		</div>
	</div>
);

AboutChild.propTypes = {
	childData: PropType.shape({
		age: PropType.number,
		interest: PropType.string,
		story: PropType.string,
	}),
	agencyData: PropType.shape({
		name: PropType.string,
		address: PropType.string,
		phone: PropType.string,
		website: PropType.string,
		bio: PropType.string,
	}),
};

export default AboutChild;
