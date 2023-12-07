import { Box, Flex, LoadingOverlay } from '@mantine/core';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

function Login({ clientId }) {
	const [loading, setLoading] = useState(false);
	const queryString = new URLSearchParams(window.location.search);

	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const handleCredentialResponse = async (googleResponse) => {
		setLoading(true);

		try {
			const {
				data: { data },
			} = await axios({
				method: 'POST',
				url: '/api/login/google-signin',
				data: {
					id_token: googleResponse.credential,
					redirect: queryString.get('redirect'),
				},
			});

			location.assign(data.url);
		} catch (error) {
			console.error(error.response);
			setLoading(false);
			new window.DG.Toast().show(
				'Something went wrong. Please try again.',
				window.DG.Toast.styleMap.danger,
			);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);

		try {
			const {
				data: { data },
			} = await axios({
				method: 'POST',
				url: '/api/login',
				data: {
					email: emailRef.current.value,
					password: passwordRef.current.value,
					redirect: queryString.get('redirect'),
				},
			});

			location.assign(data.url);
		} catch (error) {
			console.error(error.response);
			setLoading(false);
			new window.DG.Toast().show(
				error.response.data.data.error,
				window.DG.Toast.styleMap.danger,
			);
		}
	};

	return (
		<MantineProviderWrapper>
			<GoogleOAuthProvider clientId={clientId}>
				<Box pos="relative">
					<LoadingOverlay
						visible={loading}
						zIndex={1000}
						overlayProps={{ radius: 'sm', blur: 2 }}
						loaderProps={{ color: 'primary.7', type: 'oval' }}
					/>
					<Flex
						className="gradient-form"
						id="login"
						align="center"
						justify="center"
						direction="column"
					>
						<h1 className="heading-primary mt-5">Welcome Back!</h1>
						<div className="container pt-4 pb-5">
							<form className="p-5 rounded-4" onSubmit={handleSubmit}>
								<div className="col-md-8 mx-auto text-white">
									<div className="py-2">
										<label className="form-label" htmlFor="email">
											Email
										</label>
										<input
											className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
											id="email"
											required="required"
											type="email"
											ref={emailRef}
										/>
									</div>
									<div className="py-2">
										<label className="form-label" htmlFor="password">
											Password
										</label>
										<div className="input-group">
											<input
												className="form-control bg-transparent border-0 rounded-0 border-bottom border-white"
												id="password"
												required="required"
												type="password"
												ref={passwordRef}
											/>
											<span className="input-group-text bg-transparent border-0 rounded-0 border-bottom border-white">
												<div
													className="fas fa-eye text-white pointer"
													id="showPassword"
												></div>
											</span>
										</div>
									</div>
									<div className="py-2">
										<a className="text-white" href="/profile/password/reset/">
											Forgot Password?
										</a>
									</div>
									<div className="row pt-5 pb-2 justify-content-center">
										<button
											className="btn btn-lg btn-primary d-flex justify-content-center"
											id="submit-btn"
											type="submit"
										>
											Login
										</button>
										<Flex justify="center" align="center" className="mt-3">
											<GoogleLogin
												width="280px"
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
					</Flex>
				</Box>
			</GoogleOAuthProvider>
		</MantineProviderWrapper>
	);
}

Login.propTypes = {
	clientId: PropTypes.string.isRequired,
};

export default Login;
