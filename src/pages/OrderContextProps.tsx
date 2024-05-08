import React, {createContext, useContext, useState} from "react";

interface OrderContextProps {
    idPedido: number | null;
    setIdPedido: React.Dispatch<React.SetStateAction<number | null>>
}

const OrderCotext = createContext<OrderContextProps | undefined>(undefined);

export const useOrderContext = () => {
    const context = useContext(OrderCotext);
    if (!context) {
        throw new Error('useOrderContext debe ser utilizado dentro de un OrderContextProvider');
    }
    return context;
};

export const OrderContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [idPedido, setIdPedido] = useState<number | null>(null);

    return (
        <OrderCotext.Provider value={{idPedido, setIdPedido}}>
            {children}
        </OrderCotext.Provider>
    );
};
