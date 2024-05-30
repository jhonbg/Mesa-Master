import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Grid, Box, AppBar, Toolbar, Button, Tooltip, IconButton, Drawer, List, ListItem, ListItemText} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HttpAction from "../componets/middlewares/HttpAction";
import axios from 'axios';
import TableBarIcon from '@mui/icons-material/TableBar';
import ModalCrearMesa from '../componets/common/ModalCrearMesa';

interface Mesa {
  idMesa: number;
  estado: boolean;
}

const ViewTables: React.FC = () => {
  const [userRol, setUserRol] = useState();
  const [userData, setUserData] = useState<any>(null);
  const [userNombre, setUserNombre] = useState();
  const [userEstado, setUserEstado] = useState();
  const [mesaList, setMesaList] = useState<Mesa[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { token } = useParams<{ token?: string }>();
  const [openModal, setOpenModal] = useState(false);
  const [openModalMesa, setOpenModalMesa] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

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

  const handleOpenModal = (message: string) => {
    setModalMessage(message);
    setOpenModal(true);
  };
  
  const handleOpenModalMesa = () => {
    setOpenModalMesa(true);
  }

  const handleCloseModalMesa = () => {
    setOpenModalMesa(false);
  }

  const fetchMesas = async () => {
    try {
      const response = await axios.get('https://mesamaster-backend.onrender.com/mesas/all');
      setMesaList(response.data);
    } catch (error) {
      console.error('Error fetching mesas:', error);
    }
  };

  useEffect(() => {
    fetchMesas();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            if (!token) {
                return;
            }
            const response = await HttpAction.get(`https://mesamaster-backend.onrender.com/empleado/${token}`);
            //console.log(response);
            setUserData(response.data)
            setUserRol(response.data.rol)
            setUserNombre(response.data.nombre);
            setUserEstado(response.data.estadoEmpleado);
            if(response.data.rol !== 'SUPER_USER' && response.data.rol !== 'ADMINISTRADOR' && response.data.rol !== 'MESERO')
              {
                navigate('/')
              }
        } catch (error) {
          //alert('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');
          handleOpenModal('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');                            
        }
    };

    fetchData();
}, [token]);

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: 'rgb(192, 192, 192)' }}>
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
                <LogoutIcon color="action" />
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" style={{ width: '100%' }}>
        <Container maxWidth="xs" style={{ flex: "200", width: "100%", borderStyle: 'solid', borderColor: "rgb(230, 230, 230)", backgroundColor: "rgb(230, 230, 230)", flexDirection: 'row' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Estado de Mesas
          </Typography>
          <div style={{ width: '100%', maxHeight: 'calc(60vh - 250px)', overflowY: 'auto', marginBottom: '10px' }}>
            <Grid container spacing={2}>
              {mesaList.filter((mesa) => mesa.idMesa !== 0).map((mesa) => (
                <Grid item xs={3} key={mesa.idMesa}>
                  <Paper
                    elevation={3}
                    style={{
                      width: '100%',
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: mesa.estado ? 'green' : 'white',                
                    }}
                  > 
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Tooltip title={"Mesa" + mesa.idMesa} style={{alignItems: 'center'}}>
                      <IconButton>
                        <TableBarIcon style={{ color: mesa.estado ? 'white' : 'black' }} />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="h6" align="center" color={mesa.estado ? 'white' : 'black'} style={{ marginLeft: '5px' }}>
                      Mesa {mesa.idMesa}
                    </Typography>
                  </div>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </div>
          {(userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR') && <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleOpenModalMesa}
          >
            Agregar mesa
          </Button>
          }
        </Container>
      </Box>
      <ModalCrearMesa open={openModalMesa} onClose={handleCloseModalMesa} fetchMesas={fetchMesas} />
    </>
  );
};

export default ViewTables;

