import PropTypes from 'prop-types';
function WishCard({ wishCard, attributes }) {
    return (
        <div className="card border-0 shadow h-100" key={wishCard.id}>
            <img
                className="card-img-top rounded-0 rounded-top-3"
                src={wishCard.image ?? wishCard.child.image}
                alt={wishCard.item.name}
                loading="lazy"
            />
            <div className="card-body center-elements rounded-0 rounded-bottom-3">
                <div className="w-100">
                    <h4 className="card-title text-center">
                        My name is
                        {' '}
                        {wishCard.child.name}
                    </h4>
                    <div className="card-text">
                        <p className="mb-1">
                            {wishCard.item.name?.length > 26 ?
                                `Wish: ${wishCard.item.name.slice(0, 26)}...` :
                                `Wish: ${wishCard.item.name}`}
                        </p>
                        <p className="mb-1">
                            Item Price: $
                            {wishCard.item.price}
                        </p>
                        <p>
                            {wishCard.child.interest?.length > 24 ?
                                `Interest: ${wishCard.child.interest.slice(0, 24)}...` :
                                `Interest: ${wishCard.child.interest || 'Not Provided'}`}
                        </p>
                    </div>
                    <div className="d-block d-xxl-flex justify-content-center">
                        <div className="col-12 col-xxl-6 mb-2 mb-xxl-0">
                            <a
                                className="btn btn-lg btn-primary w-100"
                                href={`/wishcards/detail?id=${wishCard.id}`}
                            >
                                View More
                            </a>
                        </div>
                        <div className="col-12 col-xxl-6 ms-0 ms-xxl-1">
                            {wishCard.status === 'donated' ?
                                (
                                    <button className="btn btn-lg btn-dark disabled w-100">
                                        Donated
                                    </button>
                                ) :
                                (
                                    <a className="btn btn-lg btn-secondary w-100" {...attributes}>
                                        Donate
                                    </a>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

WishCard.propTypes = {
    // we'll make this more specific once the db migration is complete
    wishCard: PropTypes.object,
    attributes: PropTypes.object,
};

export default WishCard;
