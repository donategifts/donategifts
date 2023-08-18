import PropTypes from 'prop-types';

import { LOGIN } from '../../../utils/constants.jsx';
import Modal from '../../shared/Modal.jsx';

function SignUp({ modalRef, dispatch }) {
	return (
		<Modal
			ref={modalRef}
			title={<h1 className="cool-font text-secondary">Join DonateGifts</h1>}
			body={
				<div className="d-flex flex-column align-items-center justify-content-center gap-5">
					<button className="w-100 d-flex justify-content-around align-items-center">
						Sign up with Google
					</button>
					<button className="w-100 d-flex justify-content-around align-items-center">
						Sign up with Facebook
					</button>
					<button
						className="button-modal-outline w-100 d-flex justify-content-center align-items-center gap-1 gap-md-4"
						// onClick={() => console.log('sign up with email')}
					>
						<span className="fa fa-envelope-o fs-3" />
						<p className="m-0 fs-5 fw-bold">Sign up with Email</p>
					</button>
				</div>
			}
			footer={<p>Agency partner users must sign in with work email</p>}
			sideContent={
				<div className="d-flex flex-column align-items-center justify-content-around text-center gap-4">
					<div className="d-flex flex-column align-items-center justify-content-center text-white">
						<h2 className="cool-font">Already have an account?</h2>
					</div>
					<button
						className="w-100 button-modal-fill fs-5 fw-bold"
						onClick={() => dispatch({ type: LOGIN })}
					>
						Log in
					</button>
				</div>
			}
		/>
	);
}

SignUp.propTypes = {
	dispatch: PropTypes.func,
	modalRef: PropTypes.object,
};

export default SignUp;
