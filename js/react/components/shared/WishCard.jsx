import PropTypes from 'prop-types';

const WishCard = ({ wishCard, attributes }) => {
	return (
		<div className="card border-0 shadow h-100" key={wishCard._id}>
			<img
				className="card-img-top rounded-0 rounded-top-3"
				src={wishCard.wishCardImage}
				alt={wishCard.wishItemName}
				loading="lazy"
			/>
			<div className="card-body center-elements rounded-0 rounded-bottom-3">
				<div className="w-100">
					<h4 className="card-title text-center">My name is {wishCard.childFirstName}</h4>
					<div className="card-text">
						<p className="mb-1">
							{wishCard.wishItemName?.length > 26
								? `Wish: ${wishCard.wishItemName.slice(0, 26)}...`
								: `Wish: ${wishCard.wishItemName}`}
						</p>
						<p className="mb-1">Item Price: ${wishCard.wishItemPrice}</p>
						<p>
							{wishCard.childInterest?.length > 26
								? `Interest: ${wishCard.childInterest.slice(0, 26)}...`
								: `Interest: ${wishCard.childInterest || 'Not Provided'}`}
						</p>
					</div>
					<div className="d-block d-xxl-flex justify-content-center">
						<div className="col-12 col-xxl-6 mb-2 mb-xxl-0">
							<a
								className="btn btn-lg btn-primary w-100"
								href={`/wishcards/single/${wishCard._id}`}
							>
								View More
							</a>
						</div>
						<div className="col-12 col-xxl-6 ms-0 ms-xxl-1">
							{wishCard.status === 'donated' ? (
								<button className="btn btn-lg btn-dark disabled w-100">
									Donated
								</button>
							) : (
								<a className="btn btn-lg btn-dark w-100" {...attributes}>
									Donate
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

WishCard.propTypes = {
	attributes: PropTypes.object,
	// we'll make this more specific once the db migration is complete
	wishCard: PropTypes.object,
};

export default WishCard;
