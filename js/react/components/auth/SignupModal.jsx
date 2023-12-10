import { Modal, Text, Button } from '@mantine/core';
import PropTypes from 'prop-types';

function SignupModal({ opened, onClose }) {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			size={'xl'}
			withCloseButton={false}
			aria-label="Partner Signup Agreement"
		>
			<div className="d-flex flex-column">
				<Text className="h1 mt-2 cool-font text-warning align-self-center">
					Before we start our partnership
				</Text>
				<div className="text-dark px-5 d-flex flex-column gap-3 my-3">
					<div className="d-flex gap-3">
						<i className="pr-2 fas fa-ban text-danger display-2" aria-hidden={true} />
						<Text className="align-self-center">
							{
								'Minors or non-certified caregivers cannot register as an agency partner. You must be an authorized representative of an eligible organization.'
							}
						</Text>
					</div>
					<div className="d-flex gap-3">
						<i
							className="pr-2 fas fa-exclamation-triangle text-danger display-2"
							aria-hidden={true}
						/>
						<Text className="align-self-center">
							{
								'You may not misuse our services for personal gains as written in our Terms of Service Agreement.'
							}
						</Text>
					</div>
					<div className="d-flex gap-3">
						<i
							className="pr-2 far fa-envelope text-danger display-2"
							aria-hidden={true}
						/>
						<Text className="align-self-center">
							{
								'Please use your work email to sign up. We will send the verification code to an email associated with your non-profit organization. (e.g. name@your-organization.com)'
							}
						</Text>
					</div>
					<div className="d-flex gap-3">
						<i
							className="pr-2 far fa-check-circle text-danger display-2"
							aria-hidden={true}
						/>
						<Text className="align-self-center">
							{
								'You may not have an immediate access to all features until your agency is reviewed and verified.'
							}
						</Text>
					</div>
				</div>
				<Button
					radius="md"
					onClick={onClose}
					className="align-self-center"
					color="#ff826b"
					size="lg"
					aria-label="Close Partner Signup Agreement Modal"
				>
					<Text className="px-3">I agree and understand</Text>
				</Button>
			</div>
		</Modal>
	);
}

SignupModal.propTypes = {
	opened: PropTypes.bool,
	onClose: PropTypes.func,
};

export default SignupModal;
