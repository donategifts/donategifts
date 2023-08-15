import Auth from '../auth/index.jsx';
import Nav from '../nav/index.jsx';

function Header(props) {
	return (
		<header>
			<Nav {...props} />
			<Auth />
		</header>
	);
}

export default Header;
