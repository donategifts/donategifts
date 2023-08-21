import PropTypes from 'prop-types';

import { LOGIN_WITH_EMAIL, SIGNUP } from '../../../utils/constants.jsx';
import Modal from '../../shared/Modal.jsx';

function Login({ modalRef, dispatch }) {
	// google login setup
	// const handleCredentialResponse = (response) => {
	// 	console.log('Encoded JWT ID token: ' + response.credential);
	// };

	// useEffect(() => {
	// 	if (window?.google) {
	// 		window?.google.accounts.id.initialize({
	// 			// TBD should import client id from local env
	// 			client_id: 'GOOGLE_CLIENT_ID',
	// 			callback: handleCredentialResponse,
	// 		});
	// 		window?.google.accounts.id.renderButton(document.getElementById('google-signin-btn'), {
	// 			theme: 'outline',
	// 			size: 'large',
	// 			shape: 'pill',
	// 		});
	// 		window?.google.accounts.id.prompt();
	// 	}
	// 	if (window && document && !window.google) {
	// 		loadlGoogleClientLibraryScript(GOOGLE_CLIENT_LIBRARY_URL);
	// 		const googleClientLibraryScript = document.getElementById(
	// 			'google-client-library-script',
	// 		);
	// 		googleClientLibraryScript.addEventListener('load', () => {
	// 			window?.google.accounts.id.initialize({
	// 				// TBD should import client id from local env
	// 				client_id: 'GOOGLE_CLIENT_ID',
	// 				callback: handleCredentialResponse,
	// 			});
	// 			window?.google.accounts.id.renderButton(
	// 				document.getElementById('google-signin-btn'),
	// 				{
	// 					theme: 'outline',
	// 					size: 'large',
	// 					shape: 'pill',
	// 				},
	// 			);
	// 			window?.google.accounts.id.prompt();
	// 		});
	// 	}
	// }, []);

	return (
		<Modal
			ref={modalRef}
			title={<h1 className="cool-font text-secondary">Welcome back</h1>}
			body={
				<div className="d-flex flex-column align-items-center justify-content-center gap-5">
					{/* <div id="google-signin-btn"></div> */}

					{/* <div
						className="fb-login-button"
						data-size="large"
						data-button-type="login_with"
						data-layout="default"
						data-auto-logout-link="false"
						data-use-continue-as="false"
						data-scope="public_profile,email"
						data-onlogin="facebookLogin"
						onClick={login}
					></div> */}

					<button
						className="button-modal-outline w-100 d-flex justify-content-center align-items-center gap-1 gap-md-4"
						onClick={() => dispatch({ type: LOGIN_WITH_EMAIL })}
					>
						<span className="fa fa-envelope-o fs-3" />
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
						onClick={() => dispatch({ type: SIGNUP })}
					>
						Sign up
					</button>
				</div>
			}
		/>
	);
}

Login.propTypes = {
	dispatch: PropTypes.func,
	modalRef: PropTypes.object,
};

export default Login;
