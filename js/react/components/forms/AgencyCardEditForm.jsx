import { Button, FileButton, Image } from '@mantine/core';
import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';

import Forms from '../../translations/en/forms.json';

const noScroll = (event) => event.target.blur();

const AgencyCardEditForm = forwardRef(({ card, onSubmit }, ref) => {
	const formRef = useRef();
	const [formFields, setFormFields] = useState({
		childFirstName: card?.childFirstName ?? '',
		wishItemName: card?.wishItemName ?? '',
		wishItemPrice: card?.wishItemPrice ?? '',
		childInterest: card?.childInterest ?? '',
		childStory: card?.childStory ?? '',
		childImage: card?.childImage,
		wishItemImage: card?.wishItemImage,
	});
	const [childImage, setChildImage] = useState(card?.childImage ?? '/img/img-placeholder.png');
	const [wishItemImage, setWishItemImage] = useState(
		card?.wishItemImage ?? '/img/img-placeholder.png',
	);
	const [childImageChanged, setChildImageChanged] = useState(false);
	const [wishItemImageChanged, setWishItemImageChanged] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [flexDirection, setFlexDirection] = useState('flex-row');

	const currentFormTranslations = Forms.WISHCARD_FORM_INPUTS;

	const resizeWidth = () => {
		setWindowWidth(window.innerWidth);
	};

	useEffect(() => {
		if (windowWidth > 576) {
			setFlexDirection('flex-row');
		} else {
			setFlexDirection('flex-column');
		}

		window.addEventListener('resize', resizeWidth);

		return () => window.removeEventListener('resize', resizeWidth);
	}, [windowWidth]);

	const isDirty = useRef(false);

	const handleInputChange = (event) => {
		const target = event.target;
		const { name, value } = target;

		setFormFields({
			...formFields,
			[name]: value,
		});
		isDirty.current = true;
	};

	const handleImage = (file, setImage, fieldName) => {
		if (file) {
			setImage(URL.createObjectURL(file));
			setFormFields((data) => ({
				...data,
				[fieldName]: file,
			}));
		}
	};

	const handleChildImage = (e) => {
		setChildImageChanged(true);
		handleImage(e, setChildImage, 'childImage');
	};

	const handleItemImage = (e) => {
		setWishItemImageChanged(true);
		handleImage(e, setWishItemImage, 'wishItemImage');
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();
		const data = new FormData();
		data.append('childFirstName', formFields.childFirstName);
		data.append('wishItemName', formFields.wishItemName);
		data.append('wishItemPrice', formFields.wishItemPrice);
		data.append('childInterest', formFields.childInterest);
		data.append('childStory', formFields.childStory);

		if (childImageChanged) {
			data.append('childImage', formFields.childImage);
		}
		if (wishItemImageChanged) {
			data.append('wishItemImage', formFields.wishItemImage);
		}

		if (onSubmit) {
			onSubmit(data);
		}
	};

	const getInputProps = (name) => ({
		name,
		value: formFields[name],
		onChange: handleInputChange,
		required: true,
	});

	useImperativeHandle(ref, () => ({
		isDirty() {
			return isDirty.current;
		},
		submit() {
			const form = formRef.current;
			if (form.reportValidity()) {
				// formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
				form.requestSubmit();
			}
		},
	}));

	return (
		<div className="container-fluid">
			<form
				ref={formRef}
				onSubmit={handleFormSubmit}
				// for debug only
				// noValidate
			>
				<div className="row justify-content-center">
					<div className="col-12 col-lg-6 my-2">
						<label htmlFor="childFirstName" className="form-label">
							{"Child's First Name:"}
						</label>
						<input
							autoFocus
							onFocus={(e) => e.currentTarget.focus()}
							id="childFirstName"
							className="form-control"
							type="text"
							maxLength={255}
							placeholder="Child's first name"
							{...getInputProps('childFirstName')}
						/>
					</div>
					<div className="col-12 col-lg-6 my-2">
						<label htmlFor="wishItemPrice" className="form-label">
							Price:
						</label>
						<input
							id="wishItemPrice"
							className="form-control"
							type="number"
							min={0.01}
							max={50}
							step={0.01}
							onWheel={noScroll}
							placeholder="Must be under $50"
							{...getInputProps('wishItemPrice')}
						/>
					</div>
					<div className="col-12 my-2">
						<label htmlFor="wishItemName" className="form-label">
							Wish Item:
						</label>
						<input
							id="wishItemName"
							className="form-control"
							type="text"
							maxLength={255}
							placeholder="Wish item"
							{...getInputProps('wishItemName')}
						/>
					</div>
					<div className="col-12 my-2">
						<label htmlFor="childInterest" className="form-label">
							Child Interest:
						</label>
						<input
							id="childInterest"
							className="form-control"
							type="text"
							maxLength={255}
							placeholder="Child's interest"
							{...getInputProps('childInterest')}
						/>
					</div>
					<div className="col-12 my-2">
						<label htmlFor="childStory" className="form-label">
							Child Story:
						</label>
						<textarea
							id="childStory"
							className="form-control"
							style={{ height: '200px' }}
							maxLength={2000}
							{...getInputProps('childStory')}
						/>
					</div>
					<div className="col-12 my-2">
						<div
							className={`d-flex ${flexDirection} p-4 gap-3`}
							style={{ backgroundColor: '#fdf6ed' }}
						>
							<Image
								src={childImage}
								alt={`${formFields.childFirstName}'s Image`}
								className="img-fluid rounded align-self-center"
								fit="cover"
								w={150}
								h={150}
							/>
							<div className="d-flex flex-column px-3">
								<label htmlFor="childImage" className="form-label">
									{currentFormTranslations.childImage.label}
								</label>
								<p className="form-text">
									{currentFormTranslations.childImage.instruction}
								</p>
								<FileButton
									onChange={handleChildImage}
									accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
									name="childImage"
									id="childImage"
									className="mt-4 align-self-center"
									required
								>
									{(props) => (
										<Button {...props}>
											<i className="fas fa-upload m-2 p-1"></i>
											<span className="upload-text">Upload</span>
										</Button>
									)}
								</FileButton>
							</div>
						</div>
					</div>
					<div className="col-12 my-2">
						<div
							className={`d-flex ${flexDirection} p-4 gap-3`}
							style={{ backgroundColor: '#fdf6ed' }}
						>
							<Image
								src={wishItemImage}
								alt={`${formFields.wishItemName}'s Image`}
								className="img-fluid rounded align-self-center"
								fit="cover"
								w={150}
								h={150}
							/>
							<div className="d-flex flex-column px-3">
								<label htmlFor="wishItemImage" className="form-label">
									{currentFormTranslations.wishItemImage.label}
								</label>
								<p className="form-text">
									{currentFormTranslations.wishItemImage.instruction}
								</p>
								<FileButton
									onChange={handleItemImage}
									className="mt-4 align-self-center"
									name="wishItemImage"
									id="wishItemImage"
									accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
								>
									{(props) => (
										<Button {...props}>
											<i className="fas fa-upload m-2 p-1"></i>
											<span className="upload-text">Upload</span>
										</Button>
									)}
								</FileButton>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
});

AgencyCardEditForm.displayName = 'AgencyCardEditForm';

AgencyCardEditForm.propTypes = {
	card: PropTypes.object,
	onSubmit: PropTypes.func,
};

export default AgencyCardEditForm;
