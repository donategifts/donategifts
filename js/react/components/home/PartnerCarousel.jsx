import { Carousel } from '@mantine/carousel';
import { Image, MantineProvider } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

import { PARTNER_CAROUSEL_DATA } from '../../utils/constants';

function PartnerCarousel() {
	const autoplay = useRef(Autoplay({ delay: 2000 }));

	const partnerCarouselSlides = PARTNER_CAROUSEL_DATA.map((data) => (
		<Carousel.Slide
			key={data.img}
			className="d-flex flex-column justify-content-center align-items-center"
		>
			<a
				href={data.url ? data.url : '#'}
				target={data.url ? '_blank' : undefined}
				rel={data.url ? 'noreferrer' : undefined}
			>
				<Image src={data.img} fit="cover" w={150} h="auto" alt={data.alt} />
			</a>
		</Carousel.Slide>
	));

	return (
		<MantineProvider>
			<div className="container my-5">
				<Carousel
					withControls={true}
					loop
					plugins={[autoplay.current]}
					onMouseEnter={autoplay.current.stop}
					onMouseLeave={autoplay.current.reset}
					slideSize={{ base: '100%', sm: '35%', md: '19.5%', lg: '19%', xl: '14%' }}
					slideGap="sm"
					controlsOffset="xs"
					styles={{
						viewport: { marginLeft: '25px', marginRight: '25px' },
					}}
				>
					{partnerCarouselSlides}
				</Carousel>
			</div>
		</MantineProvider>
	);
}

export default PartnerCarousel;
