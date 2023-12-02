import PropType from 'prop-types';
import React from 'react';

const ChildDetails = React.memo(({ firstName, ...otherProps }) => {
	const defaultValues = {
		age: 'Not Provided',
		interest: 'Not Provided',
		story: 'Not Provided',
	};

	return (
		<div className="col-md-6 col-lg-6 col-12">
			<div className="display-6 text-primary my-4">About {firstName}</div>
			{Object.keys(otherProps).map((key) => (
				<p key={key}>
					<span className="fw-bold">
						My {key.charAt(0).toUpperCase() + key.slice(1)}:
					</span>
					<span className="mx-2">{otherProps[key] || defaultValues[key]}</span>
				</p>
			))}
		</div>
	);
});

ChildDetails.displayName = 'ChildDetails';
ChildDetails.propTypes = {
	firstName: PropType.string.isRequired,
	age: PropType.number,
	interest: PropType.string,
	story: PropType.string,
};

export default ChildDetails;
