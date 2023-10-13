import { Switch, TextInput, Select, Textarea } from '@mantine/core';
import axios from 'axios';
import { useState, useEffect, useRef, useMemo } from 'react';

import { WISHCARD_FORM_INPUTS } from '../../../../translations/translations';
import PopOver from '../../components/shared/PopOver.jsx';
import AddressForm from '../../forms/AddressForm.jsx';
import { BIRTH_YEAR, AMAZON_URL_REGEX, AMAZON_PRODUCT_REGEX } from '../../utils/constants';
import { validateImage } from '../../utils/helpers';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function WishCardCreate() {
	const currFormMap = WISHCARD_FORM_INPUTS;

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
		address1: '',
		address2: '',
		city: '',
		state: '',
		country: '',
		zipcode: '',
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

	const validateField = (ref, setError, fieldName, sizeFn = null, validationFn = null) => {
		const fieldValue = ref.current?.value;
		const formDataKey = fieldName === 'childBirthYear' ? 'childBirthYear' : ref.current?.name;
		const formDataVal = fieldName === 'wishItemPrice' ? +fieldValue : fieldValue;

		if (!fieldValue || !fieldValue.length) {
			setError(currFormMap[fieldName].errors?.default);
			handleScroll(ref);
		} else if (sizeFn && sizeFn(fieldValue)) {
			setError(currFormMap[fieldName].errors?.size);
			handleScroll(ref);
		} else if (validationFn && !validationFn(fieldValue)) {
			setError(currFormMap[fieldName].errors?.validate);
			handleScroll(ref);
		} else {
			setError('');
			setFormData((data) => ({
				...data,
				[formDataKey]: formDataVal,
			}));
		}
	};

	const validateFormData = () => {
		//bottom to top order due to auto scroll/focus in case of multiple errors
		validateImage(setWishItemImageError, 'wishItemImage', formData, currFormMap);
		validateField(
			wishItemURLRef,
			setWishItemURLError,
			'wishItemURL',
			null,
			(value) => AMAZON_URL_REGEX.test(value) && AMAZON_PRODUCT_REGEX.test(value),
		);
		validateField(
			wishItemInfoRef,
			setWishItemInfoError,
			'wishItemInfo',
			(value) => value.length < 2 || value.length > 250,
		);
		validateField(
			wishItemPriceRef,
			setWishItemPriceError,
			'wishItemPrice',
			(value) => +value < 1 || +value > 40,
			(value) => !isNaN(value),
		);
		validateField(
			wishItemNameRef,
			setWishItemNameError,
			'wishItemName',
			(value) => value.length < 2 || value.length > 150,
		);
		validateImage(setChildImageError, 'childImage', formData, currFormMap);
		validateField(
			childStoryRef,
			setChildStoryError,
			'childStory',
			(value) => value.length < 5 || value.length > 500,
		);
		validateField(childBirthYearRef, setChildBirthYearError, 'childBirthYear');
		validateField(
			childInterestRef,
			setChildInterestError,
			'childInterest',
			(value) => value.length < 2 || value.length > 250,
		);
		validateField(
			childFirstNameRef,
			setChildFirstNameError,
			'childFirstName',
			(value) => value.length < 2 || value.length > 250,
			(value) => /^[ A-Za-z-_']*$/.test(value),
		);
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

	const handleScroll = (ref) => {
		window?.scrollTo({
			top: ref.offsetTop,
			left: 0,
			behavior: 'smooth',
		});
		ref.current.focus();
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
				...agencyAddress,
			}));
			//TODO: need to add logic for manually typed address
		}
	};

	const clearForm = () => {
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
		data.append('address1', formData.address1);
		data.append('address2', formData.address2);
		data.append('city', formData.city);
		data.append('state', formData.state);
		data.append('country', formData.country);
		data.append('zipcode', formData.zipcode);

		const toast = new window.DG.Toast();

		try {
			await axios.post('/api/wishcards', data, {
				headers: {
					'content-type': 'multipart/form-data',
				},
			});
			toast.show('Submission was successful!');
			clearForm();
			setTimeout(() => window.location.replace('/wishcards/manage'), 1000);
		} catch (error) {
			toast.show(
				error?.response?.data?.error?.msg ||
					error?.message ||
					'Submission was unsuccessful. Please try again or contact us.',
				toast.styleMap.danger,
			);
		}
	};

	useEffect(() => {
		// Checking if all error state variables are empty using the validationState object
		const isValid = Object.values(validationState).every((error) => !error);

		if (isValid && isFormSubmitted) {
			handlePost();
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
								<div className="display-6 mt-3 mb-3">Information about child</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3">
										<TextInput
											ref={childFirstNameRef}
											size="md"
											name="childFirstName"
											label={currFormMap.childFirstName?.label}
											error={childFirstNameError}
											required
											onChange={() => handleOnChange(setChildFirstNameError)}
										/>
										<TextInput
											ref={childInterestRef}
											size="md"
											mt="md"
											name="childInterest"
											label={currFormMap.childInterest?.label}
											error={childInterestError}
											required
											placeholder={currFormMap.childInterest?.placeholder}
											onChange={() => handleOnChange(setChildInterestError)}
										/>
										<Select
											ref={childBirthYearRef}
											size="md"
											mt="md"
											name="childBirthYear"
											label={currFormMap.childBirthYear?.label}
											error={childBirthYearError}
											aria-required
											searchable
											placeholder={currFormMap.childBirthYear?.placeholder}
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
											/>
											{childImageError && (
												<p className="text-danger font-weight-bold">
													{childImageError}
												</p>
											)}
										</div>
										<div className="p-3">
											<label htmlFor="childImage" className="form-label">
												{currFormMap.childImage?.label}
												<PopOver
													text={currFormMap.childImage?.popOverText}
												/>
											</label>
											<p className="form-text">
												{currFormMap.childImage.instruction}
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
										label={currFormMap.childStory.label}
										error={childStoryError}
										placeholder={currFormMap.childStory.placeholder}
										required
										onChange={() => handleOnChange(setChildStoryError)}
									/>
								</div>
								<div className="display-6 mt-5 mb-4">
									Information about wish item
								</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3 mb-sm-4">
										<TextInput
											ref={wishItemNameRef}
											size="md"
											mt="md"
											name="wishItemName"
											label={currFormMap.wishItemName?.label}
											error={wishItemNameError}
											required
											onChange={() => handleOnChange(setWishItemNameError)}
										/>
										<TextInput
											ref={wishItemPriceRef}
											size="md"
											mt="md"
											name="wishItemPrice"
											label={currFormMap.wishItemPrice?.label}
											error={wishItemPriceError}
											required
											placeholder={currFormMap.wishItemPrice?.placeholder}
											onChange={() => handleOnChange(setWishItemPriceError)}
											leftSection={<i className="fas fa-dollar-sign"></i>}
											rightSection={
												<PopOver
													width={400}
													text={currFormMap.wishItemPrice?.popOverText}
												/>
											}
										/>
										<TextInput
											ref={wishItemInfoRef}
											size="md"
											mt="md"
											name="wishItemInfo"
											label={currFormMap.wishItemInfo?.label}
											error={wishItemInfoError}
											required
											placeholder={currFormMap.wishItemInfo?.placeholder}
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
											/>
											{wishItemImageError && (
												<p className="text-danger font-weight-bold">
													{wishItemImageError}
												</p>
											)}
										</div>
										<div className="pt-3 px-3 d-flex flex-column justify-content-center align-items-stretch">
											<label htmlFor="wishItemImage" className="form-label">
												{currFormMap.wishItemImage?.label}
											</label>
											<p className="form-text">
												{currFormMap.wishItemImage?.instruction}
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
											label={currFormMap.wishItemURL?.label}
											error={wishItemURLError}
											required
											placeholder={currFormMap.wishItemURL?.placeholder}
											onChange={() => handleOnChange(setWishItemURLError)}
											leftSection={<i className="fas fa-link"></i>}
											rightSection={
												<PopOver
													width={400}
													position="top"
													text={currFormMap.wishItemURL?.popOverText}
													isImgProvided={true}
													imgSrc="/img/amazon-helper.png"
												/>
											}
										/>
									</div>
								</div>
								<div className="display-6 mt-5 mb-4">
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
