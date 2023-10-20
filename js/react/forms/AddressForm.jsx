import { Select, TextInput } from '@mantine/core';

import { STATE_NAMES } from '../utils/constants';

function AddressForm() {
	return (
		<>
			<div className="row mt-3">
				<div className="col-12 col-md-4">
					<TextInput label="Address Line 1" />
				</div>
				<div className="col-12 col-md-4">
					<TextInput label="Address Line 2" />
				</div>
				<div className="col-12 col-md-4">
					<TextInput label="City" />
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-12 col-md-4">
					<Select
						label="State"
						searchable
						placeholder="Select option"
						data={STATE_NAMES}
					/>
				</div>
				<div className="col-12 col-md-4">
					<TextInput label="Zipcode" />
				</div>
				<div className="col-12 col-md-4">
					<Select
						label="Country"
						searchable
						placeholder="Select option"
						data={['United States']}
					/>
				</div>
			</div>
		</>
	);
}

export default AddressForm;
