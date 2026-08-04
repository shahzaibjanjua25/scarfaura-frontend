import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from '../pages/shop/CartModal';
import avatarImg from "../assets/avatar.png";

// Import SocialMediaLinks if you need to use it as a component
// import SocialMediaLinks from '../blogs/SocialMediaLinks';
import { logout } from '../redux/features/auth/authSlice';
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../src/assets/logo.png';
import './navbar.css';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Navbar = () => {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cart functionality
  const products = useSelector((store) => store.cart.products);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Show user if logged in
  const dispatch = useDispatch()
  const [logoutUser] = useLogoutUserMutation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      await Swal.fire({
        title: 'Success!',
        text: 'Logged out successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to logout:", err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to logout. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Dropdown for user menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleDropDownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const adminDropdownMenus = [
    { label: "Dashboard", path: "/dashboard/admin2" },
    { label: "Manage Items", path: "/dashboard/manage-products" },
    { label: "All Orders", path: "/dashboard/manage-orders" },
    { label: "Add New Post", path: "/dashboard/add-new-post" }
  ];

  const userDropdownMenus = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Track my order", path: "/dashboard/orders" },
  ];

  const dropdownMenus = user?.role === 'admin2'
    ? [...adminDropdownMenus]
    : [...userDropdownMenus];

  return (
    <header className="fixed-nav-bar w-nav">
      <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center py-4">
        {/* Mobile menu button (hidden on desktop) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-primary focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Logo section with proper spacing */}
          <div className="flex items-center gap-4">
            {/* Logo image */}
            <div className="nav__logo">
              <Link to="/">
                <img
                  src={logo}
                  alt="Scarfaura Logo"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
              </Link>
            </div>

            {/* Text logo (hidden on mobile) */}
            <div className="hidden md:block nav__logo-text">
              <Link to="/" className="text-lg font-semibold">
                Scarfaura <span className="text-primary">.</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex nav__links gap-8">
            <li className="link"><Link to="/">Home</Link></li>
            <li className="link"><Link to="/shop">Shop</Link></li>
            {/* ✅ Updated Categories link to go to NewArrival page */}
            <li className="link"><Link to="/categories/new-arrivals">Categories</Link></li>
            {/* ✅ UPDATED: Contact button now navigates to SocialMediaLinks page */}
            <li className="link">
              <Link 
                to="/contact" 
                className="link"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Icons (search, cart, user) */}
        <div className="nav__icons relative flex items-center gap-6">
          <button onClick={handleCartToggle} className='hover:text-primary relative'>
            <i className="ri-shopping-bag-line"></i>
            <sup className="absolute -top-2 -right-2 text-xs inline-block px-1.5 text-white rounded-full bg-primary text-center">
              {products.length}
            </sup>
          </button>

          {user ? (
            <div className="relative">
              <img
                onClick={handleDropDownToggle}
                src={user?.profileImage || avatarImg}
                alt="User Avatar"
                className='size-6 rounded-full cursor-pointer'
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <ul className="font-medium space-y-4 p-2">
                    {dropdownMenus.map((menu, index) => (
                      <li key={index}>
                        <Link
                          onClick={() => setIsDropdownOpen(false)}
                          to={menu.path}
                          className="dropdown-items hover:text-primary"
                        >
                          {menu.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        onClick={handleLogout}
                        className='dropdown-items hover:text-primary'
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-primary">
              <i className="ri-user-line"></i>
            </Link>
          )}
        </div>

        {/* Mobile Menu - Now has the SAME links and features as desktop */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40 py-4 px-6">
            <ul className="flex flex-col space-y-4">
              {/* Same nav links as desktop */}
              <li>
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block py-2 hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block py-2 hover:text-primary"
                >
                  Shop
                </Link>
              </li>
              {/* ✅ Updated Categories link in mobile menu */}
              <li>
                <Link 
                  to="/categories/new-arrivals" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block py-2 hover:text-primary"
                >
                  Categories
                </Link>
              </li>
              {/* ✅ UPDATED: Contact button in mobile menu */}
              <li>
                <Link 
                  to="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block py-2 hover:text-primary"
                >
                  Contact
                </Link>
              </li>

              {/* Same user dropdown menus as desktop */}
              {user && (
                <>
                  <hr className="my-2" />
                  {dropdownMenus.map((menu, index) => (
                    <li key={`mobile-${index}`}>
                      <Link
                        to={menu.path}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsDropdownOpen(false);
                        }}
                        className="block py-2 text-gray-600 hover:text-primary"
                      >
                        {menu.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block py-2 text-gray-600 w-full text-left hover:text-primary"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>

      {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToggle} />}
    </header>
  );
};

export default Navbar;