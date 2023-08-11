import Login from '../login/index.jsx';
import Nav from '../nav/index.jsx';

function Header(props) {
	return (
		<header>
			<Nav {...props} />
			<Login />
		</header>
	);
}

export default Header;
