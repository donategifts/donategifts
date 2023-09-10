import PropTypes from 'prop-types';
import React from 'react';

function CustomToast({ title, type }) {
	return (
		<div
			className={
				'toast align-items-center text-bg-primary border-0 fade show position-absolute start-50 translate-middle-x ' +
				(type === 'error' ? 'bg-danger' : 'bg-primary')
			}
			style={{ zIndex: 10000, top: '10px', padding: '0.5rem' }}
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			<div className="toast-body text-center">{title}</div>
		</div>
	);
}

CustomToast.propTypes = {
	title: PropTypes.string,
	type: PropTypes.string,
};
export default CustomToast;
