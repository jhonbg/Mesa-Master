import { useNavigate, Link} from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Tooltip, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText} from '@mui/material';
import axios from 'axios';
import ModalMessage from '../componets/common/ModalMessage';
import LogoutIcon from '@mui/icons-material/Logout';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrderContext } from './OrderContextProps';
import { useParams } from 'react-router-dom';
import HttpAction from "../componets/middlewares/HttpAction";
import Autocomplete from '@mui/material/Autocomplete';
import moment from 'moment';

const OrderHome: React.FC = () => {
    const location = useLocation();
    const orderType = location.state && location.state.orderType;
    const [estadoMesa, setEstadoMesa] = useState(false);
    const [mesaList, setMesaList] = useState<any[]>([]);
    const { idPedido, setIdPedido } = useOrderContext();
    const [idMesa, setIdMesa] = useState(0);  
    const [error, setError] = useState('');
    const { token } = useParams<{ token?: string }>();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [userId, setUserId] = useState('');
    const [userRol, setUserRol] = useState();
    const [userNombre, setUserNombre] = useState();
    const [userEstado, setUserEstado] = useState();
    const [newNameCustomer, setNameCustomer] = useState('');
    const [newAddressCustomer, setAddressCustomer] = useState<string>('');
    const [newPhoneCustomer, setNewPhoneCustomer] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
          const fechaInicial = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
          const fechaEntrega = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
          const diff = moment.duration(moment(fechaEntrega).diff(moment(fechaInicial)));
          const horas = diff.hours().toString().padStart(2, '0');
          const minutos = diff.minutes().toString().padStart(2, '0');
          const segundos = diff.seconds().toString().padStart(2, '0');
          const tiempoEntrega = `${horas}:${minutos}:${segundos}`;
          const jsonUser = {
              "estadoPedido": 0,
              "precioFinal": 0,
              "fechaInicial": fechaInicial,
              "fechaEntrega": fechaEntrega,
              "tiempoEntrega": tiempoEntrega,
              "idEmpleado": userId,
              "idMesa":idMesa,
              "nombre": newNameCustomer,
              "direccion": newAddressCustomer,
              "telefono": newPhoneCustomer
              };
          const response = await axios.post('http://localhost:8090/laempacadora/api/pedidos/save', jsonUser);
          const idPedido = response.data.idPedido;
          setIdPedido(idPedido);
          handleMesa();
          navigate(`/AddProduct/${token}`);
      } catch (error) {
          console.log(error)
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                setError('El ID del usuario ya existe');
            } else {
                setError('Error al iniciar servicio back.');
            }
        } else {
            setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        }
      }
  };

  const handleMesa = async () => {
    try {
      if (idMesa !== 0) { 
        const jsonTable = {
          "idMesa": idMesa,
          "estado": true
        };
        const response = await axios.put('http://localhost:8090/laempacadora/api/mesas/actualizar', jsonTable);
        setError('');
      }
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError('El ID del usuario ya existe');
        } else {
          setError('Error al iniciar servicio back.');
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

      const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/');
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
      const fetchMesas = async () => {
        try {
          const response = await axios.get('http://localhost:8090/laempacadora/api/mesas/all');
          const filteredMesas = response.data.filter((mesa: any) => mesa.idMesa !== 0 && !mesa.estado);
          setMesaList(filteredMesas);
        } catch (error) {
          console.error('Error fetching mesas:', error);
        }
      };
    
      fetchMesas();
    }, []);  

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    return;
                }
                const response = await HttpAction.get(`http://localhost:8090/laempacadora/api/empleado/${token}`);
                setUserData(response.data)
                setUserId(response.data.idEmpleado)
                setUserRol(response.data.rol)
                setUserNombre(response.data.nombre);
                setUserEstado(response.data.estadoEmpleado);
                if(response.data.rol !== 'SUPER_USER' && response.data.rol !== 'ADMINISTRADOR' && response.data.rol !== 'MESERO')
                  {
                    navigate('/')
                  }
            } catch (error) {
                handleOpenModal('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');     
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
          >
          </Box>
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
                  <Typography variant="h4" gutterBottom style={{ color: "rgb(12,12,133)", fontWeight:'bold' }}>Registrar Pedido</Typography>
                  {error && <Typography variant="body1" color="error" gutterBottom>{error}</Typography>}
                  <form onSubmit={handleSubmit}>
                  {orderType === 'mesa' && mesaList.length > 0 && (
                    <Autocomplete
                      id="combo-box-demo"
                      options={mesaList}
                      sx={{ width: '100%', marginBottom: '10px' }}
                      getOptionLabel={(option) => `Mesa ${option.idMesa}`}
                      onChange={(event, newValue) => {
                        if (newValue !== null) {
                          setIdMesa(newValue.idMesa);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Seleccionar Mesa"
                          inputProps={{
                            ...params.inputProps,
                            required: true
                          }}
                          sx={{
                            width: '100%',
                            marginLeft: 0,
                            marginBottom: '10px'
                          }}
                        />
                      )}
                    />
                  )}
                  {orderType === 'domicilio' && mesaList.length > 0 && (
                    <TextField
                      id="outlined-string"
                      label="Nombre Cliente"
                      type="string"
                      sx={{ width: '100%', marginBottom:'10px' }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      onChange={(e) => {
                        const value = e.target.value;
                        setNameCustomer(value);
                      }}
                    />
                  )}
                  {orderType === 'domicilio' && mesaList.length > 0 && (
                    <TextField
                      id="outlined-string"
                      label="Direccion"
                      type="string"
                      sx={{ width: '100%', marginBottom:'10px' }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      onChange={(e) => {
                        const value = e.target.value;
                        setAddressCustomer(value);
                      }}
                    />
                  )}
                  {orderType === 'domicilio' && mesaList.length > 0 && (
                    <TextField
                      id="outlined-string"
                      label="Telefono"
                      type="string"
                      sx={{ width: '100%', marginBottom:'10px' }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewPhoneCustomer(value);
                      }}
                    />
                  )}  
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      style={{ width: '100%' }}
                    >
                      Agregar Productos
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

export default OrderHome;
