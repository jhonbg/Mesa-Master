import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Tooltip, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText} from '@mui/material';
import axios from 'axios';
import ModalMessage from '../componets/common/ModalMessage';
import LogoutIcon from '@mui/icons-material/Logout';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpAction from "../componets/middlewares/HttpAction";

const ProductForm: React.FC = () => {

    type Product = {
        idProducto: number;
        nombre: string;
        precio: number;
        descripcion: string;
      };

    const [error, setError] = useState('');
    const { token } = useParams<{ token?: string }>();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [userRol, setUserRol] = useState();
    const [userNombre, setUserNombre] = useState();
    const [userEstado, setUserEstado] = useState();
    const [newProductNombre, setNewProductNombre] = useState('');
    const [newProductPrecio, setNewProductPrecio] = useState<string>('');
    const [newProductDescripcion, setNewProductDescripcion] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const jsonUser = {
                "nombre": newProductNombre,
                "precio": parseFloat(newProductPrecio),
                "descripcion": newProductDescripcion
                };
            const response = await axios.post('https://mesamaster-backend.onrender.com/productos/save', jsonUser);
            setError('');
            handleOpenModal('Producto creado correctamente.');
            navigate(`/ProductManager/${token}`)
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

    const handleOpenModal = (message: string) => {
        setModalMessage(message);
        setOpenModal(true);
      };    
      // Función para cerrar el modal
      const handleCloseModal = () => {
        setOpenModal(false);
      };

      const handleLogOut = () => {
        navigate(`/`);
      };
      const handleInitialPage = () => {
        navigate(`/InitialPage/${token}`);
      };

      const handleDrawerOpen = () => {
        setDrawerOpen(true);
      };
        
      const handleDrawerClose = () => {
        setDrawerOpen(false);
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    return;
                }
                const response = await HttpAction.get(`https://mesamaster-backend.onrender.com/empleado/${token}`);
                setUserData(response.data)
                setUserRol(response.data.rol)
                setUserNombre(response.data.nombre);
                setUserEstado(response.data.estadoEmpleado);
                if(response.data.rol !== 'SUPER_USER' && response.data.rol !== 'ADMINISTRADOR')
                  {
                    navigate('/')
                  }
            } catch (error) {
                handleOpenModal('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');     
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
          </List>
        </Drawer>
        <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',          
          justifyContent: 'center', alignItems: 'center', marginTop: '5%', marginBottom:'5%' , 
          '& > :not(style)': {
            m: 2,
            width:'100%'
          },
        }}
      ></Box>
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
              <Typography variant="h4" gutterBottom style={{ color: "rgb(12,12,133)", fontWeight:'bold' }}>Registrar Producto</Typography>
              {error && <Typography variant="body1" color="error" gutterBottom>{error}</Typography>}
              <form onSubmit={handleSubmit}>
                <TextField
                    id="outlined-string"
                    label="Nombre Producto"
                    type="string"
                    sx={{ width: 300, marginBottom:'10px',marginLeft:'-10px' }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewProductNombre(value);
                      }}
                />
                <TextField
                    id="outlined-number"
                    label="Precio Producto"
                    type="number"
                    sx={{ width: 300, marginBottom:'10px',marginLeft:'-10px' }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 10 && /^\d*\.?\d{0,2}$/.test(value)) {
                          setNewProductPrecio(value);
                        }
                        }}
                />
                <TextField
                    id="outlined-string"
                    label="Descripcion"
                    type="string"
                    sx={{ width: 300, marginBottom:'10px',marginLeft:'-10px' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewProductDescripcion(value);
                    }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ width: '100%' }}
                >
                  Registrar Producto
                </Button>
              </form>
            </div>
          </Container>
          </Paper>
      </Box>
      <ModalMessage open={openModal} onClose={handleCloseModal} message={modalMessage} />
    </div> 
    );
};

export default ProductForm;