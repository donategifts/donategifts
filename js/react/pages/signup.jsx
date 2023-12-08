import { Flex } from '@mantine/core';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

function Signup({ clientId }) {
	const [formState, setFormState] = useState({
		fName: '',
		lName: '',
		email: '',
		password: '',
		passwordConfirm: '',
	});
	const [userRole, setUserRole] = useState('donor');
	const [showPassword, setShowPassword] = useState(false);
	const recaptchaRef = useRef();

	function handleChange(e) {
		setFormState((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const captchaToken = await recaptchaRef.current.executeAsync();
		recaptchaRef.current.reset();
		axios
			.post('/signup', {
				...formState,
				userRole,
				captchaToken,
			})
			.then((res) => {
				location.assign(res.data.url);
			})
			.catch((err) => {
				new window.DG.Toast().show(
					err.response.data.error.msg || err.response.data.error,
					window.DG.Toast.styleMap.danger,
				);
			});
	}

	const handleCredentialResponse = async (googleResponse) => {
		try {
			const {
				data: { data },
			} = await axios({
				method: 'POST',
				url: '/api/login/google-signin',
				data: {
					id_token: googleResponse.credential,
				},
			});

			location.assign(data.url);
		} catch (error) {
			console.error(error.response);
			new window.DG.Toast().show(
				'Something went wrong. Please try again.',
				window.DG.Toast.styleMap.danger,
			);
		}
	};

	return (
		<MantineProviderWrapper>
			<GoogleOAuthProvider clientId={clientId}>
				<div
					className="gradient-form d-flex justify-content-center align-items-center flex-column"
					id="sign-up"
				>
					<h1 className="heading-primary mt-5">Join DonateGifts!</h1>
					<div className="container pt-4 pb-5">
						<form className="p-5 rounded-4" id="sign-up-form" onSubmit={handleSubmit}>
							<div className="col-md-8 mx-auto text-white">
								<div className="py-2">
									<label>I&#39;m signing up as a:</label>
									<div className="row px-2">
										<input
											className="btn-check col-auto"
											id="donor"
											type="radio"
											name="user-role"
											value="donor"
											autoComplete="off"
											checked={userRole === 'donor'}
											onChange={(e) => setUserRole(e.target.value)}
										/>
										<label
											className="fw-bold btn btn-outline-light col m-1 py-3 d-flex flex-column justify-content-center"
											htmlFor="donor"
										>
											Gift Sender
										</label>
										<input
											className="btn-check col-auto"
											id="partner"
											type="radio"
											name="user-role"
											value="partner"
											autoComplete="off"
											data-bs-toggle="modal"
											data-bs-target="#signupModalCenter"
											checked={userRole === 'partner'}
											onChange={(e) => setUserRole(e.target.value)}
										/>
										<label
											className="fw-bold btn btn-outline-light col m-1 py-3 d-flex flex-column justify-content-center"
											htmlFor="partner"
										>
											Nonprofit Agency Partner
										</label>
									</div>
								</div>
								<div className="py-2">
									<label className="form-label" htmlFor="fName">
										First Name:
									</label>
									<input
										className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
										id="fName"
										required="required"
										type="text"
										name="fName"
										value={formState.fName}
										onChange={handleChange}
									/>
								</div>
								<div className="py-2">
									<label className="form-label" htmlFor="lName">
										Last Name:
									</label>
									<input
										className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
										id="lName"
										required="required"
										type="text"
										name="lName"
										value={formState.lName}
										onChange={handleChange}
									/>
								</div>
								<div className="py-2">
									<label className="form-label" htmlFor="email">
										Email:
									</label>
									<input
										className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
										id="email"
										required="required"
										type="email"
										name="email"
										value={formState.email}
										onChange={handleChange}
									/>
								</div>
								<div className="py-2">
									<label className="form-label" htmlFor="password">
										Password:
									</label>
									<div>
										<div className="input-group">
											<input
												className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
												id="password"
												required="required"
												type={showPassword ? 'text' : 'password'}
												name="password"
												value={formState.password}
												onChange={handleChange}
											/>
											<span className="input-group-text bg-transparent border-0 rounded-0 border-bottom border-white">
												<div
													className={
														(showPassword
															? 'fas fa-eye-slash'
															: 'fas fa-eye') + ' text-white pointer'
													}
													id="showPassword"
													onClick={() => setShowPassword(!showPassword)}
												/>
											</span>
										</div>
										{formState.passwordConfirm !== '' &&
											formState.password !== formState.passwordConfirm && (
												<small className="text-primary" id="password-error">
													The passwords do not match.
												</small>
											)}
									</div>
								</div>
								<div className="py-2">
									<label className="form-label" htmlFor="passwordConfirm">
										Confirm Password:
									</label>
									<input
										className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
										id="passwordConfirm"
										required="required"
										type="password"
										name="passwordConfirm"
										value={formState.passwordConfirm}
										onChange={handleChange}
									/>
								</div>
								<ReCAPTCHA
									className="g-recaptcha"
									size="invisible"
									sitekey="6LcaNtcZAAAAAJ4wxLdiUe4fc1sLhkILRs-DXnXe"
									ref={recaptchaRef}
								/>
								<div className="row pt-4 justify-content-center">
									<button
										className="btn btn-lg btn-primary w-100 d-flex justify-content-center"
										id="submit-btn"
										type="submit"
									>
										Sign Up
									</button>
									<Flex justify="center" align="center" className="mt-3">
										<GoogleLogin
											width="280px"
											text="signup_with"
											onSuccess={handleCredentialResponse}
											onError={() => {
												new window.DG.Toast().show(
													'Something went wrong. Please try again.',
													window.DG.Toast.styleMap.danger,
												);
											}}
										/>
									</Flex>
								</div>
							</div>
						</form>
					</div>
				</div>
			</GoogleOAuthProvider>
		</MantineProviderWrapper>
	);
}

Signup.propTypes = {
	clientId: PropTypes.string.isRequired,
};

export default Signup;
