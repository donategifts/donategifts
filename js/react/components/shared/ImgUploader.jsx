import { FileButton, Button } from '@mantine/core';
import PropTypes from 'prop-types';
import { useState } from 'react';

const ImgUploader = ({ imgError, handleImage, isRequired, label, instruction, imgID }) => {
	const [image, setImage] = useState(null);
	const uploadImage = (file) => {
		setImage(URL.createObjectURL(file));
		handleImage(imgID, file);
	};

	return (
		<div className="uploader form-group py-5 d-flex flex-md-row flex-sm-column justify-content-center align-items-center">
			<div className="px-4">
				<img
					src={image || `/img/img-placeholder.png`}
					alt="image-preview"
					className={
						imgError ? 'img-fluid input-border-danger rounded' : 'img-fluid rounded'
					}
				/>
				{imgError && <p className="text-danger font-weight-bold">{imgError}</p>}
			</div>
			<div className="p-3">
				<label htmlFor={imgID} className="form-label">
					{label}
					{/* TODO: Add PopOver component here */}
				</label>
				<p className="form-text">{instruction}</p>
				<FileButton
					onChange={uploadImage}
					accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
					name={imgID}
					id={imgID}
					required={isRequired}
				>
					{(props) => (
						<Button {...props}>
							<i className="fas fa-upload m-2 p-1"></i>
							<span className="upload-text">Upload Image</span>
						</Button>
					)}
				</FileButton>
			</div>
		</div>
	);
};

ImgUploader.defaultProps = {
	imgError: '',
};

ImgUploader.propTypes = {
	imgError: PropTypes.string,
	handleImage: PropTypes.func.isRequired,
	isRequired: PropTypes.bool,
	label: PropTypes.string,
	instruction: PropTypes.string,
	imgID: PropTypes.string.isRequired,
};

export default ImgUploader;
