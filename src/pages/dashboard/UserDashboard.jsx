import React from 'react';
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/features/auth/authSlice';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/dashboard/orders', label: 'Orders' },
  // { path: '/dashboard/payments', label: 'Payments' },
  { path: '/dashboard/profile', label: 'Profile' },
  { path: '/dashboard/reviews', label: 'Reviews' },
];

const UserDashboard = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      console.log('User logged out successfully');
      dispatch(logout());
      navigate("/")
    } catch (err) {
      alert("Failed to logout:", err);
    }
  };
  

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
          <Link to="/">Scarfaura <span>.</span></Link>
          <p className='text-xs italic'>User dashboard</p>
        </div>
        <hr className='mt-5'/>
        <ul className="space-y-5 pt-5">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-black"
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-3">
        <hr className="mb-3"/>
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
  );
};

export default UserDashboard;