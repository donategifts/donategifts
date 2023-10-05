import { Switch, TextInput, Select, Textarea } from '@mantine/core';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

import PopOver from '../components/shared/PopOver.jsx';
import AddressForm from '../forms/AddressForm.jsx';
import { FORM_INPUT_MAP, BIRTH_YEAR } from '../utils/constants';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

function WishCardCreate() {
	const [childImage, setChildImage] = useState(null);
	const [itemImage, setItemImage] = useState(null);
	const [agencyAddress, setAgencyAddress] = useState({});
	const [isShippingDefault, setIsShippingDefault] = useState(true);

	const childFirstNameRef = useRef();
	const childInterestRef = useRef();
	const childBirthYearRef = useRef();
	const childStoryRef = useRef();
	const wishItemNameRef = useRef();
	const wishItemPriceRef = useRef();
	const wishItemInfoRef = useRef();
	const wishItemURLRef = useRef();

	const [formData, setFormData] = useState({
		childFirstName: '',
		childInterest: '',
		childBirthYear: '',
		childImage: '',
		childStory: '',
		wishItemName: '',
		wishItemPrice: '',
		wishItemInfo: '',
		wishItemURL: '',
		wishItemImage: '',
	});

	const [childFirstNameError, setChildFirstNameError] = useState('');
	const [childInterestError, setChildInterestError] = useState('');
	const [childBirthYearError, setChildBirthYearError] = useState('');
	const [childImageError, setChildImageError] = useState('');
	const [childStoryError, setChildStoryError] = useState('');

	const [wishItemNameError, setWishItemNameError] = useState('');
	const [wishItemPriceError, setWishItemPriceError] = useState('');
	const [wishItemInfoError, setWishItemInfoError] = useState('');
	const [wishItemURLError, setWishItemURLError] = useState('');

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
		setChildImageError('');
	};

	const handleItemImage = (e) => {
		setItemImage(URL.createObjectURL(e.target.files[0]));
	};

	const handleShippingAddress = (e) => {
		setIsShippingDefault(e.target.checked);
	};

	const validateField = (ref, setError, fieldName, sizeFn = null, validationFn = null) => {
		const fieldValue = ref.current?.value;

		if (!fieldValue || !fieldValue.length) {
			setError(FORM_INPUT_MAP[fieldName].errors?.default);
			ref.current.focus();
		} else if (sizeFn && sizeFn(fieldValue)) {
			setError(FORM_INPUT_MAP[fieldName].errors?.size);
			ref.current.focus();
		} else if (validationFn && !validationFn(fieldValue)) {
			setError(FORM_INPUT_MAP[fieldName].errors?.validate);
			ref.current.focus();
		} else {
			setError('');
			setFormData((data) => ({
				...data,
				[ref.current.name]: fieldValue,
			}));
		}
	};

	const validateChildImage = () => {
		if (!childImage) {
			setChildImageError(FORM_INPUT_MAP.childImage.errors?.default);
		} else {
			setChildImageError('');
			setFormData((data) => ({
				...data,
				['childImage']: childImage,
			}));
		}
	};

	const validateFormData = () => {
		validateField(
			childFirstNameRef,
			setChildFirstNameError,
			'childFirstName',
			(value) => value.length < 2 || value.length > 250,
			(value) => /^[ A-Za-z-_']*$/.test(value),
		);
		validateField(
			childInterestRef,
			setChildInterestError,
			'childInterest',
			(value) => value.length < 2 || value.length > 250,
		);
		validateField(childBirthYearRef, setChildBirthYearError, 'childBirthYear');
		validateField(childStoryRef, setChildStoryError, 'childStory');
		validateField(wishItemNameRef, setWishItemNameError, 'wishItemName');
		validateField(wishItemPriceRef, setWishItemPriceError, 'wishItemPrice');
		validateField(wishItemInfoRef, setWishItemInfoError, 'wishItemInfo');
		validateField(wishItemURLRef, setWishItemURLError, 'wishItemURL');
		validateChildImage();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		validateFormData();
		console.log(formData);
		// try {
		// 	await axios.post('/api/wishcards')
		// }
	};

	return (
		<MantineProviderWrapper>
			<div id="wish-create-page" className="py-5">
				<div className="container">
					<h1 className="heading-primary mb-4 text-center">Create a wish card</h1>
					<form className="text-primary">
						<div className="card shadow-lg px-4 pt-1 pb-4">
							<div className="card-body">
								<div className="display-6 mt-3 mb-sm-4 mb-md-0 mb-lg-0">
									Information about child
								</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3">
										<TextInput
											ref={childFirstNameRef}
											size="md"
											name="childFirstName"
											label={FORM_INPUT_MAP.childFirstName?.label}
											error={childFirstNameError}
											required
											onChange={() => setChildFirstNameError('')}
										/>
										<TextInput
											ref={childInterestRef}
											size="md"
											mt="md"
											name="childInterest"
											label={FORM_INPUT_MAP.childInterest?.label}
											error={childInterestError}
											required
											placeholder={FORM_INPUT_MAP.childInterest?.placeholder}
											onChange={() => setChildInterestError('')}
										/>
										<Select
											ref={childBirthYearRef}
											size="md"
											mt="md"
											name="childBirthYear"
											label={FORM_INPUT_MAP.childBirthYear?.label}
											error={childBirthYearError}
											aria-required
											searchable
											placeholder={FORM_INPUT_MAP.childBirthYear?.placeholder}
											data={BIRTH_YEAR}
											required
											onChange={() => setChildBirthYearError('')}
										/>
									</div>
									<div className="uploader form-group py-4 col-sm-12 col-lg-6 col-md-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-start">
										<div className="p-3">
											<label htmlFor="childImage" className="form-label">
												{FORM_INPUT_MAP.childImage?.label}
												<PopOver
													text={FORM_INPUT_MAP.childImage?.popOverText}
												/>
											</label>
											<p className="form-text">
												{FORM_INPUT_MAP.childImage.instruction}
											</p>
											<input
												type="file"
												name="childImage"
												id="childImage"
												className="form-control mb-2"
												onChange={handleChildImage}
												required
											/>
										</div>
										<div className="p-3">
											<img
												src={childImage || `/img/img-placeholder.png`}
												alt="image-placeholder"
												className={
													childImageError
														? 'img-fluid input-border-danger'
														: 'img-fluid'
												}
												id="childImagePreview"
											/>
											{childImageError && (
												<p className="text-danger font-weight-bold">
													{childImageError}
												</p>
											)}
										</div>
									</div>
								</div>
								<div className="row px-1">
									<Textarea
										size="md"
										rows={3}
										mt="md"
										name="childStory"
										ref={childStoryRef}
										label={FORM_INPUT_MAP.childStory.label}
										error={childStoryError}
										placeholder={FORM_INPUT_MAP.childStory.placeholder}
										required
										onChange={() => setChildStoryError('')}
									/>
								</div>
								<div className="display-6 mt-5 mb-sm-4 mb-md-0 mb-lg-0">
									Information about wish item
								</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3 mb-sm-4">
										<TextInput
											ref={wishItemNameRef}
											size="md"
											mt="md"
											name="wishItemName"
											label={FORM_INPUT_MAP.wishItemName?.label}
											error={wishItemNameError}
											required
											onChange={() => setWishItemNameError('')}
										/>
										<TextInput
											ref={wishItemPriceRef}
											size="md"
											mt="md"
											name="wishItemPrice"
											label={FORM_INPUT_MAP.wishItemPrice?.label}
											error={wishItemPriceError}
											required
											placeholder={FORM_INPUT_MAP.wishItemPrice?.placeholder}
											onChange={() => setWishItemPriceError('')}
											leftSection={<i className="fas fa-dollar-sign"></i>}
											rightSection={
												<PopOver
													width={400}
													text={FORM_INPUT_MAP.wishItemPrice?.popOverText}
												/>
											}
										/>
										<TextInput
											ref={wishItemInfoRef}
											size="md"
											mt="md"
											name="wishItemInfo"
											label={FORM_INPUT_MAP.wishItemInfo?.label}
											error={wishItemInfoError}
											required
											placeholder={FORM_INPUT_MAP.wishItemInfo?.placeholder}
											onChange={() => setWishItemInfoError('')}
											rightSection={
												<PopOver
													text={FORM_INPUT_MAP.wishItemInfo?.popOverText}
												/>
											}
										/>
									</div>
									<div className="uploader form-group py-4 col-sm-12 col-lg-6 col-md-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-center">
										<div className="pt-3 px-3 d-flex flex-column justify-content-center align-items-stretch">
											<label htmlFor="wishItemImage" className="form-label">
												{FORM_INPUT_MAP.wishItemImage?.label}
												<PopOver
													text={FORM_INPUT_MAP.wishItemImage?.popOverText}
												/>
											</label>
											<p className="form-text">
												{FORM_INPUT_MAP.wishItemImage?.instruction}
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
												alt="wish-item-image"
												className="img-fluid"
											/>
										</div>
									</div>
								</div>
								<div className="row px-1">
									<div className="col-12">
										<TextInput
											ref={wishItemURLRef}
											size="md"
											mt="md"
											name="wishItemURL"
											label={FORM_INPUT_MAP.wishItemURL?.label}
											error={wishItemURLError}
											required
											placeholder={FORM_INPUT_MAP.wishItemURL?.placeholder}
											onChange={() => setWishItemURLError('')}
											leftSection={<i className="fas fa-link"></i>}
											rightSection={
												<PopOver
													width={400}
													position="top"
													text={FORM_INPUT_MAP.wishItemURL?.popOverText}
													isImgProvided={true}
													imgSrc="/img/amazon-helper.png"
												/>
											}
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
								{!isShippingDefault && <AddressForm />}
							</div>
						</div>
						<p className="mt-5 text-center">
							Wish card will be published once reviewed and approved by DonateGifts.
						</p>
						<div className="d-flex justify-content-center mt-2">
							<button
								id="submitInput"
								className="button-accent px-5"
								onClick={handleSubmit}
							>
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
