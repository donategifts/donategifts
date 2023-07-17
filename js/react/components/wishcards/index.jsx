import PropTypes from 'prop-types';

function Wishcards({ _wishcards }) {}

Wishcards.propTypes = {
	wishcards: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			childFirstName: PropTypes.string.isRequired,
			childLastName: PropTypes.string.isRequired,
			childBirthday: PropTypes.instanceOf(Date).isRequired,
			childInterest: PropTypes.string.isRequired,
			wishItemName: PropTypes.string.isRequired,
			wishItemPrice: PropTypes.number.isRequired,
			wishItemURL: PropTypes.string.isRequired,
			childStory: PropTypes.string.isRequired,
			wishCardImage: PropTypes.string.isRequired,
			createdBy: PropTypes.string.isRequired,
			createdAt: PropTypes.instanceOf(Date).isRequired,
			deliveryDate: PropTypes.instanceOf(Date).isRequired,
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
			isLockedUntil: PropTypes.instanceOf(Date),
			approvedByAdmin: PropTypes.boolean,
			status: PropTypes.string.isRequired,
			belongsTo: PropTypes.string.isRequired,
		}),
	),
};

export default Wishcards;
