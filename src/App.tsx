import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import InitialPage from './pages/InitialPage';
import NewOrder from './pages/NewOrder';
import UserForm from './pages/UserForm';
import UserManager from './pages/UserManager';
import ProductManager from './pages/ProductManager';
import ProductForm from './pages/ProductForm';
import ViewTables from './pages/ViewTables';
import OrderHome from './pages/OrderHome';
import AddProduct from './pages/AddProduct';
import { OrderContextProvider } from './pages/OrderContextProps';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/InitialPage/:token' element={<InitialPage />} />
        <Route path='/NewOrder/:token' element={<NewOrder />} />
        <Route path='/UserForm/:token' element={<UserForm/>}/>
        <Route path='/UserManager/:token' element={<UserManager/>}/>
        <Route path='/ProductManager/:token' element={<ProductManager/>}/>
        <Route path='/ProductForm/:token' element={<ProductForm/>}/>
        <Route path='/ViewTables/:token' element={<ViewTables/>}/>
        <Route path='/OrderHome/:token' element={<OrderContextProvider><OrderHome/></OrderContextProvider>}/>
        <Route path='/AddProduct/:token' element={<OrderContextProvider><AddProduct/></OrderContextProvider>}/>
      </Routes>
    </Router>
  );
}

export default App;
