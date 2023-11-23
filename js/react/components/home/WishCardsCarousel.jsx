import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { chunkArray } from '../../utils/helpers';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';
import WishCard from '../shared/WishCard.jsx';

function WishCardsCarousel({ user, publishedCards, curatedCards }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [wishCards, setWishCards] = useState([]);
    const displayedWishCards = +publishedCards === 0 ? curatedCards : wishCards;
    const [chunkedWishCards, setChunkedWishCards] = useState(chunkArray(displayedWishCards, 3));
    const [colStyle, setColStyle] = useState('col-4');

    const resizeWidth = () => {
        setWindowWidth(window.innerWidth);
    };

    const setChunksAndStyle = (cards) => {
        if (windowWidth > 1400) {
            setChunkedWishCards(chunkArray(displayedWishCards, 3));
            setColStyle('col-4');
        } else if (windowWidth > 992 && windowWidth < 1400) {
            setChunkedWishCards(chunkArray(displayedWishCards, 2));
            setColStyle('col-6');
        } else {
            setChunkedWishCards(chunkArray(cards || wishCards, 1));
            setColStyle('col-12');
        }
    };

    useEffect(() => {
        axios('/api/wishcards/all')
            .then(({ data: { wishcards } }) => {
                setWishCards(wishcards.slice(0, 9));
                setChunksAndStyle(wishcards.slice(0, 9));
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (wishCards.length) {
            setChunksAndStyle();
        }

        window.addEventListener('resize', resizeWidth);

        return () => window.removeEventListener('resize', resizeWidth);
    }, [windowWidth, wishCards]);

    return (
        <MantineProviderWrapper>
            <div className="container my-5">
                <div className="d-flex justify-content-center">
                    <button
                        title="previous"
                        className="d-none d-lg-block btn btn-sm btn-light bg-transparent border-0 p-4"
                        type="button"
                        data-bs-target="#desktop-cards-carousel"
                        data-bs-slide="prev"
                    >
                        <div className="fa-solid fa-chevron-left fa-2xl text-dark"></div>
                    </button>
                    <div
                        className="carousel slide"
                        id="desktop-cards-carousel"
                        data-bs-ride="carousel"
                    >
                        <div className="carousel-inner">
                            {chunkedWishCards?.map((chunk, index) => (
                                <div
                                    key={index}
                                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                    data-bs-interval="20000"
                                >
                                    <div className="row justify-content-center">
                                        {chunk.map(currentCard => (
                                            <div
                                                key={currentCard.id}
                                                className={`${colStyle} p-4`}
                                            >
                                                <WishCard
                                                    wishCard={currentCard}
                                                    attributes={{
                                                        href: user?.id ?
                                                            `/wishcards/donate/${currentCard.id}` :
                                                            '/login',
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        title="next"
                        className="d-none d-lg-block btn btn-sm btn-light bg-transparent border-0 p-4"
                        type="button"
                        data-bs-target="#desktop-cards-carousel"
                        data-bs-slide="next"
                    >
                        <div className="fa-solid fa-chevron-right fa-2xl text-dark"></div>
                    </button>
                </div>
                <div className="d-flex justify-content-center d-lg-none">
                    <div
                        className="carousel slide"
                        id="mobile-cards-carousel"
                        data-bs-ride="carousel"
                    >
                        <div className="carousel-inner p-4">
                            {displayedWishCards?.map((currentCard, index) => (
                                <div
                                    key={index}
                                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                    data-bs-interval="20000"
                                >
                                    <div className="row justify-content-center">
                                        <div key={currentCard._id} className="col-12">
                                            <WishCard
                                                wishCard={currentCard}
                                                attributes={{
                                                    href: user?._id ?
                                                        `/wishcards/donate/${currentCard._id}` :
                                                        '/login',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MantineProviderWrapper>
    );
}

WishCardsCarousel.propTypes = {
    user: PropTypes.object,
    publishedCards: PropTypes.number,
    curatedCards: PropTypes.arrayOf(PropTypes.object),
};

export default WishCardsCarousel;
