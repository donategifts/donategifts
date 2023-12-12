import { Button, Container, Modal, TextInput } from '@mantine/core';
import PropType from 'prop-types';
import { useState } from 'react';

function AccountEditModal({ user, opened, onClose, formSubmit }) {
	const [accountInfo, setAccountInfo] = useState({
		fName: user.fName,
		lName: user.lName || '',
	});

	const handleInputChange = (event) => {
		const target = event.target;
		const { name, value } = target;

		setAccountInfo({
			...accountInfo,
			[name]: value,
		});
	};

	const getInputProps = (name) => ({
		name,
		value: accountInfo[name],
		onChange: handleInputChange,
	});

	const closeAndReset = () => {
		setAccountInfo({
			...accountInfo,
			fName: user.fName,
			lName: user.lName || '',
		});
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
					<form className="mx-2">
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
								className="btn btn-primary w-25"
								onClick={() => formSubmit(accountInfo)}
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
