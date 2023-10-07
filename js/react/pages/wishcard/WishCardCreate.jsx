import { Switch, TextInput, Select, Textarea } from '@mantine/core';
import axios from 'axios';
import { useState, useEffect, useRef, useMemo } from 'react';

import PopOver from '../../components/shared/PopOver.jsx';
import AddressForm from '../../forms/AddressForm.jsx';
import { FORM_INPUT_MAP, BIRTH_YEAR } from '../../utils/constants';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function WishCardCreate() {
	const [childImage, setChildImage] = useState(null);
	const [itemImage, setItemImage] = useState(null);
	const [agencyAddress, setAgencyAddress] = useState({});
	const [isShippingDefault, setIsShippingDefault] = useState(true);
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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
		childImage: null,
		childStory: '',
		wishItemName: '',
		wishItemPrice: 0,
		wishItemInfo: '',
		wishItemURL: '',
		wishItemImage: null,
		address: {},
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
	const [wishItemImageError, setWishItemImageError] = useState('');

	useEffect(() => {
		const fetchAgencyAddress = () => {
			axios.get('/api/agency').then((res) => {
				setAgencyAddress(res.data?.data?.agencyAddress);
			});
		};
		fetchAgencyAddress();
	}, []);

	const validateImage = (img, setError, fieldName) => {
		if (!img) {
			setError(FORM_INPUT_MAP[fieldName].errors?.default);
		}
		//TODO: file type check
		//TODO: file size check
	};

	const validateField = (ref, setError, fieldName, sizeFn = null, validationFn = null) => {
		const fieldValue = ref.current?.value;
		const formDataKey = fieldName === 'childBirthYear' ? 'childBirthYear' : ref.current?.name;
		const formDataVal = fieldName === 'wishItemPrice' ? +fieldValue : fieldValue;

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
				[formDataKey]: formDataVal,
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
		validateField(
			childStoryRef,
			setChildStoryError,
			'childStory',
			(value) => value.length < 5 || value.length > 500,
		);
		validateField(
			wishItemNameRef,
			setWishItemNameError,
			'wishItemName',
			(value) => value.length < 2 || value.length > 150,
		);
		validateField(
			wishItemPriceRef,
			setWishItemPriceError,
			'wishItemPrice',
			(value) => +value < 1 || +value > 40,
			(value) => !isNaN(value),
		);
		validateField(
			wishItemInfoRef,
			setWishItemInfoError,
			'wishItemInfo',
			(value) => value.length < 2 || value.length > 250,
		);

		validateField(wishItemURLRef, setWishItemURLError, 'wishItemURL');
		//TODO: amazon check
		//TODO: product id check

		validateImage(childImage, setChildImageError, 'childImage');
		validateImage(itemImage, setWishItemImageError, 'wishItemImage');
	};

	const validationState = useMemo(
		() => ({
			childFirstNameError,
			childInterestError,
			childBirthYearError,
			childStoryError,
			wishItemNameError,
			wishItemPriceError,
			wishItemInfoError,
			wishItemURLError,
			childImageError,
			wishItemImageError,
		}),
		[
			childFirstNameError,
			childInterestError,
			childBirthYearError,
			childStoryError,
			wishItemNameError,
			wishItemPriceError,
			wishItemInfoError,
			wishItemURLError,
			childImageError,
			wishItemImageError,
		],
	);

	const handleImage = (e, setImage, setError, fieldName) => {
		const file = e.target.files[0];
		if (file) {
			setImage(URL.createObjectURL(file));
			setError('');
			setFormData((data) => ({
				...data,
				[fieldName]: file,
			}));
		}
	};

	const handleChildImage = (e) => {
		handleImage(e, setChildImage, setChildImageError, 'childImage');
	};

	const handleItemImage = (e) => {
		handleImage(e, setItemImage, setWishItemImageError, 'wishItemImage');
	};

	const handleOnChange = (setError) => {
		setError('');
		if (isFormSubmitted) {
			setIsFormSubmitted(false);
		}
	};

	const handleShippingAddress = (e) => {
		setIsShippingDefault(e.target.checked);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		validateFormData();
		setIsFormSubmitted(true);
		if (isShippingDefault) {
			setFormData((data) => ({
				...data,
				['address']: agencyAddress,
			}));
			//TODO: address not sending properly
		}
	};

	const handlePost = async () => {
		const data = new FormData();
		//need to append to FormData() because of the image file transfer
		data.append('childFirstName', formData.childFirstName);
		data.append('childInterest', formData.childInterest);
		data.append('childBirthYear', formData.childBirthYear);
		data.append('childImage', formData.childImage);
		data.append('childStory', formData.childStory);
		data.append('wishItemName', formData.wishItemName);
		data.append('wishItemPrice', formData.wishItemPrice);
		data.append('wishItemInfo', formData.wishItemInfo);
		data.append('wishItemURL', formData.wishItemURL);
		data.append('wishItemImage', formData.wishItemImage);
		data.append('address', formData.address);

		const toast = new window.DG.Toast();

		try {
			await axios.post('/api/wishcards', data, {
				headers: {
					'content-type': 'multipart/form-data',
				},
			});
			toast.show('Submission was successful!');
			// TODO: need to change the toast color to $success, also need to change mantine color scheme to match ours
		} catch (error) {
			toast.show(
				error?.response?.data?.error?.msg ||
					error?.message ||
					'Submission was unsuccessful. Please try again or contact us.',
				toast.styleMap.danger,
			);
		}
		//TODO: need to redirect to manage page
	};

	const clearForm = () => {
		//TODO: imgs not clearing
		setChildImage(null);
		setItemImage(null);
		childFirstNameRef.current.value = '';
		childInterestRef.current.value = '';
		childBirthYearRef.current.value = '';
		childStoryRef.current.value = '';
		wishItemNameRef.current.value = '';
		wishItemPriceRef.current.value = '';
		wishItemInfoRef.current.value = '';
		wishItemURLRef.current.value = '';
	};

	useEffect(() => {
		// Checking if all error state variables are empty using the validationState object
		const isValid = Object.values(validationState).every((error) => !error);

		if (isValid && isFormSubmitted) {
			handlePost();
			clearForm();
		}
	}, [validationState, isFormSubmitted]);

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
											onChange={() => handleOnChange(setChildFirstNameError)}
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
											onChange={() => handleOnChange(setChildInterestError)}
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
											onChange={() => handleOnChange(setChildBirthYearError)}
										/>
									</div>
									<div className="uploader form-group py-4 col-sm-12 col-lg-6 col-md-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-start">
										<div className="px-3 pt-3 pb-0">
											<img
												src={childImage || `/img/img-placeholder.png`}
												alt="image-placeholder"
												className={
													childImageError
														? 'img-fluid input-border-danger rounded'
														: 'img-fluid rounded'
												}
												id="childImagePreview"
											/>
											{childImageError && (
												<p className="text-danger font-weight-bold">
													{childImageError}
												</p>
											)}
										</div>
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
										onChange={() => handleOnChange(setChildStoryError)}
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
											onChange={() => handleOnChange(setWishItemNameError)}
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
											onChange={() => handleOnChange(setWishItemPriceError)}
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
											onChange={() => handleOnChange(setWishItemInfoError)}
										/>
									</div>
									<div className="uploader form-group py-4 col-sm-12 col-lg-6 col-md-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-center">
										<div className="px-3 pt-3 pb-0">
											<img
												src={itemImage || `/img/img-placeholder.png`}
												alt="wish-item-image-placeholder"
												className={
													wishItemImageError
														? 'img-fluid input-border-danger rounded'
														: 'img-fluid rounded'
												}
												id="wishImagePreview"
											/>
											{wishItemImageError && (
												<p className="text-danger font-weight-bold">
													{wishItemImageError}
												</p>
											)}
										</div>
										<div className="pt-3 px-3 d-flex flex-column justify-content-center align-items-stretch">
											<label htmlFor="wishItemImage" className="form-label">
												{FORM_INPUT_MAP.wishItemImage?.label}
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
											onChange={() => handleOnChange(setWishItemURLError)}
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
									label={
										!isShippingDefault
											? 'Ship this wish item to the below address'
											: `Ship this wish item to my agency (${agencyAddress?.address1}, ${agencyAddress?.address2}, ${agencyAddress?.city}, ${agencyAddress?.state} ${agencyAddress?.zipcode})`
									}
									onChange={handleShippingAddress}
								/>
								{!isShippingDefault && <AddressForm />}
								{/* TODO: need to collect address state after user fills out address form*/}
							</div>
						</div>
						<p className="mt-5 text-center">
							Wish card will be published once reviewed and approved by DonateGifts.
						</p>
						<div className="d-flex justify-content-center mt-2">
							<button
								id="submitInput"
								className="button-accent px-5"
								type="submit"
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
