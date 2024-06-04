import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Paper, Tab, Tabs, Container, Tooltip, TableBody, TableRow, TableCell, Table, TableHead, Drawer, List, ListItem, ListItemText} from '@mui/material';
import axios from 'axios';
import HttpAction from "../componets/middlewares/HttpAction";
import LogoutIcon from '@mui/icons-material/Logout';
import { experimentalStyled as styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ModalPedido from '../componets/common/ModalPedido';
import './Pedidos.css';

interface Pedido {
  idPedido: number;
  estadoPedido: string;
  precioFinal: number;
  fechaInicial: string;
  fechaEntrega: string;
  tiempoEntrega: string;
  idEmpleado: string;
  idMesa: number;
  nombre: string;
  direccion: string;
  telefono: string;
}

const steps = ['TOMADO', 'EN_PREPARACION', 'PREPARADO', 'ENTREGADO', 'PAGADO'];

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected': {
    borderBottom: 'none',
  },
  backgroundColor: 'white',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: 0,
  backgroundColor: 'white',
}));

const Pedidos: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [openModalPedido, setOpenModalPedido] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pedidosEnPreparacion, setPedidosEnPreparacion] = useState<Pedido[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userRol, setUserRol] = useState();
  const [userNombre, setUserNombre] = useState();
  const [userEstado, setUserEstado] = useState();
  const [pedidoSelect, setpedidoSelect] = useState<Pedido>()

  const handleRowClick = async (idPedido: number) => {
    setSelectedRow(idPedido);
    const responseOrder = await axios.get(`https://mesamaster-backend.onrender.com/api/pedidos/${idPedido}`)
    setpedidoSelect(responseOrder.data);
  };

  const handleState = async (estado: number) => {
    try{
      const jsonOrder = {
        "idPedido": selectedRow,
        "estadoPedido": estado
      }
      const response = await axios.put('https://mesamaster-backend.onrender.com/api/pedidos/updateState', jsonOrder)

      setPedidosEnPreparacion(prevPedidos => prevPedidos.filter(pedido => pedido.idPedido !== selectedRow));
    }
    catch(error)
    {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
            setError('El ID del usuario ya existe');
        } else {
            setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        } 
    }
    else {
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    } 
  }
};

const handleStateAndTable = async (estado: number) => {
  try {
    const jsonOrder = {
      "idPedido": selectedRow,
      "estadoPedido": estado,
    };
    const response = await axios.put('https://mesamaster-backend.onrender.com/api/pedidos/updateState', jsonOrder);
    const jsonTable = {
      "idMesa": response.data.idMesa,
      "estado": false
    };
    const responseTable = await axios.put('https://mesamaster-backend.onrender.com/api/mesas/actualizar', jsonTable);

    const responseOrder = await axios.get(`https://mesamaster-backend.onrender.com/api/pedidos/${selectedRow}`)

    setpedidoSelect(responseOrder.data);

    setPedidosEnPreparacion(prevPedidos => prevPedidos.filter(pedido => pedido.idPedido !== selectedRow));
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

  const handleChange = async (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveStep(newValue);
    const response = await axios.get(`https://mesamaster-backend.onrender.com/api/pedidos/Estado/PEDIDO_${steps[newValue]}`);
    setPedidosEnPreparacion(response.data);
  };

  const handleLogOut = () => {
    navigate(`/`);
  };
  
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleInitialPage = () => {
    navigate(`/InitialPage/${token}`);
  };

  const handelOpenModalPedido = () => {
    setOpenModalPedido(true);
  };

  const handleCloseModalPedido = () => {
    setOpenModalPedido(false);
  };

  const handleOpenModal = (message: string) => {
    setModalMessage(message);
    setOpenModal(true);
  };    

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
        } catch (error) {
          //alert('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');
          handleOpenModal('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');                            
        }
    };

    fetchData();
}, [token]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://mesamaster-backend.onrender.com/api/pedidos/Estado/PEDIDO_TOMADO`);
      setPedidosEnPreparacion(response.data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <AppBar position="static" style={{backgroundColor:'rgb(192, 192, 192)', marginBottom: '10px'}}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                flexGrow: 1,
                fontfamily:  'Segoe UI',
                fontWeight: "70%",
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
      <div className='tablaPedido' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '60%', width: '100%' }}>
        <Tabs
          value={activeStep}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ width: '100%', justifyContent: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.12)', backgroundColor: 'white'}}
        >
          {steps.map((label, index) => (
            <Tab label={label} key={index}/>
          ))}
        </Tabs>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
          <StyledPaper elevation={3} sx={{ maxWidth: '100%', width: '100%', marginTop: 1, maxHeight: '70%', overflow: 'auto'}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mesa</TableCell>
                  <TableCell>Estado del Pedido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ maxHeight: '70%', overflowY: 'auto' }}>
                {pedidosEnPreparacion.map((pedido: Pedido) => (
                  <TableRow key={pedido.idPedido} onClick={() => handleRowClick(pedido.idPedido)} selected={pedido.idPedido === selectedRow}>
                    <TableCell>{pedido.idMesa === 0 ? 'Domicilio' : pedido.idMesa}</TableCell>
                    <TableCell>{pedido.estadoPedido}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledPaper>
        </Box>
        <div style={{marginLeft: 'auto', display:'flex',flexDirection:'column'}}>
          <div style={{ display: 'flex', flexDirection: 'row', marginTop:'10px'}}>
            {(activeStep == 0) && (userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR'||userRol === 'GENERAL') &&
            <Button
              variant="contained"
              style={{
                backgroundColor: 'rgb(230, 230, 230)',
                color: 'rgb(12, 12, 133)',
                marginBottom: '10px',
                marginRight: '5px',
                marginLeft:'auto'
              }}
              onClick={() => handleState(1)}
            >
              En Preparación
            </Button>}  
            {(activeStep == 1) && (userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR'||userRol === 'GENERAL') &&
            <Button
              variant="contained"
              style={{
                backgroundColor: 'rgb(230, 230, 230)',
                color: 'rgb(12, 12, 133)',
                marginBottom: '10px',
                marginLeft:'auto'
              }}
              onClick={() => handleState(2)}
            >
              Preparado
            </Button>} 
            {(activeStep == 2) && (userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR'||userRol === 'MESERO') &&
            <Button
              variant="contained"
              style={{
                backgroundColor: 'rgb(230, 230, 230)',
                color: 'rgb(12, 12, 133)',
                marginBottom: '10px',
                marginLeft:'auto'
              }}
              onClick={() => handleState(3)}
            >
              Entregado
            </Button>} 
            {(activeStep == 3) && (userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR'||userRol === 'GENERAL') &&
            <Button
              variant="contained"
              style={{
                backgroundColor: 'rgb(230, 230, 230)',
                color: 'rgb(12, 12, 133)',
                marginBottom: '10px',
                marginLeft:'auto'
              }}
              onClick={() => handelOpenModalPedido()}
            >
              Pagado
            </Button>} 
          </div> 
        </div>  
      </div>
      <ModalPedido open={openModalPedido} onClose={handleCloseModalPedido} pedido={pedidoSelect} handleStateAndTable={handleStateAndTable}/>
    </div>

  );
}

export default Pedidos;