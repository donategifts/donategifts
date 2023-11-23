import { Carousel } from '@mantine/carousel';
import { Image, Card, Text, Group, Button, ActionIcon } from '@mantine/core';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
function WishCard({ wishCard, attributes }) {
	useEffect(() => {
		// console.log(wishCard);
	}, []);

	// [x] change images to real child image + wish item image
	// [x] add view more button and donate gift button
	// [x] gift donated button grayed out with disbled pointer
	// [x] add more details - wish, item price, interest
	// [ ] show agency info popover
	// [x] link single page

	const imgList = [
		'/img/gift-placeholder-1.jpg',
		'/img/gift-placeholder-2.jpg',
		'/img/gift-placeholder-3.jpg',
		'/img/gift-placeholder-4.jpg',
		'/img/gift-placeholder-5.jpg',
	];

	const childImage = wishCard.wishCardImage ?? wishCard.childImage;
	const itemImage = wishCard.wishItemImage ?? imgList[Math.floor(Math.random() * 5)];
	const wishCardTitle =
		wishCard.childFirstName?.length > 10
			? wishCard.childFirstName
			: `${wishCard.childFirstName}'s Wish`;

	const slides = [childImage, itemImage].map((image) => (
		<Carousel.Slide key={image}>
			<Image
				src={image}
				fallbackSrc="/img/img-placeholder.png"
				height={220}
				fit="cover"
				alt={wishCardTitle}
			/>
		</Carousel.Slide>
	));

	return (
		<Card radius="md" withBorder shadow="md" padding="lg">
			<Card.Section>
				<Carousel withIndicators loop align="center">
					{slides}
				</Carousel>
			</Card.Section>

			<Group justify="space-between" mt="lg">
				<Text fw={600} fz="xl">
					{wishCardTitle}
				</Text>

				<Group gap={5}>
					<ActionIcon variant="light" aria-label="message" radius={50}>
						<i className="far fa-envelope"></i>
					</ActionIcon>
					<ActionIcon variant="light" aria-label="message" radius={50}>
						<i className="far fa-heart"></i>
					</ActionIcon>
				</Group>
			</Group>

			<div className="mt-2">
				<p className="mb-1">
					{wishCard.wishItemName?.length > 24
						? `Wish: ${wishCard.wishItemName.slice(0, 24)}...`
						: `Wish: ${wishCard.wishItemName}`}
				</p>
				<p className="mb-1">Price: ${wishCard.wishItemPrice}</p>
				<p>
					{wishCard.childInterest?.length > 24
						? `Interest: ${wishCard.childInterest.slice(0, 24)}...`
						: `Interest: ${wishCard.childInterest || 'Not Provided'}`}
				</p>
			</div>

			<Group justify="center" mt="xs" align="center">
				<Button
					radius="md"
					size="md"
					component="a"
					target="_blank"
					href={`/wishcards/single/${wishCard._id}`}
				>
					View More
				</Button>

				{wishCard.status === 'donated' ? (
					<Button radius="md" color="#6c757d " size="md" disabled="true">
						Donated
					</Button>
				) : (
					<Button radius="md" color="#ff826b" size="md" component="a" {...attributes}>
						Donate Gift
					</Button>
				)}
			</Group>
		</Card>
	);
}

WishCard.propTypes = {
	// we'll make this more specific once the db migration is complete
	wishCard: PropTypes.object,
	attributes: PropTypes.object,
};

export default WishCard;
