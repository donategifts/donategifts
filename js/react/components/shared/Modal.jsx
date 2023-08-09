import PropTypes from 'prop-types';

function Modal({ modalTitle, modalBody, modalFooter, rightSide }) {
	return (
		<div
			className="modal"
			tabIndex="-1"
			style={{
				display: 'block',
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
			}}
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
							{modalTitle}
							{modalBody}
							{modalFooter}
						</div>
						<div
							className="background-gradient h-100 d-flex justify-content-center align-items-center rounded-end"
							style={{ width: '35%' }}
						>
							{rightSide}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

Modal.propTypes = {
	modalTitle: PropTypes.object,
	modalBody: PropTypes.object,
	modalFooter: PropTypes.object,
	rightSide: PropTypes.object,
};

export default Modal;
