import PropTypes from 'prop-types';

import Modal from '../../shared/Modal.jsx';

function Login({ dispatch }) {
	return (
		<Modal
			title={<h1 className="cool-font text-secondary">Welcome back</h1>}
			body={
				<div className="d-flex flex-column align-items-center justify-content-center gap-5">
					<button className="w-100 d-flex justify-content-around align-items-center">
						Log in with Google
					</button>
					<button className="w-100 d-flex justify-content-around align-items-center">
						Log in with Facebook
					</button>
					<button
						className="button-modal-outline w-100 d-flex justify-content-center align-items-center gap-1 gap-md-4"
						onClick={() => dispatch({ type: 'LOGIN_WITH_EMAIL' })}
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
						onClick={() => dispatch({ type: 'SIGN_UP' })}
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
};
export default Login;
