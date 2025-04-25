import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-blue-600 text-white p-4 flex justify-between items-center fixed top-0 left-0 z-10 shadow-lg">
      <h1 className="text-2xl font-bold">Vidyut Tech Portal</h1>
      <div>
        <Link to="/add-event">
          <button className="bg-white text-blue-600 px-4 py-1 rounded mr-2 hover:bg-gray-200">+ Add Event</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
