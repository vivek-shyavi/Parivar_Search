
// Navbar.jsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout(); // This will clear the auth context and localStorage
    navigate('/', { replace: true }); // Using replace prevents going back to protected routes
  };

  return (
    <nav className="bg-white shadow-md animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors duration-300">
              ParivarSearch
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link to="/overview" className="nav-link">Overview</Link>
            <a href="#" className="nav-link">Family Tree</a>
            <Link to="/memories" className="nav-link">Memories</Link> */}
            <Link to="/aboutUs" className="nav-link">About Us</Link>
            {!user ? (
              <>
                <Link to="/signin" className="nav-link">Sign In</Link>
                <Link to="/signup" className="btn-primary">
                  Create Account
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="btn-primary"
              >
                Logout
              </button>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="transition-transform duration-300 hover:scale-110">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* <Link to="/overview" className="block px-3 py-2 nav-link">Overview</Link>
            <a href="#" className="block px-3 py-2 nav-link">Family Tree</a>
            <Link to="/memories" className="block px-3 py-2 nav-link">Memories</Link>
            <Link to="/help" className="block px-3 py-2 nav-link">Help</Link> */}
            <Link to="/aboutUs" className="nav-link">About Us</Link>
            {!user ? (
              <>
                <Link to="/signin" className="block px-3 py-2 nav-link">Sign In</Link>
                <Link to="/signup" className="block px-3 py-2 btn-primary">
                  Create Account
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 btn-primary"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;