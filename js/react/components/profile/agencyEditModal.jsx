import { Button, Container, Modal, TextInput, Textarea } from '@mantine/core';
import PropType from 'prop-types';
import { useState } from 'react';

function AgencyEditModal({ agency, opened, onClose, formSubmit }) {
	const [userAgency, setUserAgency] = useState({
		agencyBio: agency.agencyBio,
		agencyPhone: agency.agencyPhone,
		agencyWebsite: agency.agencyWebsite || '',
		address1: agency.agencyAddress.address1 || '',
		address2: agency.agencyAddress.address2 || '',
		city: agency.agencyAddress.city || '',
		state: agency.agencyAddress.state || '',
		country: agency.agencyAddress.country || '',
		zipcode: agency.agencyAddress.zipcode || '',
	});

	const handleInputChange = (event) => {
		const target = event.target;
		const { name, value } = target;

		setUserAgency({
			...userAgency,
			[name]: value,
		});
	};

	const getInputProps = (name) => ({
		name,
		value: userAgency[name],
		onChange: handleInputChange,
	});

	const closeAndReset = () => {
		setUserAgency({
			...userAgency,
			agencyBio: agency.agencyBio,
			agencyPhone: agency.agencyPhone,
			agencyWebsite: agency.agencyWebsite || '',
			address1: agency.agencyAddress.address1 || '',
			address2: agency.agencyAddress.address2 || '',
			city: agency.agencyAddress.city || '',
			state: agency.agencyAddress.state || '',
			country: agency.agencyAddress.country || '',
			zipcode: agency.agencyAddress.zipcode || '',
		});
		onClose();
	};

	return (
		<Modal.Root size="xl" opened={opened} onClose={() => closeAndReset()}>
			<Modal.Overlay />
			<Modal.Content>
				<Modal.Header>
					<Modal.Title>Edit Agency Details</Modal.Title>
					<Modal.CloseButton />
				</Modal.Header>
				<Container>
					<form>
						<div className="my-2 flex flex-column gap-2">
							<Textarea
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								id="agencyBio-edit"
								name="agencyBio"
								rows="3"
								placeholder="Enter agency description"
								label="Agency Description:"
								defaultValue={userAgency.agencyBio}
								onChange={handleInputChange}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								id="agencyPhone-edit"
								type="text"
								placeholder="000-000-0000"
								label="Contact Number:"
								{...getInputProps('agencyPhone')}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								id="agencyWebsite-edit"
								type="text"
								label="Website:"
								{...getInputProps('agencyWebsite')}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								id="address1-edit"
								type="text"
								label="Address Line 1:"
								{...getInputProps('address1')}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								id="address2-edit"
								type="text"
								label="Address Line 2:"
								{...getInputProps('address2')}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								id="city-edit"
								type="text"
								label="City:"
								{...getInputProps('city')}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								id="state-edit"
								type="text"
								label="State:"
								{...getInputProps('state')}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								id="country-edit"
								type="text"
								label="Country:"
								{...getInputProps('country')}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								id="zipcode-edit"
								type="text"
								label="Zipcode:"
								{...getInputProps('zipcode')}
							/>
						</div>
						<div className="modal-footer d-flex justify-content-end">
							<div className="col-12 col-md-4">
								<Button
									className="btn btn-lg btn-primary w-100"
									onClick={() => formSubmit(userAgency)}
								>
									Save
								</Button>
							</div>
						</div>
					</form>
				</Container>
			</Modal.Content>
		</Modal.Root>
	);
}

AgencyEditModal.propTypes = {
	agency: PropType.object,
	opened: PropType.bool,
	onClose: PropType.func,
	formSubmit: PropType.func,
};

export default AgencyEditModal;
