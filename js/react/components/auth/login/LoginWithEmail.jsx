import PropTypes from 'prop-types';
import { useState } from 'react';

import { SIGNUP } from '../../../utils/constants';
import CustomToast from '../../shared/CustomToast.jsx';
import Modal from '../../shared/Modal.jsx';

function LoginWithEmail({ modalRef, dispatch }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [hidePassword, setHidePassword] = useState(true);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const togglePasswordVisibility = () => {
		setHidePassword((prev) => !prev);
	};

	const loginWithEmailHandler = async (e) => {
		e.preventDefault();
		if (email === '' || password === '') {
			setError('Please fill out email and password');
			return setIsToastVisible(true);
		}
		if (!email.split('').includes('@')) {
			setError('Please provide valid email');
			setIsToastVisible(true);
			return;
		}
		// TBD get base url from env local
		const response = await fetch('http://localhost:3000/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		if (response.ok) {
			return await response.json();
		}

		setEmail('');
		setPassword('');
		setError('Email and/or password incorrect');
		setIsToastVisible(true);
	};

	return (
		<>
			<CustomToast
				type="error"
				message={error}
				isVisible={isToastVisible}
				setIsVisible={setIsToastVisible}
			/>
			<Modal
				ref={modalRef}
				title={<h1 className="cool-font text-secondary">Log in with email</h1>}
				body={
					<div className="d-flex flex-column align-items-center justify-content-center gap-5">
						<form action="" method="post" className="w-100">
							<div className="form-floating mb-3">
								<input
									type="email"
									className="form-control rounded-pill"
									id="email"
									placeholder="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<label htmlFor="email">Email</label>
							</div>
							<div className="form-floating position-relative">
								<input
									type={hidePassword ? 'password' : 'text'}
									className="form-control rounded-pill"
									id="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<label htmlFor="password">Password</label>
								<i
									className={
										'show-password fas ' +
										(hidePassword ? 'fa-eye' : 'fa-eye-slash')
									}
									role="button"
									onClick={togglePasswordVisibility}
								></i>
							</div>
							<button
								className="w-100 mt-5 mb-3 button-modal-secondary"
								type="submit"
								onClick={loginWithEmailHandler}
							>
								Log in
							</button>
							<div className="w-100 d-flex justify-content-between align-items-start align-items-sm-center flex-column flex-sm-row gap-2 gap-sm-0">
								<div className="form-check">
									<input
										className="form-check-input"
										type="checkbox"
										value=""
										id="rememberMe"
									/>
									<label className="form-check-label" htmlFor="rememberMe">
										Remember me
									</label>
								</div>
								<a href="/profile/password/reset" className="text-secondary">
									Forgot password?
								</a>
							</div>
						</form>
					</div>
				}
				footer={<p>Agency partner users must log in with work email.</p>}
				sideContent={
					<div className="d-flex flex-column align-items-center justify-content-around text-center gap-4">
						<div className="d-flex flex-column align-items-center justify-content-center text-white">
							<h2 className="cool-font">No account?</h2>
							<p className="fs-5 mt-1">Join our great movement</p>
						</div>
						<button
							className="w-100 button-modal-outline fs-5 fw-bold"
							onClick={() => dispatch({ type: SIGNUP })}
						>
							Sign up
						</button>
					</div>
				}
			/>
		</>
	);
}

LoginWithEmail.propTypes = {
	dispatch: PropTypes.func,
	modalRef: PropTypes.object,
};

export default LoginWithEmail;
