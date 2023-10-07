import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { chunkArray } from '../../utils/helpers';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';
import WishCard from '../shared/WishCard.jsx';

function WishCardsCarousel({ wishCards, user }) {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [chunkedWishCards, setChunkedWishCards] = useState(chunkArray(wishCards, 3));
	const [colStyle, setColStyle] = useState('col-4');

	const resizeWidth = () => {
		setWindowWidth(window.innerWidth);
	};

	useEffect(() => {
		if (windowWidth > 1400) {
			setChunkedWishCards(chunkArray(wishCards, 3));
			setColStyle('col-4');
		} else if (windowWidth < 1400 && windowWidth > 992) {
			setChunkedWishCards(chunkArray(wishCards, 2));
			setColStyle('col-6');
		}

		window.addEventListener('resize', resizeWidth);
		return () => window.removeEventListener('resize', resizeWidth);
	}, [windowWidth]);

	return (
		<MantineProviderWrapper>
			<div className="container my-5">
				<div className="d-none d-lg-flex justify-content-center">
					<button
						title="previous"
						className="btn btn-sm btn-light bg-transparent border-0 p-4"
						type="button"
						data-bs-target="#desktop-cards-carousel"
						data-bs-slide="prev"
					>
						<div className="fa-solid fa-chevron-left fa-2xl text-dark"></div>
					</button>
					<div
						className="carousel slide"
						id="desktop-cards-carousel"
						data-bs-ride="carousel"
					>
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
													className={`${colStyle} p-4`}
												>
													<WishCard
														wishCard={currentCard}
														attributes={{
															href: user?._id
																? `/wishcards/donate/${currentCard._id}`
																: '/login',
														}}
													/>
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>
					</div>
					<button
						title="next"
						className="btn btn-sm btn-light bg-transparent border-0 p-4"
						type="button"
						data-bs-target="#desktop-cards-carousel"
						data-bs-slide="next"
					>
						<div className="fa-solid fa-chevron-right fa-2xl text-dark"></div>
					</button>
				</div>
				<div className="d-flex justify-content-center d-lg-none">
					<div
						className="carousel slide"
						id="mobile-cards-carousel"
						data-bs-ride="carousel"
					>
						<div className="carousel-inner p-4">
							{wishCards?.map((currentCard, index) => (
								<div
									key={currentCard._id}
									className={`carousel-item ${index === 0 ? 'active' : ''}`}
									data-bs-interval="20000"
								>
									<div className="row justify-content-center">
										<div key={currentCard._id} className="col-12">
											<WishCard
												wishCard={currentCard}
												attributes={{
													href: user?._id
														? `/wishcards/donate/${currentCard._id}`
														: '/login',
												}}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

WishCardsCarousel.propTypes = {
	// we'll make this more specific once the db migration is complete
	wishCards: PropTypes.arrayOf(PropTypes.object),
	user: PropTypes.object,
};

export default WishCardsCarousel;
