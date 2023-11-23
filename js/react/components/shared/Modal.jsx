import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Modal = forwardRef(({ title, body, footer, sideContent }, ref) => (
    <div
        className="modal fade show"
        // id="authModal"
        tabIndex="-1"
        aria-modal="true"
        role="dialog"
        style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'block',
        }}
    >
        <div
            className="modal-dialog modal-dialog-centered d-flex justify-content-between align-items-center"
            style={{ maxWidth: 'fit-content' }}
        >
            <div
                className="modal-content"
                style={{ width: '900px', height: '600px', margin: 'auto 1rem' }}
            >
                <div
                    ref={ref}
                    className="auth-modal d-flex justify-content-between align-items-center flex-column flex-md-row w-100 h-100"
                >
                    <div className="h-100 d-flex flex-column justify-content-around align-items-center text-center">
                        {title}
                        {body}
                        {footer}
                    </div>
                    <div className="background-gradient h-100 d-flex justify-content-center align-items-center rounded-end px-3">
                        {sideContent}
                    </div>
                </div>
            </div>
        </div>
    </div>
));

Modal.displayName = 'Modal';

Modal.propTypes = {
    title: PropTypes.object,
    body: PropTypes.object,
    footer: PropTypes.object,
    sideContent: PropTypes.object,
};

export default Modal;
