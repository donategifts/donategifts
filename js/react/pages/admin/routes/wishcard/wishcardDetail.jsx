import { Button, FileButton, Group, Image } from '@mantine/core';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import CustomButton from '../../../../components/shared/CustomButton.jsx';

export default function WishcardDetail() {
	const { wishcardId } = useParams();
	const navigate = useNavigate();
	const [wishcard, setWishcard] = useState({
		id: '',
		childFirstName: '',
		childLastName: '',
		childBirthYear: '',
		childStory: '',
		childInterest: '',
		childImage: null,
		wishCardImage: null,
		wishItemName: '',
		wishItemPrice: '',
		wishItemURL: '',
		wishItemImage: null,
		wishItemInfo: '',
		occasion: '',
	});
	const [childImageChanged, setChildImageChanged] = useState(false);
	const [childImage, setChildImage] = useState('/img/img-placeholder.png');
	const [wishItemImage, setWishItemImage] = useState('/img/img-placeholder.png');
	const [wishItemImageChanged, setWishItemImageChanged] = useState(false);

	const [showUpdateLoader, setShowUpdateLoader] = useState(false);

	const toast = new window.DG.Toast();

	const handleImage = (file, setImage, fieldName) => {
		if (file) {
			setImage(URL.createObjectURL(file));
			setWishcard((data) => ({
				...data,
				[fieldName]: file,
			}));
		}
	};

	const handleChildImage = (file) => {
		setChildImageChanged(true);
		handleImage(file, setChildImage, 'childImage');
	};

	const handleItemImage = (file) => {
		setWishItemImageChanged(true);
		setWishItemImage(URL.createObjectURL(file));
		handleImage(file, setWishItemImage, 'wishItemImage');
	};

	const updateWishCardData = async () => {
		setShowUpdateLoader(true);
		const formdata = new FormData();
		if (childImageChanged) {
			formdata.append('childImage', wishcard.childImage);
		}
		if (wishItemImageChanged) {
			formdata.append('wishItemImage', wishcard.wishItemImage);
		}

		const res = await axios.post(`/api/admin/updateWishcardData/${wishcardId}`, formdata, {
			headers: {
				'content-type': 'multipart/form-data',
			},
		});
		const {
			error,
			data: { message },
		} = res;

		setShowUpdateLoader(false);

		if (error) {
			toast.show(error, toast.styleMap.danger);
			return;
		}
		toast.show(message);
	};

	const fetchWishCard = async () => {
		const res = await fetch(`/api/admin/wishcardDetail/${wishcardId}`);
		const { data } = await res.json();
		setWishcard(data);
		const childImage = data.childImage || data.wishCardImage;
		if (childImage) {
			setChildImage(childImage);
		}
		if (data.wishItemImage) {
			setWishItemImage(data.wishItemImage);
		}
	};

	useEffect(() => {
		fetchWishCard();
	}, []);

	return (
		<>
			<div className="d-flex align-items-baseline justify-content-between">
				<div className="d-flex align-items-baseline">
					<h2 className="me-2">
						{wishcard.childFirstName + ' ' + wishcard.childLastName + "'s Wishcard"}
					</h2>
				</div>
				<button onClick={() => navigate(-1)} className="btn btn-link">
					Go back
				</button>
			</div>
			<div className="d-flex mb-3 gap-2">
				<div className="d-flex flex-column">
					<div className="min-vh-50">
						<Image
							src={childImage}
							alt={`${wishcard.childFirstName}'s Image`}
							className="img-fluid rounded align-self-center"
							fit="cover"
							w={150}
							h={150}
						/>
					</div>
					<FileButton
						onChange={handleChildImage}
						accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
						name="childImage"
						id="childImage"
						className="mt-4 align-self-center"
						required
					>
						{(props) => (
							<Button {...props}>
								<i className="fas fa-upload m-2 p-1"></i>
								<span className="upload-text">Upload Child Image</span>
							</Button>
						)}
					</FileButton>
				</div>
				<div className="d-flex flex-column">
					<div className="min-vh-50">
						<Image
							src={wishItemImage}
							alt={`${wishcard.wishItemName}'s Image`}
							className="img-fluid rounded align-self-center"
							fit="cover"
							w={150}
							h={150}
						/>
					</div>
					<FileButton
						onChange={handleItemImage}
						className="mt-4 align-self-center"
						name="wishItemImage"
						id="wishItemImage"
						accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
					>
						{(props) => (
							<Button {...props}>
								<i className="fas fa-upload m-2 p-1"></i>
								<span className="upload-text">Upload Item Image</span>
							</Button>
						)}
					</FileButton>
				</div>
			</div>
			<Group justify={'center'}>
				<CustomButton
					size="lg"
					color="secondary.3"
					loading={showUpdateLoader}
					onClick={updateWishCardData}
					disabled={showUpdateLoader}
					text="Update Wishcard Data"
				/>
			</Group>
			<hr />
		</>
	);
}
