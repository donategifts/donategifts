import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';

import { chunkArray } from '../../utils/helpers';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';
import WishCard from '../shared/WishCard.jsx';

function WishCardsCarousel({ wishCards, user, publishedCards, curatedCards }) {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const displayedWishCards = +publishedCards === 0 ? curatedCards : wishCards;
	const [chunkedWishCards, setChunkedWishCards] = useState(chunkArray(displayedWishCards, 3));
	const [colStyle, setColStyle] = useState('col-4');
	const autoplay = useRef(Autoplay({ delay: 5000 }));

	const resizeWidth = () => {
		setWindowWidth(window.innerWidth);
	};

	useEffect(() => {
		if (windowWidth > 1400) {
			setChunkedWishCards(chunkArray(displayedWishCards, 3));
			setColStyle('col-4');
		} else if (windowWidth > 992 && windowWidth < 1400) {
			setChunkedWishCards(chunkArray(displayedWishCards, 2));
			setColStyle('col-6');
		} else {
			setChunkedWishCards(chunkArray(displayedWishCards, 1));
			setColStyle('col');
		}

		window.addEventListener('resize', resizeWidth);

		return () => window.removeEventListener('resize', resizeWidth);
	}, [windowWidth]);

	const slides = chunkedWishCards?.map((chunk, index) => (
		<Carousel.Slide key={index}>
			<div className="row justify-content-center m-5">
				{chunk.map((currentCard) => {
					return (
						<div key={currentCard._id} className={`${colStyle} p-4`}>
							<WishCard
								wishCard={currentCard}
								attributes={{
									href: user?._id
										? `/wishcards/donate/${currentCard._id}`
										: '/login',
								}}
							/>
						</div>
					);
				})}
			</div>
		</Carousel.Slide>
	));

	return (
		<MantineProviderWrapper>
			<div className="container my-5">
				<Carousel
					withControls
					loop
					plugins={[autoplay.current]}
					onMouseEnter={autoplay.current.stop}
					onMouseLeave={autoplay.current.reset}
				>
					{slides}
				</Carousel>
			</div>
		</MantineProviderWrapper>
	);
}

WishCardsCarousel.propTypes = {
	// we'll make this more specific once the db migration is complete
	wishCards: PropTypes.arrayOf(PropTypes.object),
	user: PropTypes.object,
	publishedCards: PropTypes.number,
	curatedCards: PropTypes.arrayOf(PropTypes.object),
};

export default WishCardsCarousel;
