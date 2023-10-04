import { useEffect, useReducer, useRef, useState } from 'react';

import { LOGIN, LOGIN_WITH_EMAIL, SIGNUP } from '../../utils/constants';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';
import Auth from '../auth/Auth.jsx';
import Nav from '../nav/index.jsx';

const initialState = {
	showLogin: true,
	showLoginWithEmail: false,
	showSignUp: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case LOGIN:
			return {
				showLogin: true,
				showLoginWithEmail: false,
				showSignUp: false,
			};
		case LOGIN_WITH_EMAIL:
			return {
				showLogin: false,
				showLoginWithEmail: true,
				showSignUp: false,
			};
		case SIGNUP:
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
	const [showModal, setShowModal] = useState(false);
	const modalRef = useRef(null);

	const handleClickOutside = (event) => {
		//if modal is open and click is outside modal, close it
		if (modalRef.current && !modalRef.current.contains(event.target)) {
			return setShowModal(false);
		}
	};
	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	return (
		<MantineProviderWrapper>
			<header>
				<Nav {...props} dispatch={dispatch} setShowModal={setShowModal} />
				{showModal ? <Auth dispatch={dispatch} state={state} modalRef={modalRef} /> : null}
			</header>
		</MantineProviderWrapper>
	);
}

export default Header;
