import PropTypes from 'prop-types';

const ImgUploader = ({ imgSrc, imgError, handleImg, required, label, instruction, imgID }) => {
	// const handleImage = (e, setImage, setError, fieldName) => {
	// 	const file = e.target.files[0];
	// 	if (file) {
	// 		setImage(URL.createObjectURL(file));
	// 		setError('');
	// 		setFormData((data) => ({
	// 			...data,
	// 			[fieldName]: file,
	// 		}));
	// 	}
	// };

	return (
		<div className="uploader form-group py-4 d-flex flex-md-row flex-sm-column justify-content-center align-items-start">
			<div className="px-3 pt-3 pb-0">
				<img
					src={imgSrc || `/img/img-placeholder.png`}
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
				<input
					type="file"
					name={imgID}
					id={imgID}
					className="form-control mb-2"
					onChange={handleImg}
					required={required}
				/>
			</div>
		</div>
	);
};

ImgUploader.defaultProps = {
	imgError: '',
};

ImgUploader.propTypes = {
	imgSrc: PropTypes.string,
	imgError: PropTypes.string,
	handleImg: PropTypes.func,
	required: PropTypes.bool,
	label: PropTypes.string,
	instruction: PropTypes.string,
	imgID: PropTypes.string,
};

export default ImgUploader;
