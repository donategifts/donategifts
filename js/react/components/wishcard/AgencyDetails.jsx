import PropType from 'prop-types';
import React from 'react';

const AgencyDetailItem = ({ iconClass, children }) => (
	<p>
		<i className={`fas ${iconClass} text-secondary me-2`}></i>
		{children}
	</p>
);

const AgencyDetails = ({ name, address, phone, website, bio }) => (
	<div className="col-md-6 col-lg-6 col-12">
		<div className="display-6 text-primary my-4">Care Agency</div>
		{name && <AgencyDetailItem iconClass="fa-building">{name}</AgencyDetailItem>}
		{address && <AgencyDetailItem iconClass="fa-map-marker-alt">{address}</AgencyDetailItem>}
		{phone && <AgencyDetailItem iconClass="fa-phone-alt">{phone}</AgencyDetailItem>}
		{website && (
			<AgencyDetailItem iconClass="fa-link">
				<a
					className="text-decoration-none"
					href={website}
					target="_blank"
					rel="noopener noreferrer"
				>
					{website}
				</a>
			</AgencyDetailItem>
		)}
		{bio && <AgencyDetailItem iconClass="fa-address-card">{bio}</AgencyDetailItem>}
	</div>
);

AgencyDetails.propTypes = {
	name: PropType.string,
	address: PropType.string,
	phone: PropType.string,
	website: PropType.string,
	bio: PropType.string,
};

AgencyDetailItem.propTypes = {
	iconClass: PropType.string.isRequired,
	children: PropType.node.isRequired,
};

export default React.memo(AgencyDetails);
