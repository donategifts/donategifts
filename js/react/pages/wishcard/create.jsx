import { Switch, TextInput, Select, Textarea, FileButton, Button } from '@mantine/core';
import axios from 'axios';
import { useState, useEffect, useRef, useMemo } from 'react';

import AddressForm from '../../components/forms/AddressForm.jsx';
import CustomButton from '../../components/shared/CustomButton.jsx';
import CustomToast from '../../components/shared/CustomToast.jsx';
import PopOver from '../../components/shared/PopOver.jsx';
import Forms from '../../translations/en/forms.json';
import { BIRTH_YEAR, AMAZON_URL_REGEX, AMAZON_PRODUCT_REGEX } from '../../utils/constants';
import { validateImage } from '../../utils/helpers';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function WishCardCreate() {
	const currentFormTranslations = Forms.WISHCARD_FORM_INPUTS;

	const [childImage, setChildImage] = useState(null);
	const [itemImage, setItemImage] = useState(null);
	const [agencyAddress, setAgencyAddress] = useState({});
	const [isShippingDefault, setIsShippingDefault] = useState(true);
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [showSubmitLoader, setShowSubmitLoader] = useState(false);

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

	const [isToastVisible, setIsToastVisible] = useState(false);
	const [toastProps, setToastProps] = useState({
		message: '',
		type: '',
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

	const [shippingAddress, setShippingAddress] = useState({});

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
			setError(currentFormTranslations[fieldName].errors?.default);
			handleScroll(ref);
		} else if (sizeFn && sizeFn(fieldValue)) {
			setError(currentFormTranslations[fieldName].errors?.size);
			handleScroll(ref);
		} else if (validationFn && !validationFn(fieldValue)) {
			setError(currentFormTranslations[fieldName].errors?.validate);
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
		validateImage(setWishItemImageError, 'wishItemImage', formData, currentFormTranslations);
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
			(value) => +value < 1 || +value >= 50,
			(value) => !isNaN(value),
		);
		validateField(
			wishItemNameRef,
			setWishItemNameError,
			'wishItemName',
			(value) => value.length < 2 || value.length > 150,
		);
		validateImage(setChildImageError, 'childImage', formData, currentFormTranslations);
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

	const handleImage = (file, setImage, setError, fieldName) => {
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

	const handleNewShippingAddress = (field) => {
		setShippingAddress({
			...shippingAddress,
			[field.name]: field.value,
		});

		if (isFormSubmitted) {
			setIsFormSubmitted(false);
		}
	};

	const handleSubmit = () => {
		validateFormData();
		setIsFormSubmitted(true);
		if (isShippingDefault) {
			setFormData((data) => ({
				...data,
				...agencyAddress,
			}));
		} else {
			setFormData((data) => ({
				...data,
				...shippingAddress,
			}));
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

		setToastProps({ message: '', type: '' });
		setShowSubmitLoader(true);

		try {
			await axios.post('/api/wishcards', data, {
				headers: {
					'content-type': 'multipart/form-data',
				},
			});
			setToastProps({ message: 'Submission was successful!', type: 'success' });
			setIsToastVisible(true);
			clearForm();
			setTimeout(() => window.location.assign('/wishcards/manage'), 2000);
		} catch (error) {
			setToastProps({
				message:
					error?.response?.data?.error?.msg ||
					error?.message ||
					'Submission was unsuccessful. Please try again or contact us.',
				type: 'error',
			});
			setIsToastVisible(true);
			setShowSubmitLoader(false);
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
			<CustomToast
				message={toastProps.message}
				type={toastProps.type}
				isVisible={isToastVisible}
				setIsVisible={setIsToastVisible}
			/>
			<div id="wish-create-page" className="py-5">
				<div className="container">
					<h1 className="heading-primary mb-4 text-center">Create a wish card</h1>
					<div className="text-primary">
						<div className="card shadow-lg px-4 pt-1 pb-4">
							<div className="card-body">
								<div className="display-6 mt-3 mb-2">Information about child</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3">
										<TextInput
											ref={childFirstNameRef}
											size="md"
											name="childFirstName"
											label={currentFormTranslations.childFirstName?.label}
											error={childFirstNameError}
											required
											onChange={() => handleOnChange(setChildFirstNameError)}
										/>
										<TextInput
											ref={childInterestRef}
											size="md"
											mt="md"
											name="childInterest"
											label={currentFormTranslations.childInterest.label}
											error={childInterestError}
											required
											placeholder={
												currentFormTranslations.childInterest.placeholder
											}
											onChange={() => handleOnChange(setChildInterestError)}
										/>
										<Select
											ref={childBirthYearRef}
											size="md"
											mt="md"
											name="childBirthYear"
											label={currentFormTranslations.childBirthYear.label}
											error={childBirthYearError}
											aria-required
											searchable
											placeholder={
												currentFormTranslations.childBirthYear.placeholder
											}
											data={BIRTH_YEAR}
											required
											onChange={() => handleOnChange(setChildBirthYearError)}
										/>
									</div>
									<div className="uploader form-group py-4 col-sm-12 col-lg-6 col-md-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-start">
										<div className="px-3 pt-3 pb-0">
											<img
												src={childImage || '/img/img-placeholder.png'}
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
												{currentFormTranslations.childImage.label}
												<PopOver
													text={
														currentFormTranslations.childImage
															.popOverText
													}
												/>
											</label>
											<p className="form-text">
												{currentFormTranslations.childImage.instruction}
											</p>
											<FileButton
												onChange={handleChildImage}
												accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
												name="childImage"
												id="childImage"
												className="mb-2"
												required
											>
												{(props) => (
													<Button {...props}>
														<i className="fas fa-upload m-2 p-1"></i>
														<span className="upload-text">
															Upload Image
														</span>
													</Button>
												)}
											</FileButton>
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
										label={currentFormTranslations.childStory.label}
										error={childStoryError}
										placeholder={currentFormTranslations.childStory.placeholder}
										required
										onChange={() => handleOnChange(setChildStoryError)}
									/>
								</div>
								<div className="display-6 mt-5 mb-2">
									Information about wish item
								</div>
								<p className="form-text w-100 mb-0">
									Wish item MUST NOT be a gift card. If you need an inspiration:{' '}
									<span>
										<a
											target="_blank"
											href="https://www.amazon.com/s?k=gifts+for+kids+all+ages&crid=2438GIIO55T67&sprefix=gifts+for+kids+all+ages%2Caps%2C133&ref=nb_sb_noss_1"
											rel="noreferrer"
										>
											See Suggested Items
										</a>
									</span>
								</p>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3 mb-sm-4">
										<TextInput
											ref={wishItemNameRef}
											size="md"
											mt="md"
											name="wishItemName"
											label={currentFormTranslations.wishItemName.label}
											error={wishItemNameError}
											required
											onChange={() => handleOnChange(setWishItemNameError)}
										/>
										<TextInput
											ref={wishItemPriceRef}
											size="md"
											mt="md"
											name="wishItemPrice"
											label={currentFormTranslations.wishItemPrice.label}
											error={wishItemPriceError}
											required
											placeholder={
												currentFormTranslations.wishItemPrice.placeholder
											}
											onChange={() => handleOnChange(setWishItemPriceError)}
											leftSection={<i className="fas fa-dollar-sign"></i>}
											rightSection={
												<PopOver
													width={400}
													text={
														currentFormTranslations.wishItemPrice
															.popOverText
													}
												/>
											}
										/>
										<TextInput
											ref={wishItemInfoRef}
											size="md"
											mt="md"
											name="wishItemInfo"
											label={currentFormTranslations.wishItemInfo.label}
											error={wishItemInfoError}
											required
											placeholder={
												currentFormTranslations.wishItemInfo.placeholder
											}
											onChange={() => handleOnChange(setWishItemInfoError)}
										/>
									</div>
									<div className="uploader form-group py-4 col-sm-12 col-lg-6 col-md-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-center">
										<div className="px-3 pt-3 pb-0">
											<img
												src={itemImage || '/img/img-placeholder.png'}
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
												{currentFormTranslations.wishItemImage.label}
											</label>
											<p className="form-text">
												{currentFormTranslations.wishItemImage.instruction}
											</p>
											<FileButton
												onChange={handleItemImage}
												className="mt-4"
												name="wishItemImage"
												id="wishItemImage"
												accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
											>
												{(props) => (
													<Button {...props}>
														<i className="fas fa-upload m-2 p-1"></i>
														<span className="upload-text">
															Upload Image
														</span>
													</Button>
												)}
											</FileButton>
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
											label={currentFormTranslations.wishItemURL.label}
											error={wishItemURLError}
											required
											placeholder={
												currentFormTranslations.wishItemURL.placeholder
											}
											onChange={() => handleOnChange(setWishItemURLError)}
											leftSection={<i className="fas fa-link"></i>}
											rightSection={
												<PopOver
													width={400}
													position="top"
													text={
														currentFormTranslations.wishItemURL
															.popOverText
													}
													isImgProvided={true}
													imageSource="/img/amazon-helper.png"
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
											: `Ship this wish item to my agency (${
													agencyAddress?.address1
											  }, ${agencyAddress?.address2 || ''}, ${
													agencyAddress?.city
											  }, ${agencyAddress?.state} ${agencyAddress?.zipcode})`
									}
									onChange={handleShippingAddress}
								/>
								{!isShippingDefault && (
									<AddressForm onInputChange={handleNewShippingAddress} />
								)}
							</div>
						</div>
						<p className="mt-5 text-center">
							Wish card will be published once reviewed and approved by DonateGifts.
						</p>
						<div className="d-flex justify-content-center mt-2">
							<CustomButton
								size="lg"
								loading={showSubmitLoader}
								disabled={showSubmitLoader}
								onClick={handleSubmit}
								loader={{ type: 'dots', color: 'gray' }}
								text="Submit"
								additionalClass="button-accent"
							/>
						</div>
					</div>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

export default WishCardCreate;
