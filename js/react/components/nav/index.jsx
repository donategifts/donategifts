import PropTypes from 'prop-types';

function Nav(props) {
	const { user, agency } = props;

	console.log('render nav', user, agency);

	return (
		<div className="w-100">
			<div className="navbar navbar-expand-md mb-0 p-1 bg-white">
				<div className="container my-0">
					<a className="navbar-brand ms-3 m-lg-0 p-0" href="/" rel="home">
						<img src="/img/new-donate-gifts-logo-2.png" alt="logo" />
					</a>
					<div className="collapse navbar-collapse justify-content-end">
						<div className="navbar nav">
							<div className="nav-item">
								<a className="nav-link" href="/wishcards">
									Wish Cards
								</a>
							</div>
							<div className="nav-item">
								<a className="nav-link" href="/mission">
									Mission
								</a>
							</div>
							<div className="nav-item">
								<a className="nav-link" href="/howto">
									How To
								</a>
							</div>
							<div className="nav-item">
								<a className="nav-link" href="/community">
									Community
								</a>
							</div>
							{/* No user */}
							{!user && (
								<div className="nav-item">
									<a href="/login" className="nav-link">
										Log In
									</a>
								</div>
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
									<div className="nav-item">
										<a className="nav-link" href="/wishcards/me">
											My Wishes
										</a>
									</div>
									<div className="nav-item">
										<a className="nav-link" href="/wishcards/create">
											Create a Wish Card
										</a>
									</div>
								</>
							)}
						</div>
					</div>
					<div className="justify-content-end d-lg-none">
						<button
							className="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarToggleExternalContent"
							aria-controls="navbarToggleExternalContent"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<i className="fas fa-bars" />
						</button>
					</div>
				</div>
			</div>
			<div className="row justify-content-center d-lg-none bg-white">
				<div className="text-center">
					<div id="navbarToggleExternalContent" className="collapse">
						<ul className="navbar-nav">
							<li className="nav-item">
								<a href="/wishcards" className="nav-link">
									Wish Cards
								</a>
							</li>
							<li className="nav-item">
								<a href="/Mission" className="nav-link">
									Mission
								</a>
							</li>
							<li className="nav-item">
								<a href="/howto" className="nav-link">
									How To
								</a>
							</li>
							<li className="nav-item">
								<a href="/community" className="nav-link">
									Community
								</a>
							</li>
							{/* No user */}
							{!user && (
								<div className="nav-item">
									<a href="/login" className="nav-link">
										Log In
									</a>
								</div>
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
									<div className="nav-item">
										<a className="nav-link" href="/wishcards/me">
											My Wishes
										</a>
									</div>
									<div className="nav-item">
										<a className="nav-link" href="/wishcards/create">
											Create a Wish Card
										</a>
									</div>
								</>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

Nav.propTypes = {
	user: PropTypes.object,
	agency: PropTypes.object,
};
export default Nav;
