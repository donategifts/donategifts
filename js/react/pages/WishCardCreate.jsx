function WishCardCreate() {
	return (
		<div>
			<div className="container">
				<h1 className="heading-primary my-5 text-center">Create a wish card</h1>
				<div className="card shadow-lg">
					<div className="card-body d-flex flex-column p-5">
						<div className="row justify-content-center">
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<label
									htmlFor="childFirstName"
									className="text-primary text-center"
								>
									First name of the child:{' '}
								</label>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<input
									type="text"
									name="childFirstName"
									id="childFirstName"
									className="input-border-secondary w-75"
								/>
							</div>
						</div>
						<div className="row justify-content-center">
							<div className="col">
								<p>Child&apos;s Interests</p>
							</div>
							<div className="col">
								<p>
									<i className="fas fa-question-circle"></i>click for help
								</p>
							</div>
						</div>
						<textarea
							name="childInterest"
							id="childInterest"
							cols="30"
							rows="10"
							placeholder="write something they like to do"
						></textarea>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WishCardCreate;
