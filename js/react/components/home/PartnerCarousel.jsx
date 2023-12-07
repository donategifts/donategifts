import { Carousel } from '@mantine/carousel';
import { Image, MantineProvider } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

import { PARTNER_CAROUSEL_DATA } from '../../utils/constants';

export default function PartnerCarousel() {
	const autoplay = useRef(Autoplay({ delay: 2500 }));

	const partnerCarouselSlides = PARTNER_CAROUSEL_DATA.map((data) => (
		<Carousel.Slide
			key={data.img}
			className="d-flex flex-column justify-content-center align-items-center"
		>
			<a
				href={data.url || '#'}
				target={data.url ? '_blank' : undefined}
				rel={data.url ? 'noreferrer' : undefined}
			>
				<Image src={data.img} fit="cover" w={150} h="auto" alt={data.alt} />
			</a>
		</Carousel.Slide>
	));

	return (
		<MantineProvider>
			<Carousel
				withControls={true}
				speed={2}
				slidesToScroll={1}
				loop
				plugins={[autoplay.current]}
				onMouseEnter={autoplay.current.stop}
				onMouseLeave={autoplay.current.reset}
				slideSize={{
					base: '100%',
					xs: '32%',
					sm: '30%',
					md: '19.5%',
					lg: '19%',
					xl: '14%',
				}}
				slideGap="sm"
				controlsOffset="xs"
				styles={{
					viewport: { marginLeft: '25px', marginRight: '25px' },
				}}
			>
				{partnerCarouselSlides}
			</Carousel>
		</MantineProvider>
	);
}
