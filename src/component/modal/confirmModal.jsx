import React from 'react';
import '../style/modal.css'; // Ensure modal styles exist

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-btn">Yes</button>
                    <button onClick={onCancel} className="cancel-btn">No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
