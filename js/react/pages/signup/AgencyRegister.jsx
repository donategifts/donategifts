import { TextInput, Textarea } from '@mantine/core';
import { useRef, useState } from 'react';

import { AGENCY_SIGNUP_FORM_INPUTS } from '../../../../translations/translations';
import AddressForm from '../../forms/AddressForm.jsx';
// import { PHONE_NUMBER_REGEX } from '../../utils/constants';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function AgencyRegister() {
	const addressFormRef = useRef();
	const agencyNameRef = useRef();

	const [agencyFormData, setAgencyFormData] = useState({
		agencyName: '',
		agencyWebsite: '',
		agencyPhone: '',
		agencyEIN: '',
		agencyBio: '',
		agencyImage: null,
		agencyAddress: {},
	});

	// const agencyWebsiteRef = useRef();
	// const agencyPhoneRef = useRef();
	// const agencyEINRef = useRef();
	// const [agencyNameError, setAgencyNameError] = useState('');

	// const validateAgencyPhone = (value) => {
	// 	return PHONE_NUMBER_REGEX.test(value);
	// };

	const handleInputs = (event) => {
		const target = event.target;
		const { name, value } = target;

		setAgencyFormData({
			...agencyFormData,
			[name]: value,
		});
	};

	const handleSubmit = () => {
		addressFormRef.current?.submit();
	};

	const handleAddressFormSubmit = (addressFormData) => {
		console.log(addressFormData);
	};

	return (
		<MantineProviderWrapper>
			<div id="agency-register-page" className="py-5">
				<div className="container">
					<h1 className="heading-primary mb-5 text-center">Register Your Agency</h1>
					<section className="text-primary pt-2">
						<div className="card shadow-lg px-4 pt-1 pb-4">
							<div className="card-body">
								<h2 className="display-6 my-3">
									Information about your non-profit agency
								</h2>
								<div className="row d-flex align-items-center">
									<div className="col-sm-12 col-lg-6 col-md-6">
										<TextInput
											ref={agencyNameRef}
											size="md"
											name="agencyName"
											label={AGENCY_SIGNUP_FORM_INPUTS.agencyName?.label}
											// error={agencyNameError}
											required
											onBlur={handleInputs}
											// onChange={() => handleOnChange(setChildFirstNameError)}
										/>
									</div>
									<div className="col-sm-12 col-lg-6 col-md-6">
										<TextInput
											// ref={agencyWebsiteRef}
											size="md"
											name="agencyWebsite"
											onBlur={handleInputs}
											label={AGENCY_SIGNUP_FORM_INPUTS.agencyWebsite?.label}
										/>
									</div>
								</div>
								<div className="row d-flex align-items-center">
									<div className="col-sm-12 col-lg-6 col-md-6">
										<TextInput
											// ref={agencyPhoneRef}
											size="md"
											mt="md"
											name="agencyPhone"
											label={AGENCY_SIGNUP_FORM_INPUTS.agencyPhone?.label}
											// error={agencyNameError}
											required
											// onChange={() => handleOnChange(setChildFirstNameError)}
										/>
									</div>
									<div className="col-sm-12 col-lg-6 col-md-6">
										<TextInput
											// ref={agencyEINRef}
											size="md"
											mt="md"
											name="agencyEIN"
											label={AGENCY_SIGNUP_FORM_INPUTS.agencyEIN?.label}
											required
										/>
									</div>
								</div>
								<div className="row mt-1 d-flex">
									<div className="col-sm-12 col-md-6 col-lg-6">
										<Textarea
											size="md"
											rows={3}
											mt="md"
											name="agencyBio"
											// ref={childStoryRef}
											label={AGENCY_SIGNUP_FORM_INPUTS.agencyBio?.label}
											// error={childStoryError}
											placeholder={
												AGENCY_SIGNUP_FORM_INPUTS.agencyBio?.placeholder
											}
											required
											// onChange={() => handleOnChange(setChildStoryError)}
										/>
									</div>
									<div className="uploader form-group py-4 col-sm-12 col-lg-6 col-md-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-start">
										<div className="px-3 pt-3 pb-0">
											<img
												src={`/img/img-placeholder.png`}
												alt="image-placeholder"
												id="childImagePreview"
											/>
										</div>
										<div className="p-3">
											<label htmlFor="agencyImage" className="form-label">
												{AGENCY_SIGNUP_FORM_INPUTS.agencyImage?.label}
											</label>
											<p className="form-text">
												{AGENCY_SIGNUP_FORM_INPUTS.agencyImage?.instruction}
											</p>
											<input
												type="file"
												name="agencyImage"
												id="agencyImage"
												className="form-control mb-2"
												// onChange={handleChildImage}
												required
											/>
										</div>
									</div>
								</div>
								<h2 className="display-6 mb-2 mt-5">
									Information about your agency address
								</h2>
								<p className="form-text">
									{AGENCY_SIGNUP_FORM_INPUTS.agencyAddress?.instruction}
								</p>
								<AddressForm
									ref={addressFormRef}
									onSubmit={handleAddressFormSubmit}
								/>
							</div>
						</div>
						<div className="d-flex justify-content-center mt-5">
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
					</section>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

export default AgencyRegister;
