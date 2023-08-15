import PropTypes from 'prop-types';
import { useState } from 'react';

import Modal from '../shared/Modal.jsx';

const Auth = () => {
	const [showLogin, setShowLogin] = useState(true);
	const [showLoginWithEmail, setShowLoginWithEmail] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);

	return showLogin ? (
		<Modal
			title={<h1 className="cool-font text-secondary">Welcome back</h1>}
			body={
				<div className="d-flex flex-column align-items-center justify-content-center gap-5 w-50">
					<button className="w-100 d-flex justify-content-around align-items-center">
						Log in with Google
					</button>
					<button className="w-100 d-flex justify-content-around align-items-center">
						Log in with Facebook
					</button>
					<button
						className="button-modal-outline w-100 d-flex justify-content-around align-items-center"
						onClick={() => {
							setShowLogin(false);
							setShowLoginWithEmail(true);
							setShowSignUp(false);
						}}
					>
						<span className="fa fa-envelope-o fs- 3" />
						<p className="m-0 fs-5 fw-bold">Log in with Email</p>
					</button>
				</div>
			}
			footer={<p>Agency partner users must sign in with work email</p>}
			sideContent={
				<div className="d-flex flex-column align-items-center justify-content-around text-center gap-4">
					<div className="d-flex flex-column align-items-center justify-content-center text-white">
						<h2 className="cool-font">No account?</h2>
						<p className="fs-5 mt-1">Join our great movement</p>
					</div>
					<button
						className="w-100 button-modal-fill fs-5 fw-bold"
						onClick={() => {
							setShowLogin(false);
							setShowLoginWithEmail(false);
							setShowSignUp(true);
						}}
					>
						Sign up
					</button>
				</div>
			}
		/>
	) : showSignUp ? (
		<Modal
			title={<h1 className="cool-font text-secondary">Join DonateGifts</h1>}
			body={
				<div className="d-flex flex-column align-items-center justify-content-center gap-5 w-50">
					<button className="w-100 d-flex justify-content-around align-items-center">
						Sign up with Google
					</button>
					<button className="w-100 d-flex justify-content-around align-items-center">
						Sign up with Facebook
					</button>
					<button
						className="button-modal-outline w-100 d-flex justify-content-around align-items-center"
						onClick={() => console.log('sign up with email')}
					>
						<span className="fa fa-envelope-o fs- 3" />
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
						onClick={() => {
							setShowLogin(true);
							setShowLoginWithEmail(false);
							setShowSignUp(false);
						}}
					>
						Log in
					</button>
				</div>
			}
		/>
	) : showLoginWithEmail ? (
		<Modal
			title={<h1 className="cool-font text-secondary">Log in with email</h1>}
			body={
				<div className="d-flex flex-column align-items-center justify-content-center gap-5 w-50">
					email password login remember me forgot password
				</div>
			}
			footer={<p>Agency partner users must sign in with work email</p>}
			sideContent={
				<div className="d-flex flex-column align-items-center justify-content-around text-center gap-4">
					<div className="d-flex flex-column align-items-center justify-content-center text-white">
						<h2 className="cool-font">No account?</h2>
						<p className="fs-5 mt-1">Join our great movement</p>
					</div>
					<button
						className="w-100 button-modal-fill fs-5 fw-bold"
						onClick={() => {
							setShowLogin(false);
							setShowLoginWithEmail(false);
							setShowSignUp(true);
						}}
					>
						Sign up
					</button>
				</div>
			}
		/>
	) : null;
};

Auth.propTypes = {
	showModal: PropTypes.bool,
	setShowModal: PropTypes.func,
};

export default Auth;
