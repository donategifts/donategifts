import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import LoadingCard from '../components/shared/LoadingCard.jsx';
import WishCard from '../components/shared/WishCard.jsx';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

function WishCards({ user }) {
    const [isLoading, setIsLoading] = useState(true);
    const [cards, setCards] = useState([]);
    const [wishCards, setWishCards] = useState([]);

    useEffect(() => {
        fetch('/api/wishcards/all')
            .then(res => res.json())
            .then(({ wishcards }) => {
                setWishCards(wishcards);
            });
    }, []);

    useEffect(() => {
        setCards(
            wishCards.map((wishCard) => {
                let attributes = {};

                if (!user?.id) {
                    attributes = {
                        'data-bs-toggle': 'modal',
                        'data-bs-target': '#loginModalCenter',
                    };
                } else {
                    attributes = {
                        href: `/wishcards/donate/${wishCard.id}`,
                    };
                }

                return (
                    <div key={wishCard.id} className="m-3 mt-0 col-12 col-md-5 col-lg-4 col-xxl-3">
                        <WishCard wishCard={wishCard} attributes={attributes} />
                    </div>
                );
            }),
        );

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [wishCards]);

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
        id: PropTypes.string,
    }),
};

export default WishCards;
