import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OrderContextProps {
  idPedido: number | null;
  setIdPedido: React.Dispatch<React.SetStateAction<number | null>>;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext debe ser utilizado dentro de un OrderContextProvider');
  }
  return context;
};

export const OrderContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [idPedido, setIdPedido] = useState<number | null>(null);

  return (
    <OrderContext.Provider value={{ idPedido, setIdPedido }}>
      {children}
    </OrderContext.Provider>
  );
};