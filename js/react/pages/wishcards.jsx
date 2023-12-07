import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

import LoadingCard from '../components/shared/LoadingCard.jsx';
import WishCard from '../components/shared/WishCard.jsx';
import SearchBar from '../components/wishcards/SearchBar.jsx';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

const cardsPerPage = 24;

function WishCards({ wishCards, user, agencies }) {
	const [isLoading, setIsLoading] = useState(true);
	const [cardData, setCardData] = useState(wishCards);
	const searchTextRef = useRef('');
	const [searchQueryParams, setSearchQueryParams] = useState({
		showDonated: 'yes',
		ageGroups: [],
		agencyFilter: '',
		sortOrder: [],
		priceSlider: [],
		priceSortOrder: '',
	});
	const [numCardsToShow, setNumCardsToShow] = useState(cardsPerPage);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [cardData]);

	useEffect(() => {
		fetchSearchResults();
	}, [searchQueryParams]);

	function handleLoadMore() {
		setNumCardsToShow(numCardsToShow + cardsPerPage);
	}

	const mapwishCard = (wishCard) => {
		return (
			<div key={wishCard._id} className="m-3 col-12 col-md-5 col-lg-4 col-xxl-3">
				<WishCard
					wishCard={wishCard}
					attributes={
						!user?._id
							? { href: `/login?redirect=${wishCard._id}` }
							: { href: `/wishcards/donate/${wishCard._id}` }
					}
				/>
			</div>
		);
	};

	const fetchSearchResults = async (checkSearchLength = false) => {
		if (
			checkSearchLength &&
			searchTextRef.current.value !== '' &&
			searchTextRef.current.value.length < 4
		) {
			return;
		}

		const {
			data: { wishcards },
		} = await axios.post('/wishcards/search/', {
			wishitem: searchTextRef.current.value,
			showDonatedCheck: searchQueryParams.showDonated,
			younger: searchQueryParams.ageGroups.includes('younger') ? 'true' : null,
			older: searchQueryParams.ageGroups.includes('older') ? 'true' : null,
			recentlyAdded: searchQueryParams.sortOrder.includes('1') ? 1 : 0,
			agencyFilter: searchQueryParams.agencyFilter
				? agencies.find((agency) => agency.agencyName == searchQueryParams.agencyFilter)._id
				: null,
			priceSlider:
				searchQueryParams.priceSlider.length > 0 ? searchQueryParams.priceSlider : [],
			priceSortOrder:
				searchQueryParams.priceSortOrder !== '' ? searchQueryParams.priceSortOrder : null,
		});
		setCardData(wishcards);
	};

	return (
		<MantineProviderWrapper>
			<div id="wishcards" className="bg-light p-4">
				<div className="container d-flex flex-column">
					{!isLoading && (
						<SearchBar
							searchTextRef={searchTextRef}
							fetchSearchResults={fetchSearchResults}
							searchQueryParams={searchQueryParams}
							setSearchQueryParams={setSearchQueryParams}
							agencies={agencies}
						/>
					)}
					<div className="d-flex flex-wrap justify-content-center align-items-stretch">
						{cardData.length == 0 ? (
							<h2 className="mt-3">{'No results found'}</h2>
						) : null}
						{isLoading ? (
							new Array(6)
								.fill(0)
								.map((_, index) => <LoadingCard key={index} enableButtons={true} />)
						) : (
							<>
								{cardData.slice(0, numCardsToShow).map((card) => mapwishCard(card))}
								{cardData.length > cardsPerPage &&
									cardData.length >= numCardsToShow + 1 && (
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
	agencies: PropTypes.arrayOf(PropTypes.object),
};

export default WishCards;
