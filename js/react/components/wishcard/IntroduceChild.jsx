import { Button } from '@mantine/core';
import PropType from 'prop-types';
import React from 'react';

const IntroduceChild = ({ childId, childName, image, user, status }) => {
	const isDonated = status === 'donated';
	const buttonHref = user?._id ? `/wishcards/donate/${childId}` : '/login';
	const buttonColor = isDonated ? '#6c757d' : '#ff826b';

	return (
		<div className="col-md-4 col-lg-3 col-12 mt-4 p-4">
			<div className="card-body bg-white shadow-lg p-4 rounded-3 border border-1 text-center">
				<img
					className="img-fluid mt-2 rounded-3"
					src={image.src}
					alt={image.alt}
					loading="lazy"
				/>
				<h1 className="cool-font text-primary my-3">Hi, I am {childName}!</h1>
				<Button
					radius="md"
					className="w-sm-100"
					color={buttonColor}
					size="md"
					component="a"
					href={buttonHref}
					disabled={isDonated}
				>
					{isDonated ? 'Donated' : 'Donate Gift'}
				</Button>
			</div>
		</div>
	);
};

IntroduceChild.propTypes = {
	status: PropType.string,
	childName: PropType.string.isRequired,
	childId: PropType.string,
	user: PropType.object,
	image: PropType.shape({
		src: PropType.string,
		alt: PropType.string.isRequired,
	}),
};

export default IntroduceChild;
