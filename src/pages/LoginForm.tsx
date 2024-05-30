import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import axios from 'axios';
import ModalMessage from '../componets/common/ModalMessage';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const jsonLogin = {
                "idEmpleado": username,
                "contraseña": password
                } 
            const response = await axios.post('https://mesamaster-backend.onrender.com/auth/login', jsonLogin);
            if (response.data && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                navigate(`/InitialPage/${token}`);
            } else {
                setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            }
        } catch (error) {
            setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',          
          justifyContent: 'center', alignItems: 'center', marginTop: '10%',
          '& > :not(style)': {
            m: 2,
            width:'100%'
          },
        }}
      >
        <Paper elevation={24} style={{ padding: '50px', marginBottom: '50px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <Container maxWidth="xs" style={{ flex: "200", width: "100%" }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center", color: "white" }}>
              <img src={require("./fotos/Logotipo Restaurante Ilustración Beige.png")} alt="La Empacadora" style={{ maxWidth: '100%', height: 'auto', alignItems: "center" }} />
              <Typography variant="h4" gutterBottom style={{ color: "rgb(243,164,102)", fontWeight:'bold', WebkitTextStroke: '1.3px black', fontFamily:'serif'}}>Iniciar Sesión</Typography>
              {error && <Typography variant="body1" color="error" gutterBottom>{error}</Typography>}
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Nombre de Usuario"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ marginBottom: '20px', width: '100%', backgroundColor: "white" }}
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ marginBottom: '20px', width: '100%', backgroundColor: "white" }}
                />
                <Button
                  variant="contained"
                  color="inherit"
                  type="submit"
                  style={{ width: '100%', backgroundColor:'black'}}
                >
                  Iniciar Sesión
                </Button>
              </form>
            </div>
          </Container>
          </Paper>
      </Box>
    </div> 
    );
};

export default LoginForm;


