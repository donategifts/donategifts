import { Select, TextInput } from '@mantine/core';
import PropTypes from 'prop-types';

import Forms from '../../translations/en/forms.json';
import { STATE_NAMES } from '../../utils/constants';

// @enubia this is deprecated? - since we have the CustomForm now?
function AddressForm({ inputSize, onInputChange }) {
	const handleInputs = (event) => {
		const target = event.target;
		const { name, value } = target;

		onInputChange({ name, value });
	};

	const handleDropDowns = (value, name) => {
		onInputChange({ name, value });
	};

	return (
		<form>
			<div className="row mt-3">
				<div className="col-12 col-md-4">
					<TextInput
						size={inputSize}
						label={Forms.ADDRESS_FORM_INPUTS.address1.label}
						name="address1"
						required
						onChange={handleInputs}
					/>
				</div>
				<div className="col-12 col-md-4">
					<TextInput
						size={inputSize}
						label={Forms.ADDRESS_FORM_INPUTS.address2.label}
						name="address2"
						onChange={handleInputs}
					/>
				</div>
				<div className="col-12 col-md-4">
					<TextInput
						size={inputSize}
						label={Forms.ADDRESS_FORM_INPUTS.city.label}
						name="city"
						required
						onChange={handleInputs}
					/>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-12 col-md-4">
					<Select
						size={inputSize}
						label={Forms.ADDRESS_FORM_INPUTS.state.label}
						searchable
						placeholder={Forms.ADDRESS_FORM_INPUTS.state.placeholder}
						required
						data={STATE_NAMES}
						onChange={(value) => handleDropDowns(value, 'state')}
					/>
				</div>
				<div className="col-12 col-md-4">
					<TextInput
						size={inputSize}
						label={Forms.ADDRESS_FORM_INPUTS.zipcode.label}
						name="zipcode"
						required
						onChange={handleInputs}
					/>
				</div>
				<div className="col-12 col-md-4">
					<Select
						size={inputSize}
						label={Forms.ADDRESS_FORM_INPUTS.country.label}
						searchable
						placeholder={Forms.ADDRESS_FORM_INPUTS.country.placeholder}
						required
						data={['United States']}
						onChange={(value) => handleDropDowns(value, 'country')}
					/>
				</div>
			</div>
		</form>
	);
}

AddressForm.defaultProps = {
	inputSize: 'md',
};

AddressForm.propTypes = {
	isVisible: PropTypes.bool,
	inputSize: PropTypes.string,
	onInputChange: PropTypes.func,
};

export default AddressForm;
