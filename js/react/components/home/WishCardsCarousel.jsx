import PropTypes from 'prop-types';

import { chunkArray } from '../../utils/helpers.jsx';
import WishCard from '../shared/WishCard.jsx';

const WishCardsCarousel = ({ wishCards }) => {
	const chunkedWishCards = chunkArray(wishCards, 3);

	return (
		<div className="container my-5">
			<div className="d-none d-lg-flex">
				<button
					className="btn btn-sm btn-light bg-transparent border-0 p-4"
					type="button"
					data-bs-target="#sample-cards-carousel"
					data-bs-slide="prev"
				>
					<div className="fa-solid fa-chevron-left fa-2xl text-dark"></div>
				</button>
				<div className="carousel slide" id="sample-cards-carousel" data-bs-ride="carousel">
					<div className="carousel-inner">
						{chunkedWishCards?.map((chunk, index) => (
							<div
								key={index}
								className={`carousel-item ${index === 0 ? 'active' : ''}`}
								data-bs-interval="20000"
							>
								<div className="row justify-content-center">
									{chunk.map((currentCard) => {
										return (
											<div
												key={currentCard._id}
												className="col-12 col-lg-4 p-4 d-lg-flex align-content-stretch"
											>
												<WishCard wishCard={currentCard} />
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</div>
				<button
					className="btn btn-sm btn-light bg-transparent border-0 p-4"
					type="button"
					data-bs-target="#sample-cards-carousel"
					data-bs-slide="next"
				>
					<div className="fa-solid fa-chevron-right fa-2xl text-dark"></div>
				</button>
			</div>
			<div className="d-block d-lg-none">
				<div className="carousel slide" id="sample-cards-carousel" data-bs-ride="carousel">
					<div className="carousel-inner">
						{wishCards?.map((currentCard, index) => (
							<div
								key={currentCard._id}
								className={`carousel-item ${index === 0 ? 'active' : ''}`}
								data-bs-interval="20000"
							>
								<div className="row justify-content-center">
									<div
										key={currentCard._id}
										className="col-12 col-lg-4 p-4 d-lg-flex align-content-stretch"
									>
										<WishCard wishCard={currentCard} />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

WishCardsCarousel.propTypes = {
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

export default WishCardsCarousel;
