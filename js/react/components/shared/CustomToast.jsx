import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

function CustomToast({ message, type, delayCloseForSeconds }) {
	const [visible, setVisible] = useState(true);

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
		const timer = setTimeout(() => {
			setVisible(false);
		}, delayCloseForSeconds * 1000);

		return () => clearTimeout(timer);
	}, [delayCloseForSeconds]);

	return (
		<>
			{visible && (
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
	delayCloseForSeconds: PropTypes.number,
};

CustomToast.defaultProps = {
	delayCloseForSeconds: 5,
};

export default CustomToast;
