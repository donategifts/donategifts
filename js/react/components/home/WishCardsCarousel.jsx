import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { chunkArray } from '../../utils/helpers.jsx';
import WishCard from '../shared/WishCard.jsx';

const WishCardsCarousel = ({ wishCards }) => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [chunkedWishCards, setChunkedWishCards] = useState(chunkArray(wishCards, 3));
	const [colStyle, setColStyle] = useState('col-4');

	let resizeWidth = () => {
		setWindowWidth(window.innerWidth);
	};

	useEffect(() => {
		if (windowWidth > 1170) {
			setChunkedWishCards(chunkArray(wishCards, 3));
			setColStyle('col-4');
		} else if (windowWidth < 1170 && windowWidth > 820) {
			setChunkedWishCards(chunkArray(wishCards, 2));
			setColStyle('col-6');
		} else {
			setChunkedWishCards(chunkArray(wishCards, 1));
			setColStyle('col-12');
		}
		setWindowWidth(window.innerWidth);
		window.addEventListener('resize', resizeWidth);
		return () => window.removeEventListener('resize', resizeWidth);
	}, [windowWidth]);

	return (
		<div className="container-fluid my-5">
			<div className="d-flex m-0 justify-content-center">
				{windowWidth > 560 && (
					<button
						className="btn btn-sm btn-light bg-transparent border-0 p-4"
						type="button"
						data-bs-target="#sample-cards-carousel"
						data-bs-slide="prev"
						aria-label="left-arrow-button"
					>
						<div className="fa-solid fa-chevron-left fa-2xl text-dark"></div>
					</button>
				)}
				<div className="carousel slide" id="sample-cards-carousel" data-bs-ride="carousel">
					<div className="carousel-inner">
						{chunkedWishCards.map((chunk, index) => (
							<div
								key={index}
								className={`carousel-item ${index === 0 ? 'active' : ''}`}
								data-bs-interval="20000"
							>
								<div className="row justify-content-center align-items-stretch">
									{chunk.map((currentCard) => {
										return (
											<div
												key={currentCard._id}
												className={`${colStyle} px-4`}
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
				{windowWidth > 560 && (
					<button
						className="btn btn-sm btn-light bg-transparent border-0 p-4"
						type="button"
						data-bs-target="#sample-cards-carousel"
						data-bs-slide="next"
						aria-label="right-arrow-button"
					>
						<div className="fa-solid fa-chevron-right fa-2xl text-dark"></div>
					</button>
				)}
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
