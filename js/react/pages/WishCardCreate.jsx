function WishCardCreate() {
	return (
		<div className="wish-create-page">
			<div className="container">
				<h1 className="heading-primary my-5 text-center">Create a wish card</h1>
				<div className="card shadow-lg p-4">
					<div className="card-body">
						<form action="">
							<div className="row py-3">
								<div className="form-group col-md-6 mb-3 mb-md-0">
									<label htmlFor="childFirstName" className="form-label">
										Child&apos;s first name
									</label>
									<input
										type="text"
										name="childFirstName"
										id="childFirstName"
										className="form-control"
									/>
								</div>
								<div className="form-group col-md-6">
									<label htmlFor="childInterest" className="form-label">
										Child&apos;s interest
									</label>
									<input
										type="text"
										name="childInterest"
										id="childInterest"
										placeholder="write something they like to do"
										className="form-control"
									/>
								</div>
							</div>
							<div className="row py-3">
								<div className="form-group col-md-6 mb-3 mb-md-0">
									<label htmlFor="wishItemName" className="form-label">
										Wish item name
									</label>
									<input
										type="text"
										name="wishItemName"
										id="wishItemName"
										className="form-control"
									/>
								</div>
								<div className="form-group col-md-6">
									<label htmlFor="wishItemPrice" className="form-label">
										Wish item price
										<i className="fa fa-question-circle ms-1"></i>
									</label>
									<input
										type="number"
										name="wishItemPrice"
										id="wishItemPrice"
										placeholder="price must be under $40"
										className="form-control"
										min={1}
										max={40}
									/>
								</div>
							</div>
							<div className="row py-3">
								<div className="col-12">
									<label htmlFor="wishItemDesc" className="form-label">
										Wish item description
										<i className="fa fa-question-circle ms-1"></i>
									</label>
									<input
										type="text"
										name="wishItemDesc"
										id="wishItemDesc"
										className="form-control"
										placeholder="share product details"
									/>
								</div>
							</div>
							<div className="row py-3">
								<div className="col-12">
									<label htmlFor="wishItemURL" className="form-label">
										Wish item Amazon URL
									</label>
									<input
										type="text"
										name=""
										id=""
										className="form-control"
										placeholder="product page link starting with https://www.amazon..."
									/>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WishCardCreate;
