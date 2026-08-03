import React from 'react'
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  }
 const handleGoBack = () => {
    try {

      navigate("/")
    } catch (err) {
      alert("Failed to go back to home:", err);
    }
  };

  return (
    <div className="space-y-5 bg-white p-8 md:h-screen flex flex-col justify-between">
      <div>
        <div className="nav__logo">
          <Link to="/">Scarfaura Kids Clothing Store<span>.</span></Link>
          <p className='text-xs italic'>Admin dashboard</p>
        </div>
        <hr className='mt-5' />
        <ul className="space-y-5 pt-5">
          <li>
            <NavLink
              to="/dashboard/admin"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/add-new-post"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Add New Post
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-products"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Manage Products
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Users
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/dashboard/manage-orders"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Manage Orders
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mb-3">
        <hr className="mb-3" />
        <div className="flex justify-between gap-3">
          <button
            onClick={handleGoBack}
            className="text-white bg-gray-500 hover:bg-gray-600 font-medium px-5 py-1 rounded-sm transition-colors duration-200"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 font-medium px-5 py-1 rounded-sm transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard