import PropTypes from 'prop-types';

function Modal({ title, body, footer, sideContent }) {
	return (
		<div
			className="modal fade"
			id="loginModal"
			tabIndex="-1"
			aria-labelledby="loginModalLabel"
			aria-hidden="true"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
		>
			<div
				className="modal-dialog modal-dialog-centered d-flex align-items-center justify-content-between"
				style={{ maxWidth: 'fit-content' }}
			>
				<div
					className="modal-content"
					style={{ width: '900px', height: '600px', margin: 'auto' }}
				>
					<div className="d-flex align-items-center justify-content-between w-100 h-100">
						<div
							className="h-100 d-flex flex-column justify-content-around align-items-center text-center"
							style={{ width: '65%' }}
						>
							{title}
							{body}
							{footer}
						</div>
						<div
							className="background-gradient h-100 d-flex justify-content-center align-items-center rounded-end"
							style={{ width: '35%' }}
						>
							{sideContent}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

Modal.propTypes = {
	title: PropTypes.object,
	body: PropTypes.object,
	footer: PropTypes.object,
	sideContent: PropTypes.object,
};

export default Modal;
