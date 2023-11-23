import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import LoadingCard from '../components/shared/LoadingCard.jsx';
import WishCard from '../components/shared/WishCard.jsx';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

function WishCards({ wishCards, user }) {
    const [isLoading, setIsLoading] = useState(true);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        setCards(
            wishCards.map((wishCard) => {
                let attributes = {};

                if (!user?._id) {
                    attributes = {
                        'data-bs-toggle': 'modal',
                        'data-bs-target': '#loginModalCenter',
                    };
                } else {
                    attributes = {
                        href: `/wishcards/donate/${wishCard._id}`,
                    };
                }

                return (
                    <div key={wishCard._id} className="m-3 mt-0 col-12 col-md-5 col-lg-4 col-xxl-3">
                        <WishCard wishCard={wishCard} attributes={attributes} />
                    </div>
                );
            }),
        );

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <MantineProviderWrapper>
            <div id="wishcards" className="bg-light p-4">
                <div className="container">
                    <div className="d-flex flex-wrap justify-content-center align-items-stretch">
                        {isLoading ?
                            new Array(6)
                                .fill(0)
                                .map((_, index) => (
                                    <LoadingCard key={index} enableButtons={true} />
                                )) :
                            cards.map(card => card)}
                    </div>
                </div>
            </div>
        </MantineProviderWrapper>
    );
}

WishCards.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string,
    }),
    wishCards: PropTypes.arrayOf(PropTypes.object),
};

export default WishCards;
