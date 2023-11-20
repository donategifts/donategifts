import { Carousel } from '@mantine/carousel';

function CarouselCard() {
	return (
		<Carousel withIndicators height={200}>
			<Carousel.Slide>1</Carousel.Slide>
			<Carousel.Slide>2</Carousel.Slide>
			<Carousel.Slide>3</Carousel.Slide>
		</Carousel>
	);
}

export default CarouselCard;
