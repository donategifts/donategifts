import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

function CustomToast({ title, type, delayCloseForSeconds = 5 }) {
	const [visible, setVisible] = useState(true);
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
					className={
						'toast align-items-center text-bg-primary border-0 fade show position-fixed start-50 translate-middle-x ' +
						(type === 'error' ? 'bg-danger' : 'bg-primary')
					}
					style={{
						zIndex: 10000,
						top: '10px',
						left: '50%',
						transform: 'translateX(-50%)',
						padding: '0.5rem',
					}}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
				>
					<div className="toast-body text-center">{title}</div>
				</div>
			)}
		</>
	);
}

CustomToast.propTypes = {
	title: PropTypes.string,
	type: PropTypes.string,
	delayCloseForSeconds: PropTypes.number,
};

export default CustomToast;
