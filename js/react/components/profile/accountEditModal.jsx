import { Button, Container, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import PropType from 'prop-types';
import { useRef } from 'react';

function AccountEditModal({ user, opened, onClose, formSubmit }) {
	const formRefs = {};
	const form = useForm({
		initialValues: {
			fName: user.fName,
			lName: user.lName || '',
		},
		validate: {
			fName: (value) =>
				value.length < 2 || value.length > 250
					? 'First Name must contain at least 2 characters.'
					: null,
		},
	});

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
		<Modal.Root size="xl" opened={opened} onClose={() => closeAndReset()} centered={true}>
			<Modal.Overlay />
			<Modal.Content>
				<Modal.Header styles={{ header: { borderBottom: '0.5px solid gray' } }}>
					<Modal.Title>Edit Account Details</Modal.Title>
					<Modal.CloseButton />
				</Modal.Header>
				<Container>
					<form className="m-3">
						<div className="d-flex my-4 gap-3">
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								type="text"
								placeholder="First Name"
								label="First Name:"
								className="w-50"
								{...getInputProps('fName')}
							/>
							<TextInput
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								type="text"
								label="Last Name:"
								className="w-50"
								{...getInputProps('lName')}
							/>
						</div>
						<div className="d-flex justify-content-end mb-2">
							<Button
								size="lg"
								styles={{ inner: { paddingLeft: '50px', paddingRight: '50px' } }}
								variant="outline"
								color="success.9"
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

AccountEditModal.propTypes = {
	user: PropType.object,
	opened: PropType.bool,
	onClose: PropType.func,
	formSubmit: PropType.func,
};

export default AccountEditModal;
