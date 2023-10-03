import { useState } from 'react';

function WishCardCreate() {
	const [childImage, setChildImage] = useState(null);
	const [itemImage, setItemImage] = useState(null);

	const handleChildImage = (e) => {
		setChildImage(URL.createObjectURL(e.target.files[0]));
	};

	const handleItemImage = (e) => {
		setItemImage(URL.createObjectURL(e.target.files[0]));
	};

	return (
		<>
			<div id="wish-create-page">
				<div className="container">
					<h1 className="heading-primary my-4 text-center">Create a wish card</h1>
					<form action="">
						<div className="card shadow-lg pt-4 px-4 pb-1">
							<div className="card-body">
								<div className="display-6 mb-4">Information about child</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3">
										<label htmlFor="childFirstName" className="form-label">
											Child&apos;s first name
										</label>
										<input
											type="text"
											name="childFirstName"
											id="childFirstName"
											className="form-control mb-4"
										/>
										<label htmlFor="childInterest" className="form-label">
											Child&apos;s interest
										</label>
										<input
											type="text"
											name="childInterest"
											id="childInterest"
											placeholder="write something they like to do"
											className="form-control mb-4"
										/>
										<label htmlFor="childBirthYear" className="form-label">
											Child&apos;s birth year
										</label>
										<input
											type="number"
											name="childBirthYear"
											id="childBirthYear"
											className="form-control"
											min={1990}
											max={2023}
										/>
									</div>
									<div className="uploader form-group py-4 col-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-start">
										<div className="p-3">
											<label
												htmlFor="childImagePreview"
												className="form-label"
											>
												Upload child&apos;s picture
												<i className="fa fa-question-circle ms-1"></i>
											</label>
											<p className="form-text">
												You must use an image that is representative of the
												child (Also allowed: masked faces, cropped or
												blurred features, art or something they made)
											</p>
											<input
												type="file"
												name="childImage"
												id="childImage"
												className="form-control mb-2"
												onChange={handleChildImage}
											/>
										</div>
										<div className="p-3">
											<img
												src={childImage || `/img/img-placeholder.png`}
												alt="image-placeholder"
												className="img-fluid"
												id="childImagePreview"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="card shadow-lg p-4 my-4">
							<div className="card-body">
								<div className="display-6 mb-4">Information about wish item</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3">
										<label htmlFor="wishItemName" className="form-label">
											Wish item name
										</label>
										<input
											type="text"
											name="wishItemName"
											id="wishItemName"
											className="form-control mb-4"
										/>
										<label htmlFor="wishItemPrice" className="form-label">
											Wish item price
											<i className="fa fa-question-circle ms-1"></i>
										</label>
										<input
											type="number"
											name="wishItemPrice"
											id="wishItemPrice"
											placeholder="price must be under $40"
											className="form-control mb-4"
											min={1}
											max={40}
										/>
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
									<div className="uploader form-group py-4 col-6 d-flex flex-md-row flex-sm-column justify-content-center align-items-start">
										<div className="p-3">
											<label
												htmlFor="wishItemImagePreview"
												className="form-label"
											>
												Upload wish item picture
												<i className="fa fa-question-circle ms-1"></i>
											</label>
											<p className="form-text">
												You must use an image that is representative of the
												wish item product
											</p>
											<input
												type="file"
												name="wishItemImage"
												id="wishItemImage"
												className="form-control my-2"
												onChange={handleItemImage}
											/>
										</div>
										<div className="p-3">
											<img
												src={itemImage || `/img/img-placeholder.png`}
												alt="image-placeholder"
												className="img-fluid"
												id="wishItemImagePreview"
											/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<label htmlFor="wishItemURL" className="form-label">
											Wish item Amazon URL
											<i className="fa fa-question-circle ms-1"></i>
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
							</div>
						</div>
						<div className="card shadow-lg p-4 mb-4">
							<div className="card-body">
								<div className="display-6 mb-4">
									Information about shipping address
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default WishCardCreate;
