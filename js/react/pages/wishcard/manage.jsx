import { Tabs } from '@mantine/core';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

import AgencyCardEditForm from '../../components/forms/AgencyCardEditForm.jsx';
import SimpleModal from '../../components/shared/SimpleModal.jsx';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

const renderAgencyWishCards = ({ wishCards, emptyMessage, onClickEditWishcard }) => {
	return !wishCards || wishCards.length === 0 ? (
		<div className="mt-3 p-5 d-flex justify-content-center flex-column align-items-center">
			<h6 className="text-center mb-3">{emptyMessage}</h6>
			<div className="margin-auto">
				<a href="/wishcards/create" className="button-accent">
					Create Wish Cards
				</a>
			</div>
		</div>
	) : (
		<div className="row justify-content-center">
			{wishCards.map((card) => {
				const title = 'Name: ' + card.childFirstName;
				const status = 'Wish Card Status: ' + card.status;
				const wishItemName = 'Wish Item: ' + card.wishItemName;
				const price = 'Item Price: $' + card.wishItemPrice;
				const interest = 'Interest: ' + card.childInterest;

				const handleClickEditIcon = () => {
					onClickEditWishcard(card);
				};

				return (
					<div id="wishcards" className="col-lg-4 col-xs-12 mb-5 mt-4" key={card._id}>
						<div className="card border-0 shadow h-100 mb-1">
							<div className="view overlay">
								<img
									src={card.wishCardImage || card.childImage}
									alt="Card image"
									id="img-fix"
									className="card-img-top rounded-0 rounded-top-3"
								/>
								<a href="#"></a>
								<div className="mask rgba-white-slight"></div>
								<div
									onClick={handleClickEditIcon}
									className="btn btn-secondary fas fa-edit pointer position-absolute top-0 end-0 mt-2 me-2"
								></div>
							</div>
							<div className="card-body rounded-0 rounded-bottom-3">
								<div className="card-text-container">
									<p className="card-title">{title}</p>
									<div className="quick-font mb-1">
										<p className="card-text">
											<span className="font-weight-bold">{status}</span>
										</p>
									</div>
									<div className="quick-font mb-1">
										<p className="card-text">
											<span className="font-weight-bold truncate-ellipsis">
												{wishItemName}
											</span>
										</p>
									</div>
									<div className="quick-font mb-1">
										<p className="card-text">
											<span className="font-weight-bold">{price}</span>
										</p>
									</div>
									<div className="quick-font mb-1">
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

export default function WishCardManage() {
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
				wishItemName: submitData.wishItemName,
				wishItemPrice: submitData.wishItemPrice,
				childInterest: submitData.childInterest,
				childStory: submitData.childStory,
			});
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
				<div className="container pt-3">
					<Tabs color="#ff826b" radius="md" defaultValue="draft">
						<Tabs.List>
							<Tabs.Tab value="draft">Draft</Tabs.Tab>
							<Tabs.Tab value="published">Published</Tabs.Tab>
							<Tabs.Tab value="donated">Donated</Tabs.Tab>
						</Tabs.List>

						<Tabs.Panel value="draft">
							{renderAgencyWishCards({
								emptyMessage: 'You have 0 draft wish cards.',
								wishCards: agencyCards.draftWishcards,
								onClickEditWishcard: handleClickEditOnCard,
							})}
						</Tabs.Panel>

						<Tabs.Panel value="published">
							{renderAgencyWishCards({
								emptyMessage: 'You have 0 published wish cards.',
								wishCards: agencyCards.activeWishcards,
								onClickEditWishcard: handleClickEditOnCard,
							})}
						</Tabs.Panel>

						<Tabs.Panel value="donated">
							{renderAgencyWishCards({
								emptyMessage: 'You have 0 donated wish cards.',
								wishCards: agencyCards.inactiveWishcards,
								onClickEditWishcard: handleClickEditOnCard,
							})}
						</Tabs.Panel>
					</Tabs>
				</div>
				<SimpleModal
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
