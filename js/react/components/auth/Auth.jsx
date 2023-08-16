import PropTypes from 'prop-types';

import Login from './login/Login.jsx';
import LoginWithEmail from './login/LoginWithEmail.jsx';
import SignUp from './signup/SignUp.jsx';

const Auth = ({ state, dispatch }) => {
	const { showLogin, showLoginWithEmail, showSignUp } = state;
	return showLogin ? (
		<Login dispatch={dispatch} />
	) : showSignUp ? (
		<SignUp dispatch={dispatch} />
	) : showLoginWithEmail ? (
		<LoginWithEmail dispatch={dispatch} />
	) : null;
};

Auth.propTypes = {
	state: PropTypes.object,
	dispatch: PropTypes.func,
};

export default Auth;
