import { useReducer } from 'react';

import Auth from '../auth/index.jsx';
import Nav from '../nav/index.jsx';

const initialState = {
	showLogin: true,
	showLoginWithEmail: false,
	showSignUp: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			return {
				showLogin: true,
				showLoginWithEmail: false,
				showSignUp: false,
			};
		case 'LOGIN_WITH_EMAIL':
			return {
				showLogin: false,
				showLoginWithEmail: true,
				showSignUp: false,
			};
		case 'SIGN_UP':
			return {
				showLogin: false,
				showLoginWithEmail: false,
				showSignUp: true,
			};
		default:
			return state;
	}
};

function Header(props) {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<header>
			<Nav {...props} dispatch={dispatch} />
			<Auth dispatch={dispatch} state={state} />
		</header>
	);
}

export default Header;
