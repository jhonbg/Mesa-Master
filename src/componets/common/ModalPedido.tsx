import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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
    idDetallePedido: number;
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

interface ModalPedidoProps {
  open: boolean;
  onClose: () => void;
  pedido?: Pedido;
  handleStateAndTable: (estado: number) => void;
}

const ModalPedido: React.FC<ModalPedidoProps> = ({ open, onClose, pedido, handleStateAndTable }) => {

    const [detallesPedido, setDetallesPedido] = useState<DetallePedido[]>([]);

    useEffect(() => {
        if (pedido) {
          fetch(`https://mesamaster-backend.onrender.com/detalleproducto/pedido/${pedido.idPedido}`)
            .then((response) => response.json())
            .then((data) => setDetallesPedido(data));
        }
      }, [pedido]);

      const handlePagar = () => {
        onClose();
        handleStateAndTable(4);
      };
      
    return (
      <Modal
        open={open}
        //onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          {pedido ? (
            <Grid>
              <ListItemText primary={"Mesa: " + (pedido.idMesa === 0 ? 'Domicilio' : pedido.idMesa)} />
              <ListItemText primary={"Precio Final: " + pedido.precioFinal}/>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detallesPedido.map((detalle) => (
                    <TableRow key={detalle.idDetallePedido}>
                        <TableCell align="left" component="th" scope="row">
                        {detalle.producto.nombre}
                        </TableCell>
                        <TableCell align="right">{detalle.producto.precio}</TableCell>
                        <TableCell align="right">{detalle.cantidad}</TableCell>
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            <Typography>No seleccionó pedido</Typography>
          )}
          <Button onClick={handlePagar}>Pagar</Button>
          <Button onClick={onClose}>Cerrar</Button>
        </Box>
      </Modal>
    );
  }

export default ModalPedido;