import { Textarea } from '@mantine/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import LoadingCard from '../components/shared/LoadingCard.jsx';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

function CommunityPosts(props) {
	const { user, agency, _csrf } = props;
	const [isLoading, setIsLoading] = useState(true);
	const [posts, setPosts] = useState(props.posts);
	const [messageError, setMessageError] = useState('');

	useEffect(() => {
		if (posts.length > 0) {
			setTimeout(() => {
				setIsLoading(false);
			}, 1000);
		}
	}, []);

	const handleOnChange = () => {
		setMessageError('');
	};

	const validateThenSubmit = (event) => {
		const message = document.querySelector('#message').value;
		if (!message.length) {
			setMessageError('Please write a message before submitting the post.');
		} else {
			submitPost(event);
		}
	};

	const submitPost = (event) => {
		event.preventDefault();
		const message = document.querySelector('#message').value;
		const image = document.querySelector('#image').files[0];
		const formData = new FormData();

		formData.append('message', message);
		formData.append('image', image);

		const toast = new window.DG.Toast();

		fetch('/api/community', {
			method: 'POST',
			headers: {
				'x-csrf-token': _csrf,
			},
			body: formData,
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`Response is not valid: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				document.querySelector('#communityPost').reset();
				document.querySelector('#imagePreview').innerHTML = '';
				toast.show('Your post is published.');
				setPosts(data.data);
				setTimeout(() => window.location.reload(), 2000);
			})
			.catch((err) => {
				console.error(err);
				toast.show('Post could not be saved.', toast.styleMap.danger);
			});
	};

	const handleImagePreview = () => {
		const image = document.querySelector('#image');
		const imageFile = image.files[0];

		if (image) {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(imageFile);
			fileReader.addEventListener('load', (event) => {
				const imageElementContainer = document.querySelector('#imagePreview');
				imageElementContainer.innerHTML = `<img class="img-fluid post-image" src="${event.target.result}" />`;
			});
		}
	};

	const createPost = () => (
		<div className="d-md-flex justify-content-center">
			<div className="col-12 py-3">
				<div className="card border-white shadow rounded">
					<div className="card-title pt-4 text-center">
						<h1 className="display-6">Post a message to your donors</h1>
					</div>
					<div className="card-body">
						<form id="communityPost">
							<div className="d-md-flex justify-content-center px-4">
								<Textarea
									size="md"
									rows={5}
									mt="md"
									id="message"
									name="message"
									className="w-100"
									error={messageError}
									onChange={handleOnChange}
									placeholder="Your message will be posted publicly on this page. Private messaging will be available soon."
									required
								/>
							</div>
							<div
								id="imagePreview"
								className="d-md-flex mt-3 justify-content-center"
							></div>
							<div className="row mt-4 d-flex justify-content-md-center">
								<div className="col-md-6">
									<div className="d-md-flex justify-content-between">
										<div className="col-md-6 mb-2 me-0 me-md-1 mb-md-0 text-center">
											<label
												className="btn btn-lg btn-secondary w-100"
												htmlFor="image"
											>
												Upload Donation Item Photo
											</label>
											<input
												id="image"
												type="file"
												hidden
												onChange={handleImagePreview}
											/>
										</div>
										<div className="col-md-6 text-center ms-0 ms-md-1">
											<button
												className="btn btn-lg btn-primary w-100"
												onClick={validateThenSubmit}
											>
												Submit Post
											</button>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<MantineProviderWrapper>
			<div className="bg-light">
				<div id="community" className="container py-3">
					{user?.userRole === 'partner' && agency?.isVerified ? (
						createPost()
					) : (
						<div>
							<p className="display-6 text-center my-4">
								Agency partners must log in to access the post creation section.
							</p>
						</div>
					)}
					<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 800: 2 }}>
						<Masonry gutter="1.5rem">
							{posts.map((post) =>
								isLoading ? (
									<LoadingCard key={post._id} enableButtons={false} />
								) : (
									<div className="card shadow rounded-3 border-0" key={post._id}>
										<div className="card-header p-2 bg-white border-0">
											<div className="text-center">
												{post.belongsTo?.agencyProfileImage && (
													<img
														className="img-fluid me-2 post-logo"
														src={post.belongsTo?.agencyProfileImage}
														alt="partner agency logo"
													/>
												)}
												<div className="mt-3 display-6 text-primary">
													{post.belongsTo?.agencyName}
												</div>
											</div>
										</div>
										<div className="card-body mx-1">
											<p className="text-muted">
												Posted on{' '}
												{moment(post.createdAt).format('MMM DD, YYYY')}
											</p>
											<div className="my-2">{post.message}</div>
											{post.image && (
												<div className="d-flex justify-content-center">
													<img
														className="img-fluid rounded mt-3 post-image"
														src={post.image}
														alt="image posted by the agency"
													/>
												</div>
											)}
										</div>
									</div>
								),
							)}
						</Masonry>
					</ResponsiveMasonry>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

CommunityPosts.propTypes = {
	user: PropTypes.object,
	agency: PropTypes.object,
	_csrf: PropTypes.string,
	posts: PropTypes.arrayOf(
		PropTypes.shape({
			belongsTo: PropTypes.shape({
				agencyProfileImage: PropTypes.string,
				agencyName: PropTypes.string,
			}),
			createdAt: PropTypes.string,
			message: PropTypes.string,
			image: PropTypes.string,
		}),
	),
};

export default CommunityPosts;
