import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import LoadingCard from '../shared/LoadingCard.jsx';

function WishCards({ wishCards }) {
	const [isLoading, setIsLoading] = useState(true);
	const [cards, setCards] = useState([]);

	useEffect(() => {
		setCards(
			wishCards.map((wishCard) => (
				<div className="col-12 col-md-4" key={wishCard._id}>
					<div className="card border-0 shadow my-3">
						<img
							className="card-img-top img-fluid rounded-0 rounded-top-3"
							src={wishCard.wishCardImage}
							alt={wishCard.wishItemName}
							loading="lazy"
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
							<div className="d-md-flex">
								<button className="btn btn-primary col-12 mb-2 mb-md-0 col-md-6 me-md-1">
									View More
								</button>
								{wishCard.status === 'donated' ? (
									<button className="btn btn-dark disabled col-12 col-md-6 ms-md-1">
										Donated
									</button>
								) : (
									<button className="btn btn-dark col-12 col-md-6 ms-md-1">
										Donate
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)),
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
			<div className="d-md-flex flex-wrap justify-content-center align-items-center">
				{!isLoading && cards.map((card) => card)}
			</div>
		</div>
	);
}

WishCards.propTypes = {
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
			approvedByAdmin: PropTypes.boolean,
			status: PropTypes.string.isRequired,
			belongsTo: PropTypes.string.isRequired,
		}),
	),
};

export default WishCards;
