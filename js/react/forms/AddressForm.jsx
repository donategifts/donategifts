import { Select, TextInput } from '@mantine/core';
import PropTypes from 'prop-types';
import { forwardRef, useRef, useImperativeHandle, useState } from 'react';

import { ADDRESS_FORM_INPUTS } from '../../../translations/translations';
import { STATE_NAMES } from '../utils/constants';

const AddressForm = forwardRef(({ inputSize, onSubmit }, ref) => {
	const formRef = useRef();
	const stateRef = useRef();
	const countryRef = useRef();
	const isDirty = useRef(false);

	const [formData, setFormData] = useState({
		address1: '',
		address2: '',
		city: '',
		state: '',
		country: '',
		zipcode: '',
	});

	const handleInputs = (event) => {
		const target = event.target;
		const { name, value } = target;

		setFormData({
			...formData,
			[name]: value,
		});
		isDirty.current = true;
	};

	const handleDropDowns = (ref, name) => {
		const value = ref.current?.value;
		setFormData({
			...formData,
			[name]: value,
		});
		isDirty.current = true;
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();
		if (onSubmit) {
			onSubmit(formData);
		}
	};

	useImperativeHandle(ref, () => ({
		isDirty() {
			return isDirty.current;
		},
		//TODO: need to submit formData
		submit() {
			const form = formRef.current;
			if (form.reportValidity()) {
				form.requestSubmit();
			}
		},
	}));

	return (
		<form ref={formRef} onSubmit={handleFormSubmit}>
			<div className="row mt-3">
				<div className="col-12 col-md-4">
					<TextInput
						size={inputSize}
						label={ADDRESS_FORM_INPUTS.address1.label}
						name="address1"
						onChange={handleInputs}
					/>
				</div>
				<div className="col-12 col-md-4">
					<TextInput
						size={inputSize}
						label={ADDRESS_FORM_INPUTS.address2.label}
						name="address2"
						onChange={handleInputs}
					/>
				</div>
				<div className="col-12 col-md-4">
					<TextInput
						size={inputSize}
						label={ADDRESS_FORM_INPUTS.city.label}
						name="city"
						onChange={handleInputs}
					/>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-12 col-md-4">
					<Select
						size={inputSize}
						label={ADDRESS_FORM_INPUTS.state.label}
						searchable
						placeholder={ADDRESS_FORM_INPUTS.state.placeholder}
						data={STATE_NAMES}
						ref={stateRef}
						onChange={() => handleDropDowns(stateRef, 'state')}
					/>
				</div>
				<div className="col-12 col-md-4">
					<TextInput
						size={inputSize}
						label={ADDRESS_FORM_INPUTS.zipcode.label}
						name="zipcode"
						onChange={handleInputs}
					/>
				</div>
				<div className="col-12 col-md-4">
					<Select
						size={inputSize}
						label={ADDRESS_FORM_INPUTS.country.label}
						searchable
						placeholder={ADDRESS_FORM_INPUTS.country.placeholder}
						data={['United States']}
						ref={countryRef}
						onChange={() => handleDropDowns(countryRef, 'country')}
					/>
				</div>
			</div>
		</form>
	);
});

AddressForm.displayName = 'AddressForm';

AddressForm.defaultProps = {
	inputSize: 'md',
};

AddressForm.propTypes = {
	inputSize: PropTypes.string,
	onSubmit: PropTypes.func,
};

export default AddressForm;
