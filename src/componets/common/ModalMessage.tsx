import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface ModalMessageProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const ModalMessage: React.FC<ModalMessageProps> = ({ open, onClose, message }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Mensaje
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <Button onClick={onClose}>Cerrar</Button>
      </Box>
    </Modal>
  );
}

export default ModalMessage;
