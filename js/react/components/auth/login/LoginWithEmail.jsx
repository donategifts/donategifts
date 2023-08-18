import PropTypes from 'prop-types';

import { SIGNUP } from '../../../utils/constants.jsx';
import Modal from '../../shared/Modal.jsx';

function LoginWithEmail({ modalRef, dispatch }) {
	return (
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
							/>
							<label htmlFor="email">Email</label>
						</div>
						<div className="form-floating">
							<input
								type="password"
								className="form-control rounded-pill"
								id="password"
								placeholder="Password"
							/>
							<label htmlFor="password">Password</label>
						</div>
						<button className="w-100 mt-5 mb-3 button-modal-secondary" type="submit">
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

LoginWithEmail.propTypes = {
	dispatch: PropTypes.func,
	modalRef: PropTypes.object,
};

export default LoginWithEmail;
