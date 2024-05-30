import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpAction from "../componets/middlewares/HttpAction";
import { Container, Toolbar, Button, Typography, AppBar, Box, Drawer, List , ListItem, ListItemText, Tooltip  } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { experimentalStyled as styled } from '@mui/material/styles';
import ModalMessage from '../componets/common/ModalMessage';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const InitialPage: React.FC = () => {
    
    const { token } = useParams<{ token?: string }>();
    const [userData, setUserData] = useState<any>(null);
    const [userRol, setUserRol] = useState();
    const [userNombre, setUserNombre] = useState();
    const [userEstado, setUserEstado] = useState();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userInactivity, setUserInactivity] = useState(true);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    let timeout: NodeJS.Timeout | null = null;
    
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
      handleOpenModal('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');                  
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
                const response = await HttpAction.get(`https://mesamaster-backend.onrender.com/empleado/${token}`);
                //console.log(response);
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

      const handleLogOut = () => {
        navigate(`/`);
      };
      const handleNewOrder = () => {
        navigate(`/NewOrder/${token}`);
      };
      const handleUserManager = () => {
        navigate(`/UserManager/${token}`);
      };

      const handleProductNew = () => 
        {
          navigate(`/ProductManager/${token}`);
        };

      const handleTables = () => 
        {
          navigate(`/ViewTables/${token}`);
        };

      const handlePedido = () => 
        {
          navigate(`/Pedido/${token}`);
        }  

      const styleButtonMenu = {
        backgroundColor: "transparent",
        color: 'rgb(12, 12, 133)',
        marginLeft: 'auto',
        border: 'none',
        outline: 'none', 
        boxShadow: 'none',
      };
      

    

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
          <Container maxWidth="xs" style={{ flex: "200", width: "100%" }}>
        <Grid container spacing={3} direction="column">
            {(userRol === 'MESERO' ||userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR') && <Grid xs>
                <Item>
                    <Button variant="contained" style={styleButtonMenu} onClick={handleNewOrder} >Pedido Nuevo</Button>       

                </Item>
            </Grid>}
            {(userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR' ||userRol === 'MESERO'||userRol === 'GENERAL') && <Grid xs>
                <Item>
                    <Button variant="contained"style={styleButtonMenu} onClick={handlePedido}>Administración de Pedidos</Button>
                </Item>
            </Grid>}
            {(userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR' ||userRol === 'MESERO')&& <Grid xs>
                <Item>
                    <Button variant="contained" style={styleButtonMenu} onClick={handleTables}>Mesas</Button>
                </Item>
            </Grid>}
            {(userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR') && <Grid xs>
                <Item>        
                    <Button variant="contained" style={styleButtonMenu} onClick={handleProductNew}>Menu Productos</Button>
                </Item>
            </Grid>}
            {(userRol === 'SUPER_USER'||userRol === 'ADMINISTRADOR') && <Grid xs>
                <Item>
                    <Button variant="contained" style={styleButtonMenu} onClick={handleUserManager}>Administrar Empleado</Button>
                </Item>
            </Grid>} 
        </Grid>
        </Container>
          </Paper>
      </Box>
      <ModalMessage open={openModal} onClose={handleCloseModal} message={modalMessage} />
      </>
    );
};

export default InitialPage;