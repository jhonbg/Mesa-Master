import React, { useEffect, useState } from 'react';
import { Modal, Container, Button, Typography, Box, Card, CardHeader, CardContent, Collapse, TextField, Paper} from "@mui/material";
import { IconButton,  IconButtonProps } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import axios from 'axios';

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

  type Product = {
    idProducto: number;
    nombre: string;
    precio: number;
    descripcion: string;
  };

  interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }

  interface ModalPedidoProps {
    open: boolean;
    onClose: () => void;
    idPedido: number;
    updateDetallePedido: (newDetallePedido: DetallePedido) => void;
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

const ModalProductos: React.FC<ModalPedidoProps> = ({idPedido, open, onClose, updateDetallePedido}) => {
  const [expandedState, setExpandedState] = React.useState<{ [key: string]: boolean }>({});
  const [newProductNombre, setNewProductNombre] = useState('');
  const [newProductPrecio, setNewProductPrecio] = useState<string>('');
  const [newProductDescripcion, setNewProductDescripcion] = useState('');
  const [productList, setProductList] = useState<Product[]>([]);
  const [searchName, setSearchName] = useState("");
  const [productQuantity, setNewProductQuantity] = useState('');
  const [error, setError] = useState('');

  const handleExpandClick = (product: any) => {
    setExpandedState((prevState) => ({
      ...prevState,
      [product.idProducto]: !prevState[product.idProducto],      
    }));
    setNewProductNombre(product.nombre);
    setNewProductPrecio(product.precio);
    setNewProductDescripcion(product.descripcion);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const handleAddProduct = (idProducto: number, precio: number) => {
    try {
      const newDetallePedido: DetallePedido = {
        cantidad: parseInt(productQuantity),
        estado: true,
        idProducto: idProducto,
        idPedido: idPedido,
        producto: {
          idProducto: idProducto,
          nombre: newProductNombre,
          precio: precio,
          descripcion: newProductDescripcion,
        },
      };
      updateDetallePedido(newDetallePedido);
      setError('');
      onClose(); 
    } catch (error) {
    }
  };

  const handleSubmit = async (idProducto: number, precio: number) => {
    try {
      const newDetallePedido: DetallePedido = {
        cantidad: parseInt(productQuantity),
        estado: false,
        idProducto: idProducto,
        idPedido: idPedido,
        producto: {
          idProducto: idProducto,
          nombre: newProductNombre,
          precio: precio,
          descripcion: newProductDescripcion,
        },
      };
      updateDetallePedido(newDetallePedido);
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

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        let url = 'https://mesamaster-backend.onrender.com/productos/all';
        if (searchName !== '') {
          url = `https://mesamaster-backend.onrender.com/productos/search/${searchName}`;
        }
        const response = await axios.get(url);
        setProductList(response.data);
      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    };
    fetchProductList();
  }, [searchName]);

  return(
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
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
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(product.idProducto, product.precio);
                      }}>
                        <TextField
                          id="outlined-number"
                          label="Cantidad"
                          type="number"
                          sx={{ width: 300, marginBottom:'10px',marginLeft:'-10px' }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 10 && /^\d*\.?\d{0,2}$/.test(value)) {
                              setNewProductQuantity(value);
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          style={{ width: '100%' }}
                          onClick={() => handleAddProduct(product.idProducto, product.precio)}
                        >
                          AGREGAR PRODUCTO
                        </Button>
                      </form>
                    </CardContent>
                  </Collapse>
                </Card>
              ))}
            </Container>
            <Button onClick={onClose}>Cerrar</Button>
          </Container>
        </Paper>
      </Box>
    </Modal>
  );
}

export default ModalProductos;