import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';

import DashboardLayout from './Components/DashboardLayout/DashboardLayout';

import Products from './Components/Dashboard/ProductsDashboard';

import Orders from './Components/Dashboard/OrdersDashboard';
import Customers from './Components/Dashboard/CustomersDashboard';
import AdminLogin from './Components/AdminLogin/AdminLogin';
import AdminRegister from './Components/AdminRegister/AdminRegister';
import Overview from './Components/Overview/Overview';
import AddProduct from './Components/AddProduct/AddProduct';
import AddColor from './Components/AddColor/AddColor';
import AddCategories from './Components/AddCategories/AddCategories';
import AddBrand from './Components/AddBrand/AddBrand';
import AddDiscount from './Components/AddDiscount/AddDiscount';
import DiscountsDashboard from './Components/DiscountsDashboard/DiscountsDashboard';
import Admins from './Components/Admins/Admins';
import AddLiquid from './Components/AddLiquid/AddLiquid';
import AddSalt from './Components/AddSalt/AddSalt';
import SaltTable from './Components/SaltTable/SaltTable';
import SaltProducts from './Components/SaltProducts/SaltProducts';
import LiquidProducts from './Components/LiquidProducts/LiquidProducts';
import DisposableProducts from './Components/DisposableProducts/DisposableProducts';
import DevicesProducts from './Components/DevicesProducts/DevicesProducts';
import AccessoriesProducts from './Components/AccessoriesProducts/AccessoriesProducts';
import AddDisposable from './Components/AddDisposable/AddDisposable';
import AddDevices from './Components/AddDevices/AddDevices';
import AddAccessories from './Components/AddAccessories/AddAccessories';
import PodProducts from './Components/PodProducts/PodProducts';
import FullkitProducts from './Components/FullkitProducts/FullkitProducts';
import TankProducts from './Components/TankProducts/TankProducts';
import ModProducts from './Components/ModProducts/ModProducts';


const router = createBrowserRouter([
    {
    path: '/',
    element: (   
        <AdminLogin />
    ),
  },
   {
    path: '/adminRegister',
    element: (   
        <AdminRegister />
    ),
  },
  {
    path: '/dashboardlayout',
    element: <DashboardLayout />,
    children: [
     
      
      { path: 'products', element: <Products /> },
      { path: 'showProducts/salts', element: <SaltProducts /> },
      { path: 'showProducts/liquids', element: <LiquidProducts /> },
      { path: 'showProducts/disposables', element: <DisposableProducts /> },
      { path: 'showProducts/devices/alldevice', element: <DevicesProducts /> },
      { path: 'showProducts/devices/full_kit', element: <FullkitProducts /> },
      { path: 'showProducts/devices/mod', element: <ModProducts /> },
      { path: 'showProducts/devices/pod', element: <PodProducts /> },
      { path: 'showProducts/devices/tank', element: <TankProducts /> },
      { path: 'showProducts/accessoriess', element: <AccessoriesProducts /> },
      { path: 'discountsdashboard', element: <DiscountsDashboard /> },
      { path: 'addproduct', element: <AddProduct /> },
      { path: 'addproduct/liquid', element: <AddLiquid /> },
      { path: 'addproduct/salt', element: <AddSalt /> },
      { path: 'addproduct/disposable', element: <AddDisposable /> },
      { path: 'addproduct/device', element: <AddDevices /> },
      { path: 'addproduct/accessories', element: <AddAccessories /> },
      { path: 'addcolor', element: <AddColor /> },
      { path: 'addcategories', element: <AddCategories   /> },
      { path: 'addbrand', element: <AddBrand/> },
      { path: '', element: <Overview /> },
      { path: 'orders', element: <Orders /> },
      { path: 'customers', element: <Customers /> },
      { path: 'admins', element: <Admins /> },
  
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
