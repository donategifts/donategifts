import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

function CustomToast({ message, type, delayCloseForSeconds, isVisible, setIsVisible }) {
	const getBackgroundType = () => {
		switch (type) {
			case 'error':
				return 'bg-danger';
			case 'success':
				return 'bg-success';
			case 'warning':
				return 'bg-warning';
			default:
				return 'bg-primary';
		}
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsVisible(false);
		}, delayCloseForSeconds * 1000);

		return () => clearTimeout(timeout);
	}, [delayCloseForSeconds]);

	return (
		<>
			{isVisible && (
				<div
					id="toast"
					className={`toast position-fixed p-3 show ${getBackgroundType(type)}`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="text-white text-center">
						<div className="toast-body fs-5">{message}</div>
					</div>
				</div>
			)}
		</>
	);
}

CustomToast.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	isVisible: PropTypes.bool.isRequired,
	setIsVisible: PropTypes.func.isRequired,
	delayCloseForSeconds: PropTypes.number,
};

CustomToast.defaultProps = {
	delayCloseForSeconds: 5,
};

export default CustomToast;
