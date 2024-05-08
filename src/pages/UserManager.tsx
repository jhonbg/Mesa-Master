import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpAction from "../componets/middlewares/HttpAction";
import {Container, Toolbar, Button, Typography, AppBar, Box, Drawer, List , ListItem, ListItemText, Tooltip, Card, CardHeader, CardContent, Collapse, TextField, NativeSelect, InputLabel} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton,  IconButtonProps } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
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


const UserManager: React.FC = () => {
  const [expandedState, setExpandedState] = React.useState<{ [key: string]: boolean }>({});

  const handleExpandClick = (empleado: any) => {
    setExpandedState((prevState) => ({
      ...prevState,
      [empleado.idEmpleado]: !prevState[empleado.idEmpleado],      
      
    }));
    setNewUserRol(empleado.rol);
    setNewUserEstado(empleado.estadoEmpleado);
    setNewUserSalario(empleado.salario);
  };

    type Employee = {
        idEmpleado: string;
        nombre: string;
        contraseña: string;
        rol: string;
        estadoEmpleado: string;
        salario: number;
      };

    type Role = 'MESERO' | 'GENERAL' | 'SUPER_USER' | 'ADMINISTRADOR';  

    const { token } = useParams<{ token?: string }>();
    const [error, setError] = useState('');
    const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [userRol, setUserRol] = useState();
    const [userNombre, setUserNombre] = useState();
    const [userEstado, setUserEstado] = useState();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userInactivity, setUserInactivity] = useState(true);
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [searchId, setSearchId] = useState("");
    const [newUserSalario, setNewUserSalario] = useState<string>('');
    const [newUserRol, setNewUserRol] = useState<number>(0);
    const [newUserEstado, setNewUserEstado] = useState<number>(0);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    let timeout: NodeJS.Timeout | null = null;

    const rolesOrder: Record<Role, number> = {
        'ADMINISTRADOR': 1,
        'MESERO' : 2,
        'SUPER_USER': 3,
        'GENERAL' : 4
      };

      const listRol = [        
        { label:'MESERO', value :   0},
        { label:'ADMINISTRADOR', value :   2},
        { label:'GENERAL', value :   3}
      ];
      const listEstadoEmpleado = [        
        { label:'ACTIVO', value :   0},
        { label:'INACTIVO', value :   1},
        { label:'EN_VACACIONES', value :   2}
      ];

      const filteredEmployeeList = employeeList
  .filter(employee => employee.rol !== 'SUPER_USER')
  .filter(employee => employee.idEmpleado.includes(searchId))
  .sort((a, b) => {
    if ((a.estadoEmpleado === 'INACTIVO' && b.estadoEmpleado !== 'INACTIVO') || (a.estadoEmpleado === 'EN_VACACIONES' && b.estadoEmpleado !== 'EN_VACACIONES')) {
      return 1;
    }
    if ((a.estadoEmpleado !== 'INACTIVO' && b.estadoEmpleado === 'INACTIVO') || (a.estadoEmpleado !== 'EN_VACACIONES' && b.estadoEmpleado === 'EN_VACACIONES')) {
      return -1;
    }
    return rolesOrder[a.rol as Role] - rolesOrder[b.rol as Role];
  });
    
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

  const handleUserNew = () => {
    navigate(`/UserForm/${token}`)
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
setSearchId(event.target.value);
};

const handleSubmit = async (idEmpleado: string) => {
try {
  
  const jsonUser = {
      "idEmpleado": idEmpleado,
      "rol": newUserRol,
      "estadoEmpleado": newUserEstado,
      "salario": parseFloat(newUserSalario)
      };  
      console.log(jsonUser);
  const response = await axios.put('http://localhost:8090/laempacadora/api/empleado/update', jsonUser);
  setError('');
  setEditedEmployee(response.data);
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
  if (employee) {
    setNewUserRol(employee.rol === 'MESERO' ? 0 : employee.rol === 'ADMINISTRADOR' ? 2 : 3);
    setNewUserEstado(employee.estadoEmpleado === 'ACTIVO' ? 0 : employee.estadoEmpleado === 'INACTIVO' ? 1 : 2);
  }
}, [employee]);

useEffect(() => {
  if (editedEmployee) {
     window.location.reload(); 
  }
}, [editedEmployee]);
       
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
        const fetchEmployeeList = async () => {
          try {
            const response = await axios.get('http://localhost:8090/laempacadora/api/empleado/all');
              setEmployeeList(response.data);
          } catch (error) {
            console.error('Error fetching employee list:', error);
          }
        };
      
        fetchEmployeeList();
      },[]);

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
                  color: "rgb(12,12,133)",
                  textDecoration: 'none',
                }}
              >
                La Empacadora
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
                <Container maxWidth="xs"
                style={{
                  flex: "200",
                  width: "100%",
                  borderStyle: 'solid',
                  borderColor: "rgb(230, 230, 230)",
                  flexDirection: 'row',
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}>
                <TextField
                  label="Buscar por ID de Empleado"
                  variant="outlined"
                  value={searchId}
                  onChange={handleSearchChange}
                  style={{ marginBottom: '10px', marginTop: '10px'}}
                />
                  {filteredEmployeeList.map((employee, index) => (
                   <Card key={employee.idEmpleado} sx={{ maxWidth: 345, marginBottom: '10px', marginTop: index === 0 ? '10px' : 0 }}>
                   <CardHeader
                     title={
                       <Typography variant="body1" component="div" style={{ color: employee.estadoEmpleado === 'INACTIVO' || employee.estadoEmpleado === 'EN_VACACIONES' ? 'rgba(0, 0, 0, 0.3)' : 'inherit' }}>
                         {employee.nombre}
                       </Typography>
                     }
                     subheader={
                       <Typography variant="body2" color="text.secondary" component="div" style={{ color: employee.estadoEmpleado === 'INACTIVO' || employee.estadoEmpleado === 'EN_VACACIONES' ? 'rgba(0, 0, 0, 0.3)' : 'inherit' }}>
                         <div>
                            <strong>Rol:</strong> {employee.rol}
                          </div>
                          <div>
                            <strong>Salario:</strong> {`$${employee.salario}`}
                          </div>
                       </Typography>
                     }
                     action={
                       <ExpandMore
                         expand={expandedState[employee.idEmpleado]}
                         onClick={() => handleExpandClick(employee)}
                         aria-expanded={expandedState[employee.idEmpleado]}
                         aria-label="Mostrar más"
                       >
                         <ExpandMoreIcon sx={{ fontSize: '1.5rem' }} />
                       </ExpandMore>
                     }
                   />
                   <Collapse in={expandedState[employee.idEmpleado]} timeout="auto" unmountOnExit>
                     <CardContent>
                      <form onSubmit={(e) =>{
                        e.preventDefault();
                        handleSubmit(employee.idEmpleado)
                      }}>                       
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={listRol}
                          sx={{ width: 300, marginBottom:'10px' }}
                          getOptionLabel={(option) => option.label}
                          defaultValue={listRol.find(option => option.label === employee.rol)} 
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          onChange={(event, newValue) => {
                            if (newValue !== null) {
                              setNewUserRol(newValue.value);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Rol del Empleado"
                              inputProps={{
                                ...params.inputProps,
                                required: true
                              }}
                            />
                          )}
                        />
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={listEstadoEmpleado}
                          sx={{ width: 300, marginBottom:'10px' }}
                          getOptionLabel={(option) => option.label}
                          defaultValue={listEstadoEmpleado.find(option => option.label === employee.estadoEmpleado)} 
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          onChange={(event, newValue) => {
                            if (newValue !== null) {
                              setNewUserEstado(newValue.value);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Estado del Empleado"
                              inputProps={{
                                ...params.inputProps,
                                required: true
                              }}
                            />
                          )}
                        />
                         <TextField
                          id="outlined-number"
                          label="Salario del Empleado"
                          type="number"
                          sx={{ width: 300, marginBottom:'10px',marginLeft:'-10px' }}
                          defaultValue={employee.salario}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 10 && /^\d*\.?\d{0,2}$/.test(value)) {
                              setNewUserSalario(value);
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          style={{ width: '100%' }}
                        >
                          EDITAR EMPLEADO
                        </Button>
                       </form>
                     </CardContent>
                   </Collapse>
                 </Card>                 
                  ))}
                </Container>
                <Container style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <Button style={styleButtonMenu} variant="contained" onClick={handleUserNew}>Registrar Empleado</Button>
                </Container>
            </Container>
        </Paper>
      </Box>
      <ModalMessage open={openModal} onClose={handleCloseModal} message={modalMessage} />
      </>
    );
};

export default UserManager;