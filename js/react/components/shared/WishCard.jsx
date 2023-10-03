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
							Wish:{' '}
							{wishCard.wishItemName?.length > 26
								? `${wishCard.wishItemName.slice(0, 26)}...`
								: wishCard.wishItemName}
						</p>
						<p className="mb-1">Item Price: ${wishCard.wishItemPrice}</p>
						<p>
							Interest:{' '}
							{wishCard.childInterest?.length > 26
								? `${wishCard.childInterest.slice(0, 26)}...`
								: wishCard.childInterest}
						</p>
					</div>
					<div className="d-md-flex justify-content-center">
						<div className="col-12 mb-2 mb-md-0 col-md-6 col-lg-6 col-sm-12 col-xs-12 me-0 me-md-1">
							<a
								className="btn btn-lg btn-primary w-100"
								href={`/wishcards/single/${wishCard._id}`}
							>
								View More
							</a>
						</div>
						<div className="col-12 col-md-6 col-lg-6 col-sm-12 col-xs-12 ms-0 ms-md-1">
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
	attributes: PropTypes.shape({}),
	wishCard: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		childFirstName: PropTypes.string.isRequired,
		childLastName: PropTypes.string.isRequired,
		childBirthday: PropTypes.string,
		childInterest: PropTypes.string.isRequired,
		wishItemName: PropTypes.string.isRequired,
		wishItemPrice: PropTypes.number.isRequired,
		wishItemURL: PropTypes.string.isRequired,
		childStory: PropTypes.string.isRequired,
		wishCardImage: PropTypes.string.isRequired,
		createdBy: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		deliveryDate: PropTypes.string.isRequired,
		occasion: PropTypes.string.isRequired,
		address: PropTypes.shape({
			address1: PropTypes.string.isRequired,
			address2: PropTypes.string.isRequired,
			city: PropTypes.string.isRequired,
			state: PropTypes.string.isRequired,
			country: PropTypes.string.isRequired,
			zipcode: PropTypes.string.isRequired,
		}),
		isLockedBy: PropTypes.string,
		isLockedUntil: PropTypes.string,
		approvedByAdmin: PropTypes.bool,
		status: PropTypes.string.isRequired,
		belongsTo: PropTypes.string.isRequired,
	}),
};

export default WishCard;
