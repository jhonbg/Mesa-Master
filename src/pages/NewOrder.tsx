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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const NewOrder: React.FC = () => {
    
    const { token } = useParams<{ token?: string }>();
    const [userData, setUserData] = useState<any>(null);
    const [userRol, setUserRol] = useState();
    const [userNombre, setUserNombre] = useState();
    const [userEstado, setUserEstado] = useState();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
      setDrawerOpen(true);
    };
    const handleInitialPage = () => {
      navigate(`/InitialPage/${token}`);
    };
          
    const handleDrawerClose = () => {
      setDrawerOpen(false);
    };

    const handleLogOut = () => {
      navigate(`/`);
    };

    const handleOrderHome = (orderType: 'mesa' | 'domicilio') => {
      navigate(`/OrderHome/${token}`, { state: { orderType } });
    };

    const styleButtonMenu = {
      backgroundColor: "transparent",
      color: 'rgb(12, 12, 133)',
      marginLeft: 'auto',
      border: 'none',
      outline: 'none', 
      boxShadow: 'none',
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
                console.error('Error al hacer la solicitud:', error);
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
            <Container maxWidth="xs" style={{ flex: "200", width: "100%" }}>
                <Grid xs>
                    <Item>
                      <Button variant="contained" style={styleButtonMenu} onClick={() => handleOrderHome('domicilio')}>Domicilio</Button>
                    </Item>
                </Grid>
                <Grid xs>
                <Item>
                <Button variant="contained" style={styleButtonMenu} onClick={() => handleOrderHome('mesa')}>Mesa</Button>
                </Item>
            </Grid>
            </Container>
        </Paper>
      </Box>
      </>
    );
};

export default NewOrder;