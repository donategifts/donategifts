import PropTypes from 'prop-types';
import { Fragment } from 'react';

import { chunkArray } from '../../utils/helpers.jsx';

const WishCardsCarousel = ({ wishCards }) => {
	const chunkedWishCards = chunkArray(wishCards, 3);

	return (
		<div className="container my-5">
			<div className="d-none d-lg-flex">
				<button
					className="btn btn-sm btn-light bg-transparent border-0 p-4"
					type="button"
					data-bs-target="#sample-cards-carousel"
					data-bs-slide="prev"
				>
					<div className="fa-solid fa-chevron-left fa-2xl text-dark"></div>
				</button>
				<div className="carousel slide" id="sample-cards-carousel" data-bs-ride="carousel">
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
												className="col-12 col-lg-4 p-4 d-lg-flex align-content-stretch"
											>
												<div className="card border-0 rounded-4 d-flex shadow">
													<img
														className="img-fluid rounded-0 rounded-top-4 card-img-top"
														src={currentCard.wishCardImage}
														alt="Card image"
													/>
													<div className="card-body d-lg-flex align-items-center rounded-0 rounded-bottom-4">
														<div className="row">
															<h3 className="text-center">
																My name is{' '}
																{currentCard.childFirstName}
															</h3>
															<p className="pb-0 mb-2">
																Wish:{' '}
																{currentCard.wishItemName.length >
																24
																	? currentCard.wishItemName.substring(
																			0,
																			23,
																	  ) + '...'
																	: currentCard.wishItemName}
															</p>
															<p className="wish-price pb-0 mb-2">
																Item Price: $
																{currentCard.wishItemPrice}
															</p>
															<p className="pb-0">
																Interest:{' '}
																{currentCard.childInterest.length >
																24
																	? currentCard.childInterest.substring(
																			0,
																			23,
																	  ) + '...'
																	: currentCard.childInterest}
															</p>
															<div className="d-lg-flex justify-content-center">
																<div className="col-12 col-lg-6 mb-2 mb-lg-0 me-lg-1">
																	<a
																		className="btn btn-lg btn-primary w-100"
																		href={`/wishcards/single/${currentCard._id}`}
																	>
																		View More
																	</a>
																</div>
																<div className="col-12 col-lg-6 ms-lg-1">
																	{currentCard.status ===
																	'donated' ? (
																		<button
																			className="btn btn-lg btn-dark w-100 disabled"
																			type="button"
																			disabled
																		>
																			Donated
																		</button>
																	) : (
																		<Fragment>
																			{/* {user ? (
																		<a
																			href={`/wishcards/donate/${currentCard._id}`}
																		>
																			<button
																				className="btn btn-lg btn-dark w-100"
																				type="button"
																			>
																				Donate Gift
																			</button>
																		</a>
																	) : (
																		<button
																			className="btn btn-lg btn-dark w-100"
																			type="button"
																			data-bs-toggle="modal"
																			data-bs-target="#loginModalCenter"
																		>
																			Donate Gift
																		</button>
																	)} */}
																			<button
																				className="btn btn-lg btn-dark w-100"
																				type="button"
																				data-bs-toggle="modal"
																				data-bs-target="#loginModalCenter"
																			>
																				Donate Gift
																			</button>
																		</Fragment>
																	)}
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</div>
				<button
					className="btn btn-sm btn-light bg-transparent border-0 p-4"
					type="button"
					data-bs-target="#sample-cards-carousel"
					data-bs-slide="next"
				>
					<div className="fa-solid fa-chevron-right fa-2xl text-dark"></div>
				</button>
			</div>
			<div className="d-block d-lg-none">
				<div className="carousel slide" id="sample-cards-carousel" data-bs-ride="carousel">
					<div className="carousel-inner">
						{wishCards?.map((currentCard, index) => (
							<div
								key={currentCard._id}
								className={`carousel-item ${index === 0 ? 'active' : ''}`}
								data-bs-interval="20000"
							>
								<div className="row justify-content-center">
									<div
										key={currentCard._id}
										className="col-12 col-lg-4 p-4 d-lg-flex align-content-stretch"
									>
										<div className="card border-0 rounded-4 d-flex shadow">
											<img
												className="img-fluid rounded-0 rounded-top-4 card-img-top"
												src={currentCard.wishCardImage}
												alt="Card image"
											/>
											<div className="card-body d-lg-flex align-items-center rounded-0 rounded-bottom-4">
												<div className="row">
													<h3 className="text-center">
														My name is {currentCard.childFirstName}
													</h3>
													<p className="pb-0 mb-2">
														Wish:{' '}
														{currentCard.wishItemName.length > 24
															? currentCard.wishItemName.substring(
																	0,
																	23,
															  ) + '...'
															: currentCard.wishItemName}
													</p>
													<p className="wish-price pb-0 mb-2">
														Item Price: ${currentCard.wishItemPrice}
													</p>
													<p className="pb-0">
														Interest:{' '}
														{currentCard.childInterest.length > 24
															? currentCard.childInterest.substring(
																	0,
																	23,
															  ) + '...'
															: currentCard.childInterest}
													</p>
													<div className="d-lg-flex justify-content-center">
														<div className="col-12 col-lg-6 mb-2 mb-lg-0 me-lg-1">
															<a
																className="btn btn-lg btn-primary w-100"
																href={`/wishcards/single/${currentCard._id}`}
															>
																View More
															</a>
														</div>
														<div className="col-12 col-lg-6 ms-lg-1">
															{currentCard.status === 'donated' ? (
																<button
																	className="btn btn-lg btn-dark w-100 disabled"
																	type="button"
																	disabled
																>
																	Donated
																</button>
															) : (
																<Fragment>
																	{/* {user ? (
																		<a
																			href={`/wishcards/donate/${currentCard._id}`}
																		>
																			<button
																				className="btn btn-lg btn-dark w-100"
																				type="button"
																			>
																				Donate Gift
																			</button>
																		</a>
																	) : (
																		<button
																			className="btn btn-lg btn-dark w-100"
																			type="button"
																			data-bs-toggle="modal"
																			data-bs-target="#loginModalCenter"
																		>
																			Donate Gift
																		</button>
																	)} */}
																	<button
																		className="btn btn-lg btn-dark w-100"
																		type="button"
																		data-bs-toggle="modal"
																		data-bs-target="#loginModalCenter"
																	>
																		Donate Gift
																	</button>
																</Fragment>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
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
			childInterest: PropTypes.string.isRequired,
			wishItemName: PropTypes.string.isRequired,
			wishItemPrice: PropTypes.number.isRequired,
			wishCardImage: PropTypes.string.isRequired,
		}),
	),
};

export default WishCardsCarousel;
