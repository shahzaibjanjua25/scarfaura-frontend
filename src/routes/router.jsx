import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/home/Home';
import NewArrival from '../pages/home/NewArrival'; // ✅ Correct import name
import ShopPage from '../pages/shop/ShopPage';
import ErrorPage from '../components/ErrorPage';
import Search from '../pages/search/Search';
import Login from '../components/Login';
import Register from '../components/Register';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import SingleProduct from '../pages/shop/productdetais/SingleProduct';
// import PaymentSuccess from '../components/PaymentSuccess';
import UserOrders from '../pages/dashboard/user/UserOrders';
// import UserPayments from '../pages/dashboard/user/UserPayments';
import OrderDetails from '../pages/dashboard/user/OrderDetails';
import UserReviews from '../pages/dashboard/user/UserReviews';
import UserProfile from '../pages/dashboard/user/UserProfile';
import AdminDMain from '../pages/dashboard/admin/dashboard/AdminDMain';
import UserDMain from '../pages/dashboard/user/dashboard/UserDMain';
import AddProduct from '../pages/dashboard/admin/addProduct/AddProduct';
import ManageProducts from '../pages/dashboard/admin/manageProduct/ManageProducts';
import UpdateProduct from '../pages/dashboard/admin/manageProduct/UpdateProduct';
import ManageUser from '../pages/dashboard/admin/users/ManageUser';
import ManageOrders from '../pages/dashboard/admin/manageOrders/ManageOrders';
import AboutUs from "../pages/AboutUs";
// ✅ Import SocialMediaLinks component
import SocialMediaLinks from '../../src/pages/blogs/SocialMediaLinks';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/categories/:categoryName', element: <NewArrival /> }, // ✅ Using NewArrival component
      { path: '/shop', element: <ShopPage /> },
      { path: '/search', element: <Search /> },
      { path: '/shop/:id', element: <SingleProduct /> },
      { path: '/orders/:orderId', element: <OrderDetails /> },
      { path: '/about-us', element: <AboutUs /> },
      // ✅ ADDED: Contact route for SocialMediaLinks
      { path: '/contact', element: <SocialMediaLinks /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // User routes
      { path: '', element: <UserDMain /> },
      { path: 'orders', element: <UserOrders /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'reviews', element: <UserReviews /> },

      // Admin routes
      {
        path: 'admin2',
        element: <PrivateRoute role="admin2"><AdminDMain /></PrivateRoute>,
      },
      {
        path: 'add-new-post',
        element: <PrivateRoute role="admin2"><AddProduct /></PrivateRoute>,
      },
      {
        path: 'manage-products',
        element: <PrivateRoute role="admin2"><ManageProducts /></PrivateRoute>,
      },
      {
        path: 'update-product/:id',
        element: <PrivateRoute role="admin2"><UpdateProduct /></PrivateRoute>,
      },
      {
        path: 'users',
        element: <PrivateRoute role="admin2"><ManageUser /></PrivateRoute>,
      },
      {
        path: 'manage-orders',
        element: <PrivateRoute role="admin2"><ManageOrders /></PrivateRoute>,
      },
    ],
  }
]);

export default router;