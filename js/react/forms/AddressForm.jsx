import { Select, TextInput } from '@mantine/core';
import PropTypes from 'prop-types';
import { forwardRef, useRef, useImperativeHandle, useState } from 'react';

import { STATE_NAMES } from '../utils/constants';
import { ADDRESS_FORM_INPUTS } from '../utils/translations';

const AddressForm = forwardRef(({ inputSize }, ref) => {
	const addressFormRef = useRef();
	const isDirty = useRef(false);

	const [formData, setFormData] = useState({
		address1: '',
		address2: '',
		city: '',
		state: '',
		country: '',
		zipcode: '',
	});

	const handleInputChange = (event) => {
		const target = event.target;
		const { name, value } = target;

		setFormData({
			...formData,
			[name]: value,
		});
		isDirty.current = true;
	};

	useImperativeHandle(ref, () => ({
		//
	}));
	return (
		<form ref={addressFormRef}>
			<div className="row mt-3">
				<div className="col-12 col-md-4">
					<TextInput
						size={inputSize}
						label={ADDRESS_FORM_INPUTS.address1.label}
						onChange={handleInputChange}
					/>
				</div>
				<div className="col-12 col-md-4">
					<TextInput size={inputSize} label={ADDRESS_FORM_INPUTS.address2.label} />
				</div>
				<div className="col-12 col-md-4">
					<TextInput size={inputSize} label={ADDRESS_FORM_INPUTS.city.label} />
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
					/>
				</div>
				<div className="col-12 col-md-4">
					<TextInput size={inputSize} label={ADDRESS_FORM_INPUTS.zipcode.label} />
				</div>
				<div className="col-12 col-md-4">
					<Select
						size={inputSize}
						label={ADDRESS_FORM_INPUTS.country.label}
						searchable
						placeholder={ADDRESS_FORM_INPUTS.country.placeholder}
						data={['United States']}
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
};

export default AddressForm;
