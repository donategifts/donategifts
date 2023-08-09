import PropTypes from 'prop-types';

function Nav(props) {
	const { user, agency } = props;

	console.log('render nav', user, agency);

	return (
		<nav className="navbar navbar-expand-lg bg-body-white">
			<div className="container">
				<a className="navbar-brand" href="/" rel="home">
					<img src="/img/new-donate-gifts-logo-2.png" alt="logo" />
				</a>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarTogglerDemo02"
					aria-controls="navbarTogglerDemo02"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div
					className="collapse navbar-collapse justify-content-end"
					id="navbarTogglerDemo02"
				>
					<ul className="navbar-nav ml-auto mb-2 mb-lg-0 align-items-center">
						<li className="nav-item">
							<a className="nav-link" href="/wishcards">
								Wish Cards
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/mission">
								Mission
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/howto">
								How To
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/community">
								Community
							</a>
						</li>
						{/* No user */}
						{!user && (
							<li className="nav-item">
								<a className="nav-link" href="/login">
									Log In
								</a>
							</li>
						)}
						{/* User gift sender */}
						{!user?.isAdmin && !user?.userRole === 'partner' && (
							<li className="nav-item">
								<a className="nav-link" href="/profile">
									Profile
								</a>
							</li>
						)}
						{/* User is admin */}
						{user?.isAdmin && (
							<li className="nav-item">
								<a className="nav-link" href="/admin/">
									Admin Panel
								</a>
							</li>
						)}
						{/* User partner and agency is verified */}
						{user?.userRole === 'partner' && agency?.isVerified && (
							<>
								<li className="nav-item">
									<a className="nav-link" href="/wishcards/me">
										My Wishes
									</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="/wishcards/create">
										Create a Wish Card
									</a>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}

Nav.propTypes = {
	user: PropTypes.object,
	agency: PropTypes.object,
};
export default Nav;
