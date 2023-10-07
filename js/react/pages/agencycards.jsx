import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

import SimpleModal from '../components/shared/SimpleModal.jsx';
import AgencyCardEditForm from '../forms/AgencyCardEditForm.jsx';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

const renderAgencyWishCards = ({ wishCards, emptyMessage, onClickEditWishcard }) => {
	return !wishCards || wishCards.length === 0 ? (
		<h6 className="cool-font">{emptyMessage}</h6>
	) : (
		<div className="row justify-content-center">
			{wishCards.map((card) => {
				const title = 'My name is ' + card.childFirstName;
				const status = 'Status: ' + card.status;
				const wishItemName = 'Wish: ' + card.wishItemName;
				// (card.wishItemName.length > 25
				// 	? card.wishItemName.substring(0, 25) + '...'
				// 	: card.wishItemName);

				const price = 'Price: $' + card.wishItemPrice;
				const interest = 'Interest: ' + card.childInterest;
				// (card.childInterest.length > 30
				// 	? card.childInterest.substring(0, 30) + '...'
				// 	: card.childInterest);

				const handleClickEditIcon = () => {
					onClickEditWishcard(card);
				};
				return (
					<div className="col-lg-4 col-xs-12 mb-5 mt-4" key={card._id}>
						<div className="card mb-3">
							<div className="view overlay">
								<img
									src={card.wishCardImage}
									alt="Card image"
									id="img-fix"
									className="card-img-top"
								/>
								<a href="#"></a>
								<div className="mask rgba-white-slight"></div>
								<div
									onClick={handleClickEditIcon}
									className="btn btn-secondary fas fa-edit pointer position-absolute top-0 end-0 mt-2 me-2"
									// data-bs-toggle="modal"
									// data-bs-target="#wishcard-edit-modal"
								></div>
							</div>

							<div className="card-body">
								<div className="card-text-container">
									<h3 className="card-title text-center">{title}</h3>
									<div className="quick-font mb-3">
										<p className="card-text">
											<span className="font-weight-bold">{status}</span>
										</p>
									</div>
									<div className="quick-font mb-3">
										<p className="card-text">
											<span className="font-weight-bold truncate-ellipsis">
												{wishItemName}
											</span>
										</p>
									</div>
									<div className="quick-font mb-3">
										<p className="card-text">
											<span className="font-weight-bold">{price}</span>
										</p>
									</div>
									<div className="quick-font mb-3">
										<p className="card-text">
											<span className="font-weight-bold truncate-ellipsis">
												{interest}
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default function AgencyCardsPage() {
	const editFormRef = useRef();
	const [agencyCards, setAgencyCards] = useState({});
	const [cardOnEdit, setCardOnEdit] = useState(null);
	const [isOpenEditModal, setIsOpenEditModal] = useState(false);
	const [refetchWishCards, setRefetchWishCards] = useState(false);

	useEffect(() => {
		const fetchWishCards = () => {
			axios
				.get('/api/wishcards/agency')
				.then((res) => setAgencyCards(res.data.data))
				.catch(() =>
					new window.DG.Toast().show(
						'Could not fetch wishcards.',
						window.DG.Toast().styleMap.danger,
					),
				);
		};
		fetchWishCards();
	}, [refetchWishCards]);

	const handleClickEditOnCard = (card) => {
		setCardOnEdit(card);
		setIsOpenEditModal(true);
	};

	const handleCloseEditModal = () => {
		setCardOnEdit(null);
		setIsOpenEditModal(false);
	};

	const handleAgencyCardEditFormSubmit = async (submitData) => {
		try {
			await axios.put('/api/wishcards/agency', {
				wishCardId: cardOnEdit?._id,
				childFirstName: submitData.childFirstName,
				childLastName: submitData.childLastName,
				wishItemName: submitData.wishItemName,
				wishItemPrice: submitData.wishItemPrice,
				childInterest: submitData.childInterest,
				childStory: submitData.childStory,
			});
			``;

			setIsOpenEditModal(false);
			setRefetchWishCards((v) => !v); // trigger refetch agency wish cards
		} catch (error) {
			new window.DG.Toast().show(
				error?.response?.data?.error?.msg || error?.message || 'Unable to update wish card',
				window.DG.Toast.styleMap.danger,
			);
		}
	};

	const handleClickSave = () => {
		editFormRef.current?.submit();
	};

	return (
		<MantineProviderWrapper>
			<div className="wishcards">
				<div className="margin-auto d-flex justify-content-center">
					<a href="/wishcards/create" className="create-more">
						Create More Wish Cards
					</a>
				</div>
				<div className="container">
					<h3 className="cool-font">Draft Wishcards</h3>
					{renderAgencyWishCards({
						emptyMessage: 'No draft wishcards',
						wishCards: agencyCards.draftWishcards,
						onClickEditWishcard: handleClickEditOnCard,
					})}

					<h3 className="cool-font">Active Wishcards</h3>
					{renderAgencyWishCards({
						emptyMessage: 'You have 0 active wishcards',
						wishCards: agencyCards.activeWishcards,
						onClickEditWishcard: handleClickEditOnCard,
					})}

					<h3 className="cool-font">Inactive Wishcards</h3>
					{renderAgencyWishCards({
						emptyMessage: 'You have 0 inactive wishcards',
						wishCards: agencyCards.inactiveWishcards,
						onClickEditWishcard: handleClickEditOnCard,
					})}
				</div>
				<SimpleModal
					// modalId="wishcard-edit-modal"
					// ref={modalRef}
					title="Edit Wishcard"
					open={isOpenEditModal}
					hideOnClickOutside={false}
					onClose={handleCloseEditModal}
					body={
						<AgencyCardEditForm
							ref={editFormRef}
							key={cardOnEdit?._id}
							card={cardOnEdit}
							onSubmit={handleAgencyCardEditFormSubmit}
						/>
					}
					footer={
						<div className="col-12 col-md-4 my-2">
							<button
								className="btn btn-lg btn-primary w-100"
								onClick={handleClickSave}
							>
								Save
							</button>
						</div>
					}
				/>
			</div>
		</MantineProviderWrapper>
	);
}
