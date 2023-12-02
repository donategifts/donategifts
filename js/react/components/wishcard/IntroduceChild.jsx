import { Button } from '@mantine/core';
import PropType from 'prop-types';

const IntroduceChild = ({ childId, childName, image, user, status }) => {
	const attributes = {
		href: user?._id ? `/wishcards/donate/${childId}` : '/login',
	};

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
				{status === 'donated' ? (
					<Button radius="md" className="w-sm-100" color="#6c757d " size="md" disabled>
						Donated
					</Button>
				) : (
					<Button
						radius="md"
						className="w-sm-100"
						color="#ff826b"
						size="md"
						component="a"
						{...attributes}
					>
						Donate Gift
					</Button>
				)}
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
