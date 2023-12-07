import PropType from 'prop-types';
import { useEffect, useState } from 'react';

const WishDetails = ({ wishItemName, wishItemImage, wishItemPrice, wishItemInfo }) => {
	const defaultImages = [
		'/img/gift-placeholder-1.jpg',
		'/img/gift-placeholder-2.jpg',
		'/img/gift-placeholder-3.jpg',
		'/img/gift-placeholder-4.jpg',
		'/img/gift-placeholder-5.jpg',
	];

	const [defaultImageSrc, setDefaultImageSrc] = useState('');

	useEffect(() => {
		if (!wishItemImage) {
			setDefaultImageSrc(defaultImages[Math.floor(Math.random() * defaultImages.length)]);
		}
	}, [wishItemImage]);

	const imageSrc = wishItemImage || defaultImageSrc;

	return (
		<div className="col-md-6 col-lg-6 col-12">
			<div className="display-6 my-4">My Wish</div>
			<img
				className="img-fluid mb-3 rounded-3"
				alt={wishItemName}
				loading="lazy"
				src={imageSrc}
			/>
			<p>
				<span className="fw-bold">Item Price:</span>
				<span className="mx-2">${wishItemPrice}</span>
			</p>
			<p>
				<span className="fw-bold">Item Name:</span>
				<span className="mx-2">{wishItemName}</span>
			</p>
			<p>
				<span className="fw-bold">Item Description:</span>
				<span className="mx-2">{wishItemInfo ?? 'Not Provided'}</span>
			</p>
		</div>
	);
};

WishDetails.propTypes = {
	wishItemName: PropType.string.isRequired,
	wishItemImage: PropType.string,
	wishItemPrice: PropType.number.isRequired,
	wishItemInfo: PropType.string,
};

export default WishDetails;
