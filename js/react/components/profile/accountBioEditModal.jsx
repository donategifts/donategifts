import { Button, Container, Modal, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import PropType from 'prop-types';
import { useRef } from 'react';

function AccountBioEditModal({ user, opened, onClose, formSubmit }) {
	const formRefs = {};
	const form = useForm({
		initialValues: {
			aboutMe: user.aboutMe || '',
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
					<form className="m-3 d-flex flex-column gap-3">
						<Textarea
							styles={{
								input: { border: '1px solid #dee2e6', marginTop: '5px' },
							}}
							name="aboutMe"
							rows="3"
							placeholder="Write something about you"
							label="About Me:"
							{...getInputProps('aboutMe')}
						/>
						<div className="d-flex justify-content-end my-2">
							<Button
								size="lg"
								variant="outline"
								color="success.9"
								styles={{ inner: { paddingLeft: '50px', paddingRight: '50px' } }}
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

AccountBioEditModal.propTypes = {
	user: PropType.object,
	opened: PropType.bool,
	onClose: PropType.func,
	formSubmit: PropType.func,
};

export default AccountBioEditModal;
