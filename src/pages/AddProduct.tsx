import { OrderContextProvider, useOrderContext } from './OrderContextProps';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpAction from "../componets/middlewares/HttpAction";
import {Container, Toolbar, Button, Typography, AppBar, Box, Drawer, List , ListItem, ListItemText, Tooltip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton,  IconButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import ModalMessage from '../componets/common/ModalMessage';
import ModalProductos from '../componets/common/ModalProductos';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }

  interface DetallePedido {
    cantidad: number;
    estado: boolean;
    idProducto: number;
    idPedido: number;
    producto: {
      idProducto: number;
      nombre: string;
      precio: number;
      descripcion: string;
    };
  }

const AddProduct: React.FC = () => {
    const { token } = useParams<{ token?: string }>();
    const [error, setError] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [userRol, setUserRol] = useState();
    const [precioFinal, setprecioFinal] = useState<number>(0);
    const [userNombre, setUserNombre] = useState();
    const [userEstado, setUserEstado] = useState();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userInactivity, setUserInactivity] = useState(true);
    const [listaDetallePedido, setListaDetallePedido] = useState<DetallePedido[]>([]);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');  
    const [openModalProducto, setOpenModalProducto] = useState(false);
    const { idPedido } = useOrderContext();

    let timeout: NodeJS.Timeout | null = null;

  const handleDelete = (id: number) => {
    setListaDetallePedido(listaDetallePedido.filter(detallePedido => detallePedido.idProducto !== id));
  };
    
  const handleOpenModal = (message: string) => {
    setModalMessage(message);
    setOpenModal(true);
  };    
 
  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/');
  };
  const resetTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      navigate("/");
    }, 1500000);
  };

  const activityHandler = () => {
    resetTimeout();
    setUserInactivity(false);
  };  

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
    
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLogOut = () => {
    navigate(`/`);
  };
  const handleInitialPage = () => {
    navigate(`/InitialPage/${token}`);
  };
  
  const handleMostrarLista = async () => {
    try {
      let precioF = 0;
  
      // Calcular el precio final total
      listaDetallePedido.forEach((detalle) => {
        precioF += detalle.producto.precio * detalle.cantidad;
      });
  
      setprecioFinal(precioF);
  
      const jsonUserpf = {
        "idPedido": idPedido,
        "precioFinal": precioF
      };
  
      console.log(jsonUserpf);
  
      await Promise.all(listaDetallePedido.map(async (detalle) => {
        const jsonUser = {
          "idProducto": detalle.producto.idProducto,
          "cantidad": detalle.cantidad,
          "estado": false,
          "idPedido": idPedido
        };
  
        await axios.post('https://mesamaster-backend.onrender.com/api/detalleproducto/save', jsonUser);
      }));
  
      await axios.put('https://mesamaster-backend.onrender.com/api/pedidos/updateFinalPrice', jsonUserpf);
      navigate(`/InitialPage/${token}`);
  
    } catch (error) {
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

const handleOpenModalProducto = () => {
  setOpenModalProducto(true);
};

const handleCloseModalProducto = () => {
  setOpenModalProducto(false);
};

const updateDetallePedido = (newDetallePedido: DetallePedido) => {
  const existingDetalle = listaDetallePedido.find(detalle => detalle.idProducto === newDetallePedido.idProducto);
  if (existingDetalle) {
    existingDetalle.cantidad += newDetallePedido.cantidad;
    setListaDetallePedido([...listaDetallePedido]);
  } else {
    setListaDetallePedido([...listaDetallePedido, newDetallePedido]);
  }
};   
      useEffect(() => {
        resetTimeout();
        window.addEventListener("click", activityHandler);
        window.addEventListener("keypress", activityHandler);
        window.addEventListener("scroll", activityHandler);
        window.addEventListener("mousemove", activityHandler);
    
        return () => {
          window.removeEventListener("click", activityHandler);
          window.removeEventListener("keypress", activityHandler);
          window.removeEventListener("scroll", activityHandler);
          window.removeEventListener("mousemove", activityHandler);
          if (timeout) {
            clearTimeout(timeout);
          }
        };
      }, []);

      useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    return;
                }
                const response = await HttpAction.get(`https://mesamaster-backend.onrender.com/api/empleado/${token}`);
                setUserData(response.data)
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
    <>
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
        <Paper elevation={24} style={{ padding: '50px', marginBottom: '50px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Producto</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Precio</TableCell> 
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
              {listaDetallePedido.map((detalle, index) => (
                  <TableRow key={index}>
                    <TableCell>{detalle.producto.idProducto}</TableCell>
                    <TableCell>{detalle.producto.nombre}</TableCell>
                    <TableCell>{detalle.producto.precio}</TableCell> 
                    <TableCell>{detalle.cantidad}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(detalle.idProducto)}>
                      <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleOpenModalProducto}
            >
              Agregar Productos
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleMostrarLista}
            >
              Confirmar Pedido
            </Button>
          </Container>
        </Paper>
      </Box>
      <ModalMessage open={openModal} onClose={handleCloseModal} message={modalMessage} />
      <ModalProductos idPedido={idPedido as number} open={openModalProducto} onClose={handleCloseModalProducto} updateDetallePedido={updateDetallePedido}/>
      </>
  );
};

export default AddProduct;