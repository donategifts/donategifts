import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import LoadingCard from '../shared/LoadingCard.jsx';

function WishCards(props) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			console.log(props.wishCards.length);
		})();
	}, []);

	return (
		<div className="container">
			{isLoading && (
				<div className="d-md-flex flex-wrap justify-content-center align-items-center">
					{new Array(6).fill(0).map((_, index) => (
						<LoadingCard key={index} enableButtons={true} />
					))}
				</div>
			)}
			<></>
		</div>
	);
}

WishCards.propTypes = {
	wishCards: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			childFirstName: PropTypes.string.isRequired,
			childLastName: PropTypes.string.isRequired,
			childBirthday: PropTypes.instanceOf(Date),
			childInterest: PropTypes.string.isRequired,
			wishItemName: PropTypes.string.isRequired,
			wishItemPrice: PropTypes.number.isRequired,
			wishItemURL: PropTypes.string.isRequired,
			childStory: PropTypes.string.isRequired,
			wishCardImage: PropTypes.string.isRequired,
			createdBy: PropTypes.string.isRequired,
			createdAt: PropTypes.instanceOf(Date).isRequired,
			deliveryDate: PropTypes.instanceOf(Date).isRequired,
			occasion: PropTypes.string.isRequired,
			address: PropTypes.shape({
				address1: PropTypes.string.isRequired,
				address2: PropTypes.string.isRequired,
				city: PropTypes.string.isRequired,
				state: PropTypes.string.isRequired,
				country: PropTypes.string.isRequired,
				zipcode: PropTypes.string.isRequired,
			}),
			isLockedBy: PropTypes.string,
			isLockedUntil: PropTypes.instanceOf(Date),
			approvedByAdmin: PropTypes.boolean,
			status: PropTypes.string.isRequired,
			belongsTo: PropTypes.string.isRequired,
		}),
	),
};

export default WishCards;
