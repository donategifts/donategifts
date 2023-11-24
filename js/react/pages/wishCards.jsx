import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import LoadingCard from '../components/shared/LoadingCard.jsx';
import WishCard from '../components/shared/WishCard.jsx';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

const cardsPerPage = 24;

function WishCards({ wishCards, user }) {
	const [isLoading, setIsLoading] = useState(true);
	const [cards, setCards] = useState([]);
	const [numCardsToShow, setNumCardsToShow] = useState(cardsPerPage);

	useEffect(() => {
		setCards(
			wishCards.map((wishCard) => {
				let attributes = {};

				if (!user?._id) {
					attributes = {
						href: '/login',
					};
				} else {
					attributes = {
						href: `/wishcards/donate/${wishCard._id}`,
					};
				}

				return (
					<div key={wishCard._id} className="m-3 col-12 col-md-5 col-lg-4 col-xxl-3">
						<WishCard wishCard={wishCard} attributes={attributes} />
					</div>
				);
			}),
		);

		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	function handleLoadMore() {
		setNumCardsToShow(numCardsToShow + cardsPerPage);
	}

	return (
		<MantineProviderWrapper>
			<div id="wishcards" className="bg-light p-4">
				<div className="container">
					<div className="d-flex flex-wrap justify-content-center align-items-stretch">
						{isLoading ? (
							new Array(6)
								.fill(0)
								.map((_, index) => <LoadingCard key={index} enableButtons={true} />)
						) : (
							<>
								{cards.slice(0, numCardsToShow).map((card) => card)}
								{cards.length > cardsPerPage &&
									cards.length >= numCardsToShow + 1 && (
										<button
											className="w-50 mt-5 mb-3 button-modal-secondary"
											onClick={handleLoadMore}
										>
											Load More
										</button>
									)}
							</>
						)}
					</div>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

WishCards.propTypes = {
	user: PropTypes.shape({
		_id: PropTypes.string,
	}),
	wishCards: PropTypes.arrayOf(PropTypes.object),
};

export default WishCards;
