import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

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
					<div
						className="card border-0 shadow m-3 mt-0 col-12 col-lg-5 col-xl-3"
						key={wishCard._id}
					>
						<img
							className="card-img-top rounded-0 rounded-top-3"
							src={wishCard.wishCardImage}
							alt={wishCard.wishItemName}
							loading="eager"
						/>
						<div className="card-body center-elements rounded-0 rounded-bottom-3">
							<div className="w-100">
								<h4 className="card-title text-center text-primary">
									My name is {wishCard.childFirstName}
								</h4>
								<div className="card-text">
									<p className="text-break">Wish: {wishCard.wishItemName}</p>
									<p>Item Price: ${wishCard.wishItemPrice}</p>
									<p className="text-break">Interest: {wishCard.childInterest}</p>
								</div>
								<div className="d-md-flex justify-content-center">
									<div className="col-12 mb-2 mb-md-0 col-md-6 me-0 me-md-1">
										<a
											className="btn btn-lg btn-primary w-100"
											href={`/wishcards/single/${wishCard._id}`}
										>
											View More
										</a>
									</div>
									<div className="col-12 col-md-6 ms-0 ms-md-1">
										{wishCard.status === 'donated' ? (
											<button className="btn btn-lg btn-dark disabled w-100">
												Donated
											</button>
										) : (
											<a
												className="btn btn-lg btn-dark w-100"
												{...attributes}
											>
												Donate
											</a>
										)}
									</div>
								</div>
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
		<div id="wishcards" className="bg-light p-4">
			<div className="container">
				<div className="d-flex flex-wrap justify-content-center align-items-stretch">
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
