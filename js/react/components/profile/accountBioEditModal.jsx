import { Button, Container, Modal, Textarea } from '@mantine/core';
import PropType from 'prop-types';
import { useState } from 'react';

function AccountBioEditModal({ user, opened, onClose, formSubmit }) {
	const [accountInfo, setAccountInfo] = useState({
		aboutMe: user.aboutMe || '',
	});

	const handleInputChange = (event) => {
		const target = event.target;
		const { name, value } = target;

		setAccountInfo({
			...accountInfo,
			[name]: value,
		});
	};

	const closeAndReset = () => {
		setAccountInfo({
			...accountInfo,
			aboutMe: user.aboutMe || '',
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
							<Textarea
								styles={{
									input: { border: '1px solid #dee2e6', marginTop: '5px' },
								}}
								name="aboutMe"
								rows="3"
								placeholder="Write something about you"
								label="About Me:"
								defaultValue={accountInfo.aboutMe}
								onChange={handleInputChange}
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

AccountBioEditModal.propTypes = {
	user: PropType.object,
	opened: PropType.bool,
	onClose: PropType.func,
	formSubmit: PropType.func,
};

export default AccountBioEditModal;
