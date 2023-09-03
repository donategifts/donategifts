import PropTypes from 'prop-types';

import Login from './login/Login.jsx';
import LoginWithEmail from './login/LoginWithEmail.jsx';
import SignUp from './signup/SignUp.jsx';

const Auth = ({ state, dispatch, modalRef }) => {
	const { showLogin, showLoginWithEmail, showSignUp } = state;

	if (showLogin) {
		return <Login modalRef={modalRef} dispatch={dispatch} />;
	}

	if (showLoginWithEmail) {
		return <LoginWithEmail modalRef={modalRef} dispatch={dispatch} />;
	}

	if (showSignUp) {
		return <SignUp modalRef={modalRef} dispatch={dispatch} />;
	}
};

Auth.propTypes = {
	state: PropTypes.object,
	dispatch: PropTypes.func,
	modalRef: PropTypes.object,
};

export default Auth;
