function Login() {
	return (
		<div className="max-vh-100 vh-100 gradient-form position-relative">
			<div
				className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-between login-wrapper rounded"
				style={{ height: '600px', width: '900px' }}
			>
				{/* left side section */}
				<div
					className="h-100 bg-white rounded-start d-flex flex-column justify-content-around align-items-center text-center"
					style={{ width: '65%' }}
				>
					<h1 className="cool-font text-secondary">Welcome back</h1>
					<div className="d-flex flex-column align-items-center justify-content-center gap-5 w-50">
						<button>Google btn</button>
						<button>Facebook btn</button>
						<button className="btn-rounded-transparent w-100 d-flex justify-content-around align-items-center">
							<span className="fa fa-envelope-o fs-3" />
							<p className="m-0 fs-5 fw-bold">Log in with Email</p>
						</button>
					</div>
					<p>Agency partner users must sign in with work email</p>
				</div>
				{/* right side section */}
				<div
					className="h-100 rounded-end d-flex justify-content-center align-items-center"
					style={{ width: '35%' }}
				>
					<div className="d-flex flex-column align-items-center justify-content-around text-center gap-4">
						<div className="d-flex flex-column align-items-center justify-content-center text-white">
							<h2 className="cool-font">No account?</h2>
							<p className="fs-5 mt-1">Join our great movement</p>
						</div>
						<button className="btn-rounded-fill fs-5 fw-bold">Sign up</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
