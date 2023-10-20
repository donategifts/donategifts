import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { GOOGLE_CLIENT_LIBRARY_URL, LOGIN_WITH_EMAIL, SIGNUP } from '../../../utils/constants';
import { loadlGoogleClientLibraryScript } from '../../../utils/helpers';
import Modal from '../../shared/Modal.jsx';

function Login({ modalRef, dispatch }) {
	useEffect(() => {
		if (window && document) {
			loadlGoogleClientLibraryScript(GOOGLE_CLIENT_LIBRARY_URL);
		}
	}, []);

	return (
		<Modal
			ref={modalRef}
			title={<h1 className="cool-font text-secondary">Welcome back</h1>}
			body={
				<div className="d-flex flex-column align-items-center justify-content-center gap-5">
					<div id="buttonDiv"></div>
					{/* <div
						id="g_id_onload"
						data-client_id="GOOGLE_CLIENT_ID"
						data-context="signin"
						data-ux_mode="popup"
						data-login_uri="https://your.domain/your_login_endpoint"
						data-auto_prompt="false"
					></div>
					<div
						className="g_id_signin"
						data-type="standard"
						data-shape="pill"
						data-theme="outline"
						data-text="signin_with"
						data-size="large"
						data-logo_alignment="left"
					></div> */}
					<button className="w-100 d-flex justify-content-around align-items-center">
						Log in with Google
					</button>
					<button className="w-100 d-flex justify-content-around align-items-center">
						Log in with Facebook
					</button>
					<button
						className="button-modal-outline w-100 d-flex justify-content-center align-items-center gap-1 gap-md-4"
						onClick={() => dispatch({ type: LOGIN_WITH_EMAIL })}
					>
						<span className="fa fa-envelope-o fs-3" />
						<p className="m-0 fs-5 fw-bold">Log in with Email</p>
					</button>
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
	);
}

Login.propTypes = {
	dispatch: PropTypes.func,
	modalRef: PropTypes.object,
};

export default Login;
