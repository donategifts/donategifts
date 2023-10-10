import { Select, TextInput } from '@mantine/core';
import PropTypes from 'prop-types';
import { forwardRef, useRef, useImperativeHandle } from 'react';

import { STATE_NAMES } from '../utils/constants';
import { ADDRESS_FORM_INPUTS } from '../utils/translations';

const AddressForm = forwardRef(({ inputSize }, ref) => {
	const addressFormRef = useRef();
	useImperativeHandle(ref, () => ({
		//
	}));
	return (
		<form ref={addressFormRef}>
			<div className="row mt-3">
				<div className="col-12 col-md-4">
					<TextInput size={inputSize} label={ADDRESS_FORM_INPUTS.address1.label} />
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
