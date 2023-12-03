import { Carousel } from '@mantine/carousel';
import { Image, Card, Text, Group, Button, Badge } from '@mantine/core';
import PropTypes from 'prop-types';
function WishCard({ wishCard, attributes }) {
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
	const slides = [childImage, itemImage].map((image, index) => (
		<Carousel.Slide key={image}>
			{wishCard.hasArtImage && index === 0 ? (
				<Badge className="art-badge">{`${wishCard.childFirstName}'s Art`}</Badge>
			) : null}
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
				{/* TODO: separate issue for message and heart feature on wishcards - @stacysealky will revisit later */}
				{/* <Group gap={5}>
					<ActionIcon variant="light" aria-label="message" radius={50}>
						<i className="far fa-envelope"></i>
					</ActionIcon>
					<ActionIcon variant="light" aria-label="message" radius={50}>
						<i className="far fa-heart"></i>
					</ActionIcon>
				</Group> */}
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
					className={`w-sm-100`}
					size="md"
					component="a"
					target="_blank"
					href={`/wishcards/single/${wishCard._id}`}
				>
					View More
				</Button>

				{wishCard.status === 'donated' ? (
					<Button radius="md" className="w-sm-100" color="#6c757d " size="md" disabled>
						Donated
					</Button>
				) : (
					<Button
						radius="md"
						className="w-sm-100"
						color="#ff826b"
						size="md"
						component="a"
						{...attributes}
					>
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
