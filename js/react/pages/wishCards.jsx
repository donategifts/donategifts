import { TextInput, Radio, Group, Checkbox } from '@mantine/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

//import CustomForm from '../components/forms/CustomForm.jsx';
import LoadingCard from '../components/shared/LoadingCard.jsx';
import WishCard from '../components/shared/WishCard.jsx';
//import FormTranslations from '../translations/en/forms.json';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

const cardsPerPage = 24;

function WishCards({ wishCards, user }) {
	const [isLoading, setIsLoading] = useState(true);
	const [cardData, setCardData] = useState(wishCards);
	const [cards, setCards] = useState([]);
	const [searchQueryParams, setSearchQueryParams] = useState({
		textInput: '',
		showDonated: 'yes',
		ageGroups: ['younger', 'older'],
	});
	const [numCardsToShow, setNumCardsToShow] = useState(cardsPerPage);

	useEffect(() => {
		setCards(mapwishCards);

		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [cardData]);

	function handleLoadMore() {
		setNumCardsToShow(numCardsToShow + cardsPerPage);
	}

	const mapwishCards = cardData.map((wishCard) => {
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
	});

	const handleSearchInputChange = (event) => {
		const target = event.target;
		const { value } = target;
		setSearchQueryParams({ ...searchQueryParams, textInput: value });
	};

	const handleSearchSubmit = async (event) => {
		event.preventDefault();
		const {
			data: { wishcards },
		} = await axios.post(
			'/wishcards/search/',
			{
				wishitem: searchQueryParams.textInput,
				showDonatedCheck: searchQueryParams.showDonated,
				younger: searchQueryParams.ageGroups.includes('younger') ? 'true' : null,
				older: searchQueryParams.ageGroups.includes('older') ? 'true' : null,
				recentlyAdded: 'true',
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		setCardData(wishcards);
	};

	return (
		<MantineProviderWrapper>
			<div id="wishcards" className="bg-light p-4">
				<div className="container d-flex flex-column">
					<div className="container-md">
						<form className="d-flex p-5 rounded-4 gap-2" onSubmit={handleSearchSubmit}>
							<div className="">
								<TextInput
									placeholder="Type your Query"
									value={searchQueryParams.textInput}
									onChange={handleSearchInputChange}
								></TextInput>
							</div>
							<button
								className="btn btn-md btn-primary d-flex justify-content-center"
								id="submit-btn"
								type="submit"
							>
								Submit
							</button>
							<Radio.Group
								name="donationStatus"
								label="Show donated cards?"
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
								defaultValue={['younger']}
								label="Select age group"
								value={searchQueryParams.ageGroups}
								onChange={(value) =>
									setSearchQueryParams({ ...searchQueryParams, ageGroups: value })
								}
							>
								<Group mt="xs">
									<Checkbox value="younger" label="0 - 15" />
									<Checkbox value="older" label="15+" />
								</Group>
							</Checkbox.Group>
						</form>
					</div>
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
