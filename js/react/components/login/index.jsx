import Modal from '../shared/Modal.jsx';

function Login() {
	return (
		<Modal
			modalTitle={<h1 className="cool-font text-secondary">Welcome back</h1>}
			modalBody={
				<div className="d-flex flex-column align-items-center justify-content-center gap-5 w-50">
					<button>Google btn</button>
					<button>Facebook btn</button>
					<button className="btn-rounded-transparent w-100 d-flex justify-content-around align-items-center">
						<span className="fa fa-envelope-o fs-3" />
						<p className="m-0 fs-5 fw-bold">Log in with Email</p>
					</button>
				</div>
			}
			modalFooter={<p>Agency partner users must sign in with work email</p>}
			rightSide={
				<div className="d-flex flex-column align-items-center justify-content-around text-center gap-4">
					<div className="d-flex flex-column align-items-center justify-content-center text-white">
						<h2 className="cool-font">No account?</h2>
						<p className="fs-5 mt-1">Join our great movement</p>
					</div>
					<button className="fs-5 fw-bold">Sign up</button>
				</div>
			}
		/>
	);
}

export default Login;
