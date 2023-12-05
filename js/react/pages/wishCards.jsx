import { TextInput, Radio, Group, Checkbox, Select, Switch } from '@mantine/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

import LoadingCard from '../components/shared/LoadingCard.jsx';
import WishCard from '../components/shared/WishCard.jsx';
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

	const handleSearchSubmit = async (event) => {
		event.preventDefault();
		await fetchSearchResults();
	};

	const fetchSearchResults = async () => {
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
		});
		setCardData(wishcards);
	};

	return (
		<MantineProviderWrapper>
			<div id="wishcards" className="bg-light p-4">
				<div className="container d-flex flex-column">
					<div className="d-flex justify-content-center">
						<form className="p-4 rounded-2 bg-white" onSubmit={handleSearchSubmit}>
							<div className="d-flex flex-wrap gap-3 mb-2">
								<TextInput
									placeholder="Search"
									ref={searchTextRef}
									size="xl"
									aria-label="Search"
								></TextInput>
								<button
									className="col btn btn-primary d-flex align-self-center p-3 me-2"
									id="submit-btn"
									type="submit"
									aria-label="search button"
								>
									Submit
								</button>
								<div className="d-flex flex-wrap gap-3">
									<Radio.Group
										name="donationStatus"
										label="Show donated cards"
										value={searchQueryParams.showDonated}
										onChange={(value) =>
											setSearchQueryParams({
												...searchQueryParams,
												showDonated: value,
											})
										}
									>
										<Group mt="xs">
											<Radio value="yes" label="Yes" />
											<Radio value="no" label="No" />
										</Group>
									</Radio.Group>
									<Checkbox.Group
										label="Filter by age group"
										value={searchQueryParams.ageGroups}
										onChange={(value) =>
											setSearchQueryParams({
												...searchQueryParams,
												ageGroups: value,
											})
										}
									>
										<Group mt="xs">
											<Checkbox value="younger" label="0 - 15" />
											<Checkbox value="older" label="15+" />
										</Group>
									</Checkbox.Group>
									<Select
										label="Filter by agency"
										data={agencies.map((agency) => agency.agencyName)}
										value={searchQueryParams.agencyFilter}
										onChange={(value) =>
											setSearchQueryParams({
												...searchQueryParams,
												agencyFilter: value,
											})
										}
										clearable
										searchable
									/>
									<Switch.Group
										label="Sort by most recent"
										value={searchQueryParams.sortOrder}
										onChange={(value) =>
											setSearchQueryParams({
												...searchQueryParams,
												sortOrder: value,
											})
										}
									>
										<Group mt="xs">
											<Switch value="1" aria-label="Most Recent" />
										</Group>
									</Switch.Group>
								</div>
							</div>
						</form>
					</div>
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
