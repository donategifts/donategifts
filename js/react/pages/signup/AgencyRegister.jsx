import axios from 'axios';
import { useState } from 'react';

import CustomForm from '../../forms/CustomForm.jsx';
import { AGENCY_SIGNUP_FIELDSETS } from '../../utils/fieldsets';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';
import { AGENCY_SIGNUP_FORM_INPUTS } from '../../utils/translations';

function AgencyRegister() {
	const formTranslations = AGENCY_SIGNUP_FORM_INPUTS;
	const fieldsets = AGENCY_SIGNUP_FIELDSETS;

	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsFormSubmitted(true);
	};

	const handleFormData = (formData) => {
		console.log(formData); //still testing

		handlePost(formData);
	};

	const handlePost = async (formData) => {
		const toast = new window.DG.Toast();
		const data = new FormData();
		//need to append to FormData() because of the image file transfer

		Object.entries(formData).forEach(([key, value]) => {
			data.append(key, value);
		});

		try {
			//TODO: BUG: 404 error - need to fix
			await axios.post('/api/signup/agency', data, {
				headers: {
					'content-type': 'multipart/form-data',
				},
			});
			toast.show('Submission was successful!');
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
								formTranslations={formTranslations}
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
