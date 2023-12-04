import { Box, Button, Container, Input } from '@mantine/core';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import CustomToast from '../../../../components/shared/CustomToast.jsx';

export default function Administration() {
	const [agenciesWithWishCards, setAgenciesWithWishCards] = useState({});
	const [toastProps, setToastProps] = useState({
		message: '',
		type: '',
	});
	const [isToastVisible, setIsToastVisible] = useState(false);

	const handleUpdateWishcard = async (wishCardId) => {
		const newWishItemUrl = document.getElementById('newWishItemUrl' + wishCardId).value;

		try {
			await axios.put('/api/admin/publishWishcards', {
				wishCardId,
				wishItemURL: newWishItemUrl,
			});

			setToastProps({ message: 'Wishcard published successfully', type: 'success' });
			setIsToastVisible(true);
			await fetchAgencyWithWishCardsData();
		} catch (error) {
			setToastProps({
				message: error?.message || 'Unable to publish wishcard',
				type: 'error',
			});
			setIsToastVisible(true);
		}
	};

	const fetchAgencyWithWishCardsData = async () => {
		try {
			const { data } = await axios.get('/api/admin/publishWishcards');

			setAgenciesWithWishCards(data.data);
		} catch (error) {
			setToastProps({
				message: error?.message || 'Could not fetch wishcards',
				type: 'error',
			});
			setIsToastVisible(true);
		}
	};

	useEffect(() => {
		fetchAgencyWithWishCardsData().catch((error) => {
			setToastProps({
				message: error?.message || 'Could not fetch wishcards',
				type: 'error',
			});
			setIsToastVisible(true);
		});
	}, []);

	return (
		<div id="admin-page">
			<CustomToast
				message={toastProps.message}
				type={toastProps.type}
				isVisible={isToastVisible}
				setIsVisible={setIsToastVisible}
			/>
			<Container size="xl">
				{Object.keys(agenciesWithWishCards).map((key) => (
					<Box key={key}>
						<h2 className="pt-5">{key}</h2>
						<div className="row justify-content-center agency-cards">
							{agenciesWithWishCards[key].map((card) => (
								<div key={card._id} className="col-lg-4 col-xs-12 mb-5 mt-4">
									<div className="border-0 shadow h-100 bg-white">
										<img
											id="img-fix"
											className="card-img-top rounded-0 rounded-top-3"
											src={card.wishCardImage ?? card.childImage}
											alt={card.childFirstName}
											loading="lazy"
										/>
										<div className="card-body card-details py-2 px-3">
											<div className="card-text-container text-primary">
												<p>
													Child Name: <span>{card.childFirstName}</span>
												</p>
												<p>
													Child DOB:{' '}
													<span>
														{card.childBirthday ??
															`01/01/${card.childBirthYear}`}
													</span>
												</p>
												<p>
													Wish Item Price:{' '}
													<span>${card.wishItemPrice}</span>
												</p>
												<p>
													Wish Item Name: <span>{card.wishItemName}</span>
												</p>
												<p>
													Product ID:{' '}
													<span>{card.productID || 'unknown'}</span>
												</p>
												<p>
													Shipping Address:{' '}
													<span>
														{card.address
															? `${card.address?.address1} ${
																	card.address?.address2 ?? ''
															  } ${card.address.city} ${
																	card.address.state
															  } ${card.address.country}`
															: 'unknown'}
													</span>
												</p>
												{card.wishItemImage && (
													<p>
														Wish Item Image:{' '}
														<a
															target="_blank"
															href={card.wishItemImage}
															rel="noreferrer"
														>
															Check Item Image
														</a>
													</p>
												)}
												<p>
													Wish Item URL:{' '}
													<a
														id={'oldWishItemUrl' + card._id}
														target="_blank"
														href={card.wishItemURL}
														rel="noreferrer"
													>
														Check Submitted Link
													</a>
												</p>
												<Input
													id={'newWishItemUrl' + card._id}
													type="text"
													className="w-100"
													name="newWishItemUrl"
													placeholder="Replace wish item URL"
												/>
												<div className="d-flex justify-content-center mt-3">
													<Button
														color="orange"
														size="lg"
														id={'donate-btn-' + card._id}
														data-value-id={card._id}
														onClick={() => {
															handleUpdateWishcard(card._id);
														}}
													>
														Publish WishCard
													</Button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</Box>
				))}
			</Container>
		</div>
	);
}
