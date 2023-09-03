import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const AgencyCardEditForm = forwardRef(function AgencyCardEditForm({ card, onSubmit }, ref) {
	const formRef = useRef();
	const [formFields, setFormFields] = useState({
		childFirstName: card?.childFirstName ?? '',
		childLastName: card?.childLastName ?? '',
		wishItemName: card?.wishItemName ?? '',
		wishItemPrice: card?.wishItemPrice ?? '',
		childInterest: card?.childInterest ?? '',
		childStory: card?.childStory ?? '',
	});

	const handleInputChange = (event) => {
		const target = event.target;
		const { name, value } = target;

		setFormFields({
			...formFields,
			[name]: value,
		});
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();
		if (onSubmit) {
			onSubmit(formFields);
		}
	};

	const getInputProps = (name) => ({
		name,
		value: formFields[name],
		onChange: handleInputChange,
	});

	useImperativeHandle(ref, () => ({
		submit() {
			formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
		},
	}));

	return (
		<div className="container-fluid">
			<form ref={formRef} onSubmit={handleFormSubmit}>
				<div className="row justify-content-center">
					<div className="col-12 col-lg-6 my-2">
						<label htmlFor="childFirstName" className="form-label">
							Child First Name:
						</label>
						<input
							id="childFirstName"
							className="form-control"
							type="text"
							{...getInputProps('childFirstName')}
						/>
					</div>
					<div className="col-12 col-lg-6 my-2">
						<label htmlFor="childLastName" className="form-label">
							Last Name:
						</label>
						<input
							id="childLastName"
							className="form-control"
							type="text"
							{...getInputProps('childLastName')}
						/>
					</div>
					<div className="col-12 col-lg-6 my-2">
						<label htmlFor="wishItemName" className="form-label">
							Wish Item Name:
						</label>
						<input
							id="wishItemName"
							className="form-control"
							type="text"
							{...getInputProps('wishItemName')}
						/>
					</div>
					<div className="col-12 col-lg-6 my-2">
						<label htmlFor="wishItemPrice" className="form-label">
							Price:
						</label>
						<input
							id="wishItemPrice"
							className="form-control"
							type="text"
							{...getInputProps('wishItemPrice')}
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
							placeholder="(e.g. what is their story? why do they want this item? what is their favorite subject?)"
							{...getInputProps('childStory')}
						/>
					</div>
				</div>
			</form>
		</div>
	);
});

export default AgencyCardEditForm;

AgencyCardEditForm.propTypes = {
	card: PropTypes.object,
	onSubmit: PropTypes.func,
};
