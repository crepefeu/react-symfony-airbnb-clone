import React from 'react';
import Modal from './Modal';

const ConfirmationModal = ({
    show,
    onClose,
    onConfirm,
    title,
    message,
    isLoading,
    danger = true
}) => {
    return (
        <Modal
            isOpen={show}
            onClose={onClose}
            maxWidth="sm"
        >
            <div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">{title}</h3>
                    <p className="text-gray-600">{message}</p>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-lg ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
