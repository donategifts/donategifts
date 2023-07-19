import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import LoadingCard from '../shared/LoadingCard.jsx';

function WishCards({ wishCards, user }) {
	const [isLoading, setIsLoading] = useState(true);
	const [cards, setCards] = useState([]);

	useEffect(() => {
		setCards(
			wishCards.map((wishCard) => {
				let attributes = {};

				if (!user._id) {
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
					<div className="card border-0 shadow" key={wishCard._id}>
						<img
							className="card-img-top img-fluid rounded-0 rounded-top-3"
							src={wishCard.wishCardImage}
							alt={wishCard.wishItemName}
							loading="eager"
						/>
						<div className="card-body bg-cream ounded-0 rounded-bottom-3">
							<h5 className="card-title text-center crayon-font">
								My name is {wishCard.childFirstName}
							</h5>
							<div className="card-text">
								<p>Wish: {wishCard.wishItemName}</p>
								<p>Item Price: ${wishCard.wishItemPrice}</p>
								<p>Interest: {wishCard.childInterest}</p>
							</div>
							<div className="d-md-flex justify-content-between">
								<a
									className="btn btn-lg btn-primary col-12 mb-2 mb-md-0 col-md-5"
									href={`/wishcards/single/${wishCard._id}`}
								>
									View More
								</a>
								{wishCard.status === 'donated' ? (
									<button className="btn btn-lg btn-dark disabled col-12 col-md-5">
										Donated
									</button>
								) : (
									<a
										className="btn btn-lg btn-dark col-12 col-md-6"
										{...attributes}
									>
										Donate
									</a>
								)}
							</div>
						</div>
					</div>
				);
			}),
		);

		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
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
			{!isLoading && (
				<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 800: 2, 1000: 3 }}>
					<Masonry gutter="2rem">{cards.map((card) => card)}</Masonry>
				</ResponsiveMasonry>
			)}
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
