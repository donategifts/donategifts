import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import LoadingCard from '../shared/LoadingCard.jsx';
import WishCard from '../shared/WishCard.jsx';

function WishCards({ wishCards, user }) {
	const [isLoading, setIsLoading] = useState(true);
	const [cards, setCards] = useState([]);

	useEffect(() => {
		setCards(
			wishCards.map((wishCard) => {
				let attributes = {};

				if (!user?._id) {
					attributes = {
						'data-bs-toggle': 'modal',
						'data-bs-target': '#loginModalCenter',
					};
				} else {
					attributes = {
						href: `/wishcards/donate/${wishCard._id}`,
					};
				}

				return (
					<div key={wishCard._id} className="m-3 mt-0 col-12 col-lg-5 col-xl-3">
						<WishCard wishCard={wishCard} attributes={attributes} />;
					</div>
				);
			}),
		);

		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	return (
		<div id="wishcards" className="bg-light p-4">
			<div className="container">
				<div className="d-flex flex-wrap justify-content-center align-items-center">
					{isLoading
						? new Array(6)
								.fill(0)
								.map((_, index) => <LoadingCard key={index} enableButtons={true} />)
						: cards.map((card) => card)}
				</div>
			</div>
		</div>
	);
}

WishCards.propTypes = {
	user: PropTypes.shape({
		_id: PropTypes.string,
	}),
	wishCards: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			childFirstName: PropTypes.string.isRequired,
			childLastName: PropTypes.string.isRequired,
			childBirthday: PropTypes.string,
			childInterest: PropTypes.string.isRequired,
			wishItemName: PropTypes.string.isRequired,
			wishItemPrice: PropTypes.number.isRequired,
			wishItemURL: PropTypes.string.isRequired,
			childStory: PropTypes.string.isRequired,
			wishCardImage: PropTypes.string.isRequired,
			createdBy: PropTypes.string.isRequired,
			createdAt: PropTypes.string.isRequired,
			deliveryDate: PropTypes.string.isRequired,
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
			isLockedUntil: PropTypes.string,
			approvedByAdmin: PropTypes.bool,
			status: PropTypes.string.isRequired,
			belongsTo: PropTypes.string.isRequired,
		}),
	),
};

export default WishCards;
