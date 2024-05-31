import React, { useState } from 'react';
import {Modal, Box, Button, Typography, TextField} from '@mui/material';
import axios from 'axios';

interface ModalMessageProps {
    open: boolean;
    onClose: () => void;
    fetchMesas: () => Promise<void>;
  }

const ModalCrearMesa: React.FC<ModalMessageProps> = ({ open, onClose, fetchMesas }) => {
    const [mesa, setMesa] = useState<number>();
    const [error, setError] = useState('');

    const handleCreacionMesa = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const jsonUser = {
                "idMesa": mesa,
                };
            const response = await axios.post('https://mesamaster-backend.onrender.com/api/mesas/save', jsonUser);
            setError('');
            fetchMesas();  
        } catch (error) {
            setError('Error al crear la mesa');
        }
        onClose();
    }
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2" textAlign='center'>
            Creación de Nueva Mesa
        </Typography>
        <form onSubmit={handleCreacionMesa}>
            <Typography id="modal-modal-description" sx={{ mt: 2, textAlign:'center'}}>
                <TextField
                    id="outlined-number"
                    label="Numero de la Mesa"
                    type='number'
                    sx={{ width: 300, marginBottom:'10px',marginLeft:'-10px'}}
                        InputLabelProps={{
                        shrink: true,
                    }}
                    required
                    onChange={(e) => {
                        const value = e.target.value;
                        setMesa(parseInt(value));
                    }}
                />   
            </Typography>   
            <Button type='submit'>Crear Mesa</Button>
            <Button onClick={onClose}>Cerrar</Button>
            </form>  
      </Box>
    </Modal>
  );
}

export default ModalCrearMesa;