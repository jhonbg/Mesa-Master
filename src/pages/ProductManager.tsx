import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpAction from "../componets/middlewares/HttpAction";
import {Container, Toolbar, Button, Typography, AppBar, Box, Drawer, List , ListItem, ListItemText, Tooltip, Card, CardHeader, CardContent, Collapse, TextField} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton,  IconButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import ModalMessage from '../componets/common/ModalMessage';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


const ProductManager: React.FC = () => {
  const [expandedState, setExpandedState] = React.useState<{ [key: string]: boolean }>({});

  const handleExpandClick = (product: any) => {
    setExpandedState((prevState) => ({
      ...prevState,
      [product.idProducto]: !prevState[product.idProducto],      
      
    }));
    setNewProductNombre(product.nombre);
    setNewProductPrecio(product.precio);
    setNewProductDescripcion(product.descripcion);
  };

    type Product = {
        idProducto: number;
        nombre: string;
        precio: number;
        descripcion: string;
      };

    const { token } = useParams<{ token?: string }>();
    const [error, setError] = useState('');
    const [editedProducto, setEditedProducto] = useState<Product | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [userRol, setUserRol] = useState();
    const [userNombre, setUserNombre] = useState();
    const [userEstado, setUserEstado] = useState();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userInactivity, setUserInactivity] = useState(true);
    const [productList, setProductList] = useState<Product[]>([]);
    const [searchName, setSearchName] = useState("");
    const [newProductNombre, setNewProductNombre] = useState('');
    const [newProductPrecio, setNewProductPrecio] = useState<string>('');
    const [newProductDescripcion, setNewProductDescripcion] = useState('');
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    let timeout: NodeJS.Timeout | null = null;
    
  const handleOpenModal = (message: string) => {
    setModalMessage(message);
    setOpenModal(true);
  };    
  // Función para cerrar el modal
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
    }, 1800000);
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

  const handleProductForm = () => {
    navigate(`/ProductForm/${token}`)
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

const handleSubmit = async (idProducto: number) => {
try {
  
  const jsonUser = {
      "idProducto": idProducto,
      "nombre": newProductNombre,
      "precio": parseFloat(newProductPrecio),
      "descripcion": newProductDescripcion
      };  
      console.log(jsonUser);
  const response = await axios.put('http://localhost:8090/laempacadora/api/productos/update', jsonUser);
  setError('');
  setEditedProducto(response.data);
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

const styleButtonMenu = {
    backgroundColor: "transparent",
    color: 'rgb(12, 12, 133)',
    border: 'none',
    outline: 'none',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
    borderRadius: '5px',
    marginTop:'5%'
};


useEffect(() => {
  if (editedProducto) {
     window.location.reload(); 
  }
}, [editedProducto]);
       
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
        const fetchProductList = async () => {
          try {
            let url = 'http://localhost:8090/laempacadora/api/productos/all';
            if (searchName !== '') {
              url = `http://localhost:8090/laempacadora/api/productos/search/${searchName}`;
            }
            const response = await axios.get(url);
            setProductList(response.data);
          } catch (error) {
            console.error('Error fetching product list:', error);
          }
        };
        fetchProductList();
      }, [searchName]);

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
                if(response.data.rol !== 'SUPER_USER' && response.data.rol !== 'ADMINISTRADOR')
                  {
                    navigate('/')
                  }
            } catch (error) {
                //alert('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');
                handleOpenModal('¡Tu sesión ha expirado! Por favor, inicia sesión nuevamente.');     
                //navigate(`/`);
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
            <Container maxWidth="xs" style={{ flex: "200", width: "100%"}}>
            <Container
              maxWidth="xs"
              style={{
                flex: "200",
                width: "100%",
                borderStyle: 'solid',
                borderColor: "rgb(230, 230, 230)",
                flexDirection: 'row',
                maxHeight: '400px',
                overflowY: 'auto',
              }}
            >
                <TextField
                  label="Buscar por Nombre"
                  variant="outlined"
                  value={searchName}
                  onChange={handleSearchChange}
                  style={{ marginBottom: '10px', marginTop: '10px'}}
                />
                  {productList.map((product, index) => (
                   <Card key={product.idProducto} sx={{ maxWidth: 345, marginBottom: '10px', marginTop: index === 0 ? '10px' : 0 }}>
                   <CardHeader
                     title={
                       <Typography variant="body1" component="div">
                         {product.nombre}
                       </Typography>
                     }
                     subheader={
                       <Typography variant="body2" color="text.secondary" component="div">
                         <div>
                            <strong>Precio:</strong> {`$${product.precio}`}
                          </div>
                          <div>
                            <strong>Descripcion:</strong> {`${product.descripcion}`}
                          </div>
                       </Typography>
                     }
                     action={
                       <ExpandMore
                         expand={expandedState[product.idProducto]}
                         onClick={() => handleExpandClick(product)}
                         aria-expanded={expandedState[product.idProducto]}
                         aria-label="Mostrar más"
                       >
                         <ExpandMoreIcon sx={{ fontSize: '1.5rem' }} />
                       </ExpandMore>
                     }
                   />
                   <Collapse in={expandedState[product.idProducto]} timeout="auto" unmountOnExit>
                     <CardContent>
                      <form onSubmit={(e) =>{
                        e.preventDefault();
                        handleSubmit(product.idProducto)
                      }}>                       
                        <TextField
                          id="outlined-string"
                          label="Nombre Producto"
                          type="string"
                          sx={{ width: 300, marginBottom:'10px',marginLeft:'-10px' }}
                          defaultValue={product.nombre}
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
                          defaultValue={product.precio}
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
                          defaultValue={product.descripcion}
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
                          EDITAR PRODUCTO
                        </Button>
                       </form>
                     </CardContent>
                   </Collapse>
                 </Card>                 
                  ))}
                </Container>
                <Container style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <Button style={styleButtonMenu} variant="contained" onClick={handleProductForm}>Registrar Producto</Button>
                </Container>
            </Container>
        </Paper>
      </Box>
      <ModalMessage open={openModal} onClose={handleCloseModal} message={modalMessage} />
      </>
    );
};

export default ProductManager;