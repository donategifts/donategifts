import axios from 'axios';
import React, { useState, useEffect } from 'react';

import CustomToast from '../../../../components/shared/CustomToast.jsx';

export default function Administration() {
	const [agenciesWithWishCards, setAgenciesWithWishCards] = useState({});
	const [error, setError] = useState('');

	axios.defaults.baseURL = '/api/admin';

	const handleUpdateWishcard = async (wishCardId) => {
		const newWishItemUrl = document.getElementById('newWishItemUrl' + wishCardId).value;
		try {
			await axios.put('/publishWishcards', { wishCardId, wishItemUr: newWishItemUrl });

			fetchAgencyWithWishCardsData();
		} catch (error) {
			setError(error?.message || 'Unable to publish wishcard');
		}
	};

	const fetchAgencyWithWishCardsData = async () => {
		try {
			const { data } = await axios.get('/publishWishcards');

			setAgenciesWithWishCards(data.data);
		} catch (error) {
			setError(error?.message || 'Could not fetch wishcards');
		}
	};

	useEffect(() => {
		fetchAgencyWithWishCardsData();
	}, []);

	return (
		<div>
			{error !== '' && <CustomToast title={error} />}
			<div id="profile-bg" className="background-color">
				<div className="profile-title">
					<div className="text-center fs-1">Wishcard admin panel11</div>
				</div>
			</div>
			<div className="wishcards background-color">
				<div className="container">
					{Object.keys(agenciesWithWishCards).map((key) => (
						<div key={key}>
							<h2 className="cray-font">Agency name: {key}</h2>
							<div className="row justify-content-center agency-card-container">
								{agenciesWithWishCards[key].map((card) => (
									<div key={card._id} className="col-lg-4 col-xs-12 mb-5 mt-4">
										<div className="card mb-3">
											<div className="view overlay">
												<img
													id="img-fix"
													className="card-img-top"
													src={card.wishCardImage}
													alt="Card image"
												/>
												<a href="#" className="mask rgba-white-slight"></a>
											</div>
											<div className="card-body card-details">
												<div className="card-text-container">
													<h3 className="card-title text-center">
														My name is
													</h3>
													<div className="quick-font">
														<p className="card-text">
															<span className="font-weight-bold">
																Status:
															</span>{' '}
															{card.status}
														</p>
														<p className="card-text">
															<span className="font-weight-bold">
																Age:
															</span>{' '}
															{card.age}
														</p>
														<p className="card-text">
															<span className="font-weight-bold">
																Wish:
															</span>{' '}
															{card.wishItemName.length > 25
																? card.wishItemName.substring(
																		0,
																		25,
																  ) + '...'
																: card.wishItemName}
														</p>
														<p className="card-text">
															<span className="font-weight-bold">
																Item Price:
															</span>{' '}
															${card.wishItemPrice}
														</p>
														<p>
															<span>Item Url:</span>{' '}
															<a
																id={'oldWishItemUrl' + card._id}
																href={card.wishItemURL}
															>
																Link
															</a>
														</p>
														<input
															id={'newWishItemUrl' + card._id}
															type="text"
															name="newWishItemUrl"
															placeholder="Url for wish item..."
														/>
														<button
															className="card-details-publish-button"
															type="button"
															id={'donate-btn-' + card._id}
															data-value-id={card._id}
															onClick={() => {
																handleUpdateWishcard(card._id);
															}}
														>
															Publish WishCard
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
