import PropTypes from 'prop-types';

export default function LoadingCard({ enableButtons = false }) {
	return (
		<div className="card border-0 shadow my-3" aria-hidden="true">
			<svg
				className="bd-placeholder-img card-img-top"
				width="100%"
				height="180"
				xmlns="http://www.w3.org/2000/svg"
				role="img"
				aria-label="Placeholder"
				preserveAspectRatio="xMidYMid slice"
				focusable="false"
			>
				<title>Placeholder</title>
				<rect width="100%" height="100%" fill="#868e96"></rect>
			</svg>
			<div className="card-body">
				<h5 className="card-title text-center placeholder-glow">
					<span className="placeholder col-8"></span>
				</h5>
				<p className="card-text placeholder-glow">
					<span className="placeholder col-7"></span>
					<span className="placeholder col-6"></span>
					<span className="placeholder col-8"></span>
				</p>
				{enableButtons && (
					<div className="d-md-flex">
						<button className="btn btn-primary disabled placeholder col-12 mb-2 mb-md-0 col-md-6 me-md-1"></button>
						<button className="btn btn-dark bg-dark placeholder col-12 col-md-6 ms-md-1"></button>
					</div>
				)}
			</div>
		</div>
	);
}

LoadingCard.propTypes = {
	enableButtons: PropTypes.bool,
};
