import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import HttpAction from "../componets/middlewares/HttpAction";
import { Container, Toolbar, Button, Typography, AppBar, Box, ButtonGroup, Drawer, List , ListItem, ListItemText, Tooltip, IconButton, TextField, InputLabel, NativeSelect} from '@mui/material';
import Paper from '@mui/material/Paper';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';


const UserForm: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [userNombre, setUserNombre] = useState('');
    const [userRol, setUserRol] = useState('');
    const [userEstado, setUserEstado] = useState('');
    const [newUserId, setNewUserid] = useState('');
    const [newUserNombre, setNewUserNombre] = useState('');
    const [password, setPassword] = useState('');
    const [newUserRol, setNewUserRol] = useState<number>(0);
    const [newUserEstado, setNewUserEstado] = useState<number>(0);
    const [newUserSalario, setNewUserSalario] = useState('');
    const [error, setError] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { token } = useParams<{ token?: string }>();
    const navigate = useNavigate();

    const handleLogOut = () => {
      navigate(`/`);
    };

    const handleDrawerOpen = () => {
      setDrawerOpen(true);
    };
    const handleInitialPage = () => {
      navigate(`/InitialPage/${token}`);
    };
        
    const handleDrawerClose = () => {
      setDrawerOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const jsonUser = {
                "idEmpleado": newUserId,
                "nombre": newUserNombre,
                "contraseña": password,
                "rol": newUserRol,
                "estadoEmpleado": newUserEstado,
                "salario": parseFloat(newUserSalario)
                };
            const response = await axios.post('http://localhost:8090/laempacadora/api/auth/register', jsonUser);
            setError('');
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 404) {
                  setError('El ID del usuario ya existe');
              } else {
                  setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
              }
          } else {
              setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
          }
        }
    };

    useEffect(() => {
      const fetchData = async () => {
          try {
              if (!token) {
                  return;
              }
              const response = await HttpAction.get(`http://localhost:8090/laempacadora/api/empleado/${token}`);
              setUserData(response.data)
              setUserRol(response.data.rol)
              setUserNombre(response.data.nombre);
              setUserEstado(response.data.estadoEmpleado);
              if(response.data.rol !== 'SUPER_USER')
                {
                  navigate('/')
                }
          } catch (error) {
              alert('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');
              navigate(`/`);
          }
      };

      fetchData();
    }, [token]);

    return (
    <div>
      <AppBar position="static" style={{backgroundColor:'rgb(192, 192, 192)'}}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
            <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  flexGrow: 1,
                  fontfamily:  'Segoe UI',
                  fontWeight: 700,
                  color: "rgb(243,164,102)",
                  WebkitTextStroke: '1px black', 
                  fontFamily:'cursive',
                  textDecoration: 'none',
                }}
              >
                MesaMaster
              </Typography>
              <Button variant="contained" style={{ backgroundColor: "rgb(230, 230, 230)", color: 'rgb(12,12,133)', marginLeft: 'auto' }} onClick={handleDrawerOpen}>Perfil</Button>
              <Button variant="contained" style={{ backgroundColor: "rgb(230, 230, 230)", color: 'rgb(12,12,133)', marginLeft: 'auto' }} onClick={handleInitialPage}>Menu Inicial</Button>
              <Tooltip title="Cerrar Sesión">
                <IconButton onClick={handleLogOut}>
                  <LogoutIcon  color="action" />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </Container>
        </AppBar>
        <Drawer
          anchor="top"
          open={drawerOpen}
          onClose={handleDrawerClose}
        >
          <List>
            <ListItem button onClick={handleDrawerClose}>
              <ListItemText primary={"Nombre: " + userNombre} />
            </ListItem>
            <ListItem button onClick={handleDrawerClose}>
              <ListItemText primary={"Cargo: " + userRol} />
            </ListItem>
            <ListItem button onClick={handleDrawerClose}>
              <ListItemText primary={"Estado: " + userEstado} />
            </ListItem>
            {/* Agrega más elementos de menú según sea necesario */}
          </List>
        </Drawer>
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
                <Typography variant="h4" gutterBottom style={{ color: "rgb(12,12,133)", fontWeight:'bold' }}>Registro Empleado</Typography>
                {error && <Typography variant="body1" color="error" gutterBottom>{error}</Typography>}
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Cedula del Empleado"
                    variant="outlined"
                    value={newUserId}
                    onChange={(e) => setNewUserid(e.target.value)}
                    style={{ marginBottom: '20px', width: '100%', backgroundColor: "white" }}
                  />
                  <TextField
                    label="Nombre del Empleado"
                    variant="outlined"
                    value={newUserNombre}
                    onChange={(e) => setNewUserNombre(e.target.value)}
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
                  <InputLabel
                    variant="standard"
                    htmlFor="uncontrolled-native"
                    style={{ width: '100%', backgroundColor: 'white', textAlign: 'left', paddingLeft: '0' }}
                  >
                    Rol del Empleado
                  </InputLabel>
                  <NativeSelect style={{ marginBottom: '20px', width: '100%', backgroundColor: "white" }}
                    defaultValue={0}
                    inputProps={{
                    name: 'Rol del Empleado',
                    id: 'uncontrolled-native',
                    }}
                    onChange={(e) => setNewUserRol(parseInt(e.target.value))}
                  >
                    <option value={0}>MESERO</option>
                    <option value={2}>ADMINISTRADOR</option>
                    <option value={3}>GENERAL</option>
                  </NativeSelect>
                  <InputLabel
                    variant="standard"
                    htmlFor="uncontrolled-native"
                    style={{ width: '100%', backgroundColor: 'white', textAlign: 'left', paddingLeft: '0' }}
                  >
                    Estado del Empleado
                  </InputLabel>
                  <NativeSelect style={{ marginBottom: '20px', width: '100%', backgroundColor: "white" }}
                    defaultValue={0}
                    inputProps={{
                    name: 'Estado del Empleado',
                    id: 'uncontrolled-native',
                    }}
                    onChange={(e) => setNewUserEstado(parseInt(e.target.value))}
                  >
                    <option value={0}>ACTIVO</option>
                  </NativeSelect>
                  <TextField
                    label="Salario del Empleado"
                    variant="outlined"
                    value={newUserSalario}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 10 && /^\d*\.?\d{0,2}$/.test(value))
                        {
                          setNewUserSalario(value);
                        }
                    }}
                    style={{ marginBottom: '20px', width: '100%', backgroundColor: "white" }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ width: '100%' }}
                  >
                    REGISTRAR EMPLEADO
                  </Button>
                </form>
              </div>
            </Container>
            </Paper>
        </Box>
    </div>
    );
};

export default UserForm;