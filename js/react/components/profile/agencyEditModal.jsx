import { Button, Container, Modal, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import PropType from 'prop-types';
import { useRef } from 'react';

function AgencyEditModal({ agency, opened, onClose, formSubmit }) {
	const formRefs = {};
	const form = useForm({
		initialValues: {
			agencyBio: agency.agencyBio,
			agencyPhone: agency.agencyPhone,
			agencyWebsite: agency.agencyWebsite || '',
			address1: agency.agencyAddress.address1 || '',
			address2: agency.agencyAddress.address2 || '',
			city: agency.agencyAddress.city || '',
			state: agency.agencyAddress.state || '',
			country: agency.agencyAddress.country || '',
			zipcode: agency.agencyAddress.zipcode || '',
		},
		validate: {
			agencyBio: (value) =>
				value.length < 5 || value.length > 500 ? 'Must be 5 to 500 characters long.' : null,
			agencyPhone: (value) =>
				/^\([2-9]\d{2}\) \d{3}-\d{4}$/.test(value)
					? null
					: `Phone number must be 10 digits and follow the format of (333) 444-5555 ${value}`,
			address1: (value) =>
				value.length < 2 || value.length > 250
					? 'Address line 1 must contain at least 2 characters.'
					: null,
			city: (value) =>
				value.length < 2 || value.length > 250
					? 'Address line 1 must contain at least 2 characters.'
					: null,
		},
	});

	const formatPhone = (e) => {
		const input = e.target.value.replace(/\D/g, '');
		const length = input.length;
		let formattedPhone = '';

		if (e.nativeEvent.inputType === 'deleteContentBackward') {
			formattedPhone = input;
		} else if (length > 3) {
			// Formatting as "(123) 456-7890"
			formattedPhone = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
		} else {
			// For inputs like "123" or "12" or "1" or "1-"
			formattedPhone = input;
		}

		return formattedPhone;
	};

	const handleInputChangePhone = (event) => {
		form.setValues({ agencyPhone: formatPhone(event) });
	};

	const getInputProps = (name) => {
		const currentRef = useRef();
		formRefs[`${name}Ref`] = currentRef;
		return {
			ref: currentRef,
			...form.getInputProps(name),
		};
	};

	const handleScroll = (ref) => {
		if (ref?.current) {
			window?.scrollTo({
				top: ref.offsetTop,
				left: 0,
				behavior: 'smooth',
			});
			ref.current.focus();
		}
	};

	const handleError = (errors) => {
		const firstError = Object.keys(errors)[0];
		const errorRef = formRefs[`${firstError}Ref`];
		handleScroll(errorRef);
	};

	const closeAndReset = () => {
		form.reset();
		onClose();
	};

	return (
		<Modal.Root size="xl" opened={opened} onClose={() => closeAndReset()}>
			<Modal.Overlay />
			<Modal.Content>
				<Modal.Header styles={{ header: { borderBottom: '0.5px solid gray' } }}>
					<Modal.Title>Edit Agency Details</Modal.Title>
					<Modal.CloseButton />
				</Modal.Header>
				<Container>
					<form className="mx-2">
						<div className="my-2 flex flex-column gap-2">
							<Textarea
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								name="agencyBio"
								rows="3"
								placeholder="Enter agency description"
								label="Agency Description:"
								{...getInputProps('agencyBio')}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								type="text"
								placeholder="000-000-0000"
								label="Contact Number:"
								{...getInputProps('agencyPhone')}
								onChange={handleInputChangePhone}
							/>
						</div>
						<div className="my-2">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
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
								type="text"
								label="Zipcode:"
								{...getInputProps('zipcode')}
							/>
						</div>
						<div className="modal-footer d-flex justify-content-end mb-2">
							<Button
								size="lg"
								className="btn btn-primary w-25"
								onClick={form.onSubmit((values) => formSubmit(values), handleError)}
							>
								Save
							</Button>
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
