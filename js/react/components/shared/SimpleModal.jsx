import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

function SimpleModal({ title, body, footer, onClose, open = true, hideOnClickOutside = true }) {
    const modalRef = useRef(null);
    const modalProps = {};

    if (!hideOnClickOutside) {
        modalProps['data-bs-backdrop'] = 'static';
    }

    useEffect(() => {
        const hiddenEventHandler = () => {
            if (onClose) {
                onClose();
            }
        };
        modalRef.current.addEventListener('hidden.bs.modal', hiddenEventHandler);

        return () => modalRef.current.removeEventListener('hidden.bs.modal', hiddenEventHandler);
    }, []);

    useEffect(() => {
        const modalBsInstance = window.bootstrap.Modal.getOrCreateInstance(modalRef.current);

        if (open) {
            modalBsInstance.show();
        } else {
            modalBsInstance.hide();
        }
    }, [open]);

    return (
        <div className="modal fade" ref={modalRef} tabIndex={-1} {...modalProps}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                        </button>
                    </div>
                    <div className="modal-body">{body}</div>
                    <div className="modal-footer">{footer}</div>
                </div>
            </div>
        </div>
    );
}

SimpleModal.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    body: PropTypes.object,
    footer: PropTypes.object,

    ref: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
    open: PropTypes.bool,
    onClose: PropTypes.func,
    hideOnClickOutside: PropTypes.bool,
};

export default SimpleModal;
