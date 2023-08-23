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
					<a
						className="button-modal-outline w-100 d-flex justify-content-center align-items-center gap-1 gap-md-4 m-0 fs-5 fw-bold"
						href="/signup"
					>
						<span className="fa fa-envelope-o fs-3" />
						Sign up with Email
					</a>
				</div>
			}
			footer={<p>Agency partner users must sign up with work email</p>}
			sideContent={
				<div className="d-flex flex-column align-items-center justify-content-around text-center gap-4">
					<div className="d-flex flex-column align-items-center justify-content-center text-white">
						<h2 className="cool-font">Already have an account?</h2>
					</div>
					<button
						className="w-100 button-modal-outline fs-5 fw-bold"
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
