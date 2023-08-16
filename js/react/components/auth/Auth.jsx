import PropTypes from 'prop-types';

import Login from './login/Login.jsx';
import LoginWithEmail from './login/LoginWithEmail.jsx';
import SignUp from './signup/SignUp.jsx';

const Auth = ({ state, dispatch, modalRef }) => {
	const { showLogin, showLoginWithEmail, showSignUp } = state;
	return showLogin ? (
		<Login modalRef={modalRef} dispatch={dispatch} />
	) : showSignUp ? (
		<SignUp modalRef={modalRef} dispatch={dispatch} />
	) : showLoginWithEmail ? (
		<LoginWithEmail modalRef={modalRef} dispatch={dispatch} />
	) : null;
};

Auth.propTypes = {
	state: PropTypes.object,
	dispatch: PropTypes.func,
	modalRef: PropTypes.object,
};

export default Auth;
