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
      { path: 'discountsdashboard', element: <DiscountsDashboard /> },
      { path: 'addproduct', element: <AddProduct /> },
      { path: 'addcolor', element: <AddColor /> },
      { path: 'addcategories', element: <AddCategories   /> },
      { path: 'addbrand', element: <AddBrand/> },
      { path: '', element: <Overview /> },
      { path: 'orders', element: <Orders /> },
      { path: 'customers', element: <Customers /> },
  
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
