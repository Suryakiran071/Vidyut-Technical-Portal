import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App'; // App component
import AddEvent from './Components/AddEvent'; // AddEvent page
import Navbar from './Components/Navbar'; // Navbar component
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router> 
    <Navbar /> {/* Navbar is outside the routes, always at the top */}
    <div className="mt-20"> {/* This margin-top ensures content doesn't overlap the navbar */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add-event" element={<AddEvent />} />
      </Routes>
    </div>
  </Router>
);
