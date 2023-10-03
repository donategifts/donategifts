import { Switch } from '@mantine/core';
import axios from 'axios';
import { useState, useEffect } from 'react';

import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

function WishCardCreate() {
	const [childImage, setChildImage] = useState(null);
	const [itemImage, setItemImage] = useState(null);
	const [agencyAddress, setAgencyAddress] = useState({});
	const [isShippingDefault, setIsShippingDefault] = useState(true);

	useEffect(() => {
		const fetchAgencyAddress = () => {
			axios.get('/api/agency').then((res) => {
				setAgencyAddress(res.data?.data?.agencyAddress);
			});
		};
		fetchAgencyAddress();
	}, []);

	const handleChildImage = (e) => {
		setChildImage(URL.createObjectURL(e.target.files[0]));
	};

	const handleItemImage = (e) => {
		setItemImage(URL.createObjectURL(e.target.files[0]));
	};

	const handleShippingAddress = (e) => {
		e.target.checked ? setIsShippingDefault(true) : setIsShippingDefault(false);
	};

	return (
		<MantineProviderWrapper>
			<div id="wish-create-page" className="py-5">
				<div className="container">
					<h1 className="heading-primary mb-4 text-center">Create a wish card</h1>
					<form action="" className="text-primary">
						<div className="card shadow-lg p-4">
							<div className="card-body">
								<div className="display-6 mb-sm-4 mb-md-0 mb-lg-0">
									Information about child
								</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3">
										<label htmlFor="childFirstName" className="form-label">
											Child&apos;s first name
										</label>
										<input
											type="text"
											name="childFirstName"
											id="childFirstName"
											className="form-control mb-4"
										/>
										<label htmlFor="childInterest" className="form-label">
											Child&apos;s interest
										</label>
										<input
											type="text"
											name="childInterest"
											id="childInterest"
											placeholder="write something they like to do"
											className="form-control mb-4"
										/>
										<label htmlFor="childBirthYear" className="form-label">
											Child&apos;s birth year
										</label>
										<input
											type="number"
											name="childBirthYear"
											id="childBirthYear"
											className="form-control"
											min={1994}
											max={2024}
										/>
									</div>
									<div className="uploader form-group py-4 col-sm-12 col-lg-6 col-md-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-start">
										<div className="p-3">
											<label
												htmlFor="childImagePreview"
												className="form-label"
											>
												Upload child&apos;s picture
												<i className="fa fa-question-circle ms-1"></i>
											</label>
											<p className="form-text">
												You must use an image that is representative of the
												child (Also allowed: masked faces, cropped or
												blurred features, art or something they made)
											</p>
											<input
												type="file"
												name="childImage"
												id="childImage"
												className="form-control mb-2"
												onChange={handleChildImage}
											/>
										</div>
										<div className="p-3">
											<img
												src={childImage || `/img/img-placeholder.png`}
												alt="image-placeholder"
												className="img-fluid"
												id="childImagePreview"
											/>
										</div>
									</div>
								</div>
								<label htmlFor="wishItemURL" className="form-label">
									Share the child&apos;s story
									<i className="fa fa-question-circle ms-1"></i>
								</label>
								<textarea
									name=""
									id=""
									rows={4}
									className="form-control"
									placeholder="(e.g. what is their story? why do they want this item?)"
								/>
								<div className="display-6 mt-5 mb-sm-4 mb-md-0 mb-lg-0">
									Information about wish item
								</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3">
										<label htmlFor="wishItemName" className="form-label">
											Wish item name
										</label>
										<input
											type="text"
											name="wishItemName"
											id="wishItemName"
											className="form-control mb-4"
										/>
										<label htmlFor="wishItemPrice" className="form-label">
											Wish item price
											<i className="fa fa-question-circle ms-1"></i>
										</label>
										<input
											type="number"
											name="wishItemPrice"
											id="wishItemPrice"
											placeholder="price must be under $40"
											className="form-control mb-4"
											min={1}
											max={40}
										/>
										<label htmlFor="wishItemDesc" className="form-label">
											Wish item description
											<i className="fa fa-question-circle ms-1"></i>
										</label>
										<input
											type="text"
											name="wishItemDesc"
											id="wishItemDesc"
											className="form-control"
											placeholder="share product details"
										/>
									</div>
									<div className="uploader form-group py-4 col-sm-12 col-lg-6 col-md-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-center">
										<div className="pt-3 px-3">
											<label
												htmlFor="wishItemImagePreview"
												className="form-label"
											>
												Upload wish item picture
												<i className="fa fa-question-circle ms-1"></i>
											</label>
											<p className="form-text">
												You must use an image that is representative of the
												wish item product
											</p>
											<input
												type="file"
												name="wishItemImage"
												id="wishItemImage"
												className="form-control mt-4"
												onChange={handleItemImage}
											/>
										</div>
										<div className="p-3">
											<img
												src={itemImage || `/img/img-placeholder.png`}
												alt="image-placeholder"
												className="img-fluid"
												id="wishItemImagePreview"
											/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<label htmlFor="wishItemURL" className="form-label">
											Wish item Amazon URL
											<i className="fa fa-question-circle ms-1"></i>
										</label>
										<input
											type="text"
											name=""
											id=""
											className="form-control"
											placeholder="product page link starting with https://www.amazon..."
										/>
									</div>
								</div>
								<div className="display-6 mt-5 mb-3">
									Information about shipping address
								</div>
								<Switch
									defaultChecked
									size="md"
									color="#ff826b"
									label={`Ship this wish item to my agency (${agencyAddress?.address1}, ${agencyAddress?.address2}, ${agencyAddress?.city}, ${agencyAddress?.state} ${agencyAddress?.zipcode})`}
									onChange={handleShippingAddress}
								/>
								{!isShippingDefault && (
									<>
										<div className="row mt-3">
											<div className="col-12 col-md-4">
												<label htmlFor="address1" className="form-label">
													Address Line 1
												</label>
												<input
													type="text"
													name="address1"
													id="address1"
													className="form-control"
												/>
											</div>
											<div className="col-12 col-md-4">
												<label htmlFor="address2" className="form-label">
													Address Line 2
												</label>
												<input
													type="text"
													name="address2"
													id="address2"
													className="form-control"
												/>
											</div>
											<div className="col-12 col-md-4">
												<label htmlFor="city" className="form-label">
													City
												</label>
												<input
													type="text"
													name="city"
													id="city"
													className="form-control"
												/>
											</div>
										</div>
										<div className="row mt-3">
											<div className="col-12 col-md-4">
												<label htmlFor="state" className="form-label">
													State
												</label>
												<input
													type="text"
													name="state"
													id="state"
													className="form-control"
												/>
											</div>
											<div className="col-12 col-md-4">
												<label htmlFor="zipcode" className="form-label">
													Zipcode
												</label>
												<input
													type="text"
													name="zipcode"
													id="zipcode"
													className="form-control"
												/>
											</div>
											<div className="col-12 col-md-4">
												<label htmlFor="country" className="form-label">
													Country
												</label>
												<input
													type="text"
													name="country"
													id="country"
													className="form-control"
												/>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
						<p className="mt-5 text-center">
							Wish card will be published once reviewed and approved by DonateGifts.
						</p>
						<div className="d-flex justify-content-center mt-2">
							<button id="submitInput" className="button-accent px-5">
								<span>Submit</span>
								<div
									className="spinner-border spinner-border-sm text-white ms-1 d-none"
									role="status"
								>
									<span className="visually-hidden">Loading...</span>
								</div>
							</button>
						</div>
					</form>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

export default WishCardCreate;
