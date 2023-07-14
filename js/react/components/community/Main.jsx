import moment from 'moment';
import PropTypes from 'prop-types';
import { useState } from 'react';

function Community(props) {
	const { user, _csrf } = props;

	const [posts, setPosts] = useState(props.posts);

	const submitPost = (event) => {
		event.preventDefault();
		const message = document.querySelector('#message').value;
		const image = document.querySelector('#image').files[0];
		const formData = new FormData();

		formData.append('message', message);
		formData.append('image', image);

		fetch('/api/community', {
			method: 'POST',
			headers: {
				'x-csrf-token': _csrf,
			},
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				document.querySelector('#communityPost').reset();
				document.querySelector('#imagePreview').innerHTML = '';

				window.showToast('Post published');

				setPosts(data.posts);
			})
			.catch((err) => {
				console.error(err);
				window.showToast('Post could not be saved');
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
				imageElementContainer.innerHTML = `<img class="img-fluid" src="${event.target.result}" />`;
			});
		}
	};

	const createPost = () => (
		<div className="community d-md-flex justify-content-center">
			<div className="row m-0 col-md-8 p-3">
				<div className="card m-0 border-white shadow rounded">
					<div className="card-title quick-font border-bottom mb-3 text-center">
						<h3 className="py-2">Post a message to your donors</h3>
					</div>
					<div className="card-body">
						<form id="communityPost">
							<div className="d-md-flex justify-content-center">
								<div className="col-md-8">
									<div className="form-group">
										<textarea
											className="form-control bg-white border quick-font"
											id="message"
											rows="5"
											placeholder="Write a thank you message here"
										></textarea>
									</div>
								</div>
							</div>
							<div
								id="imagePreview"
								className="d-md-flex mt-3 justify-content-center"
							></div>
							<div className="row mt-4 d-flex justify-content-md-center">
								<div className="col-md-6">
									<div className="d-md-flex justify-content-between">
										<div className="col-md-5 mb-2 mb-md-0 text-center">
											<label
												className="wishcard__button--yellow rounded-pill d-inline-block quick-font"
												htmlFor="image"
											>
												Upload Photo
											</label>
											<input
												id="image"
												type="file"
												hidden
												onChange={handleImagePreview}
											/>
										</div>
										<div className="col-md-5 text-center">
											<button
												className="createPost_button rounded-pill d-inline-block quick-font"
												onClick={submitPost}
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
		<>
			{user?.userRole === 'partner' && createPost()}
			<div className="container">
				<div className="row m-0">
					{posts.map((post) => (
						<div className="col-md-6" key={post._id}>
							<div className="card shadow rounded-3 my-3 border-0 quick-font">
								<div className="card-header p-4 bg-white border-0">
									<div className="text-center">
										{post.belongsTo?.agencyProfileImage && (
											<img
												className="img-fluid me-2 post-logo"
												src={post.belongsTo?.agencyProfileImage}
												alt="partner agency logo"
											/>
										)}
										<h6 className="bold-text">{post.belongsTo?.agencyName}</h6>
									</div>
								</div>
								<div className="card-body">
									<div className="mx-5">
										<span className="text-muted post-date">
											Posted on{' '}
											{moment(post.createdAt).format('MMM DD, YYYY')}
										</span>
										<p className="mt-2">{post.message}</p>
									</div>
									{post.image && (
										<div className="d-flex justify-content-center">
											<img
												className="img-fluid rounded mt-3"
												src={post.image}
												alt="post image"
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

Community.propTypes = {
	user: PropTypes.object,
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

export default Community;
