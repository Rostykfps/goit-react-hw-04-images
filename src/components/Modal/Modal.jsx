import { useEffect } from 'react';
import { ModalWindow, Overlay } from './Modal.styled';
const Modal = ({ largeImage, onClose }) => {
  useEffect(() => {
    const handlePressESC = ({ code }) => {
      if (code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handlePressESC);

    return () => {
      window.removeEventListener('keydown', handlePressESC);
    };
  }, [onClose]);

  const handleCloseOverlay = ({ target, currentTarget }) => {
    if (target === currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleCloseOverlay}>
      <ModalWindow>
        <img src={largeImage} alt="Large" />
      </ModalWindow>
    </Overlay>
  );
};

export default Modal;
