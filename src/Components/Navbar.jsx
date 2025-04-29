import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/Vidyut-25-logo2.png';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close dropdown and mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-blue-900 text-white p-4 flex justify-between items-center fixed top-0 left-0 z-50 shadow-lg">
      {/* Logo + Title */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Vidyut Logo" className="h-10 w-auto" />
          <h1 className="text-xl md:text-2xl font-bold leading-tight">Vidyut Technical Portal</h1>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-6 relative">
        <Link to="/" className="text-white hover:text-gray-300">Home</Link>
        {user && (
          <Link to="/add-event" className="text-white hover:text-gray-300">Add Event</Link>
        )}
        <Link to="/viewevents" className="text-white hover:text-gray-300">View Events</Link>
        {!user && (
          <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
        )}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="bg-white text-blue-900 font-bold rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray-300 transition"
            >
              {user.email[0].toUpperCase()}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 animate-fadeIn">
                <div className="px-4 py-2 text-sm font-semibold truncate">{user.email}</div>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-16 left-0 w-full bg-blue-800 text-white flex flex-col items-center space-y-4 py-4 z-40"
        >
          <Link to="/" className="hover:text-gray-300" onClick={toggleMobileMenu}>Home</Link>
          {user && (
            <Link to="/add-event" className="hover:text-gray-300" onClick={toggleMobileMenu}>Add Event</Link>
          )}
          <Link to="/viewevents" className="hover:text-gray-300" onClick={toggleMobileMenu}>View Events</Link>
          {!user && (
            <Link to="/login" className="hover:text-gray-300" onClick={toggleMobileMenu}>Login</Link>
          )}
          {user && (
            <button
              onClick={(e) => {
                handleLogout(e);
              }}
              className="hover:text-gray-300"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
