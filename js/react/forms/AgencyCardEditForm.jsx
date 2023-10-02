import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const noScroll = (event) => event.target.blur();

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
						<label htmlFor="childLastName" className="form-label">
							Last Name:
						</label>
						<input
							id="childLastName"
							className="form-control"
							type="text"
							maxLength={255}
							placeholder="Child's last name"
							{...getInputProps('childLastName')}
						/>
					</div>
					<div className="col-12 col-lg-6 my-2">
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
					<div className="col-12 col-lg-6 my-2">
						<label htmlFor="wishItemPrice" className="form-label">
							Price:
						</label>
						<input
							id="wishItemPrice"
							className="form-control"
							type="number"
							min={0.01}
							max={40}
							step={0.01}
							onWheel={noScroll}
							placeholder="Price must be under $40"
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
							placeholder="(e.g. what is their story? why do they want this item? what is their favorite subject?)"
							maxLength={2000}
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
