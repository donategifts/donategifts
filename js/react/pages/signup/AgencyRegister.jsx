import axios from 'axios';
import { useState } from 'react';

import CustomForm from '../../forms/CustomForm.jsx';
import { AGENCY_SIGNUP_FIELDSETS } from '../../utils/fieldsets';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';
import { AGENCY_SIGNUP_FORM_INPUTS } from '../../utils/translations';

function AgencyRegister() {
	const currFormMap = AGENCY_SIGNUP_FORM_INPUTS;
	const fieldsets = AGENCY_SIGNUP_FIELDSETS;

	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsFormSubmitted(true);
	};

	const handleFormData = (formData) => {
		console.log(formData);

		handlePost(formData);
	};

	const handlePost = async (formData) => {
		const data = new FormData();
		//need to append to FormData() because of the image file transfer

		data.append('agencyName', formData.agencyName);
		data.append('agencyBio', formData.agencyBio);
		//TODO: need to pass data with forEach
		// this currently only passes 2 data inputs for testing

		const toast = new window.DG.Toast();

		try {
			await axios.post('/api/wishcards', data, {
				headers: {
					'content-type': 'multipart/form-data',
				},
			});
			toast.show('Submission was successful!');
			// setTimeout(() => window.location.replace('/wishcards/manage'), 1000);
		} catch (error) {
			toast.show(
				error?.response?.data?.error?.msg ||
					error?.message ||
					'Submission was unsuccessful. Please try again or contact us.',
				toast.styleMap.danger,
			);
		}
	};

	const handleFormDirty = () => {
		setIsFormSubmitted(false);
	};

	return (
		<MantineProviderWrapper>
			<div id="agency-register-page" className="py-5">
				<div className="container">
					<h1 className="heading-primary mb-5 text-center">Register Your Agency</h1>
					<section className="text-primary pt-2">
						<div className="card shadow-lg px-4 pt-1 pb-4">
							<CustomForm
								fieldsets={fieldsets}
								currFormMap={currFormMap}
								handleFormData={handleFormData}
								isFormSubmitted={isFormSubmitted}
								handleFormDirty={handleFormDirty}
							/>
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
