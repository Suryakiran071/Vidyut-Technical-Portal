import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App'; // App component
import AddEvent from './Components/AddEvent'; // AddEvent page
import Navbar from './Components/Navbar'; // Navbar component
import ViewEvents from './Components/ViewEvent';
import EventDetails from './Components/EventDetails';
import Login from './Components/Login';
import CommitteeWiseDetails from './Components/CommitteeWiseDetails'; // Correct path
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router> 
    <Navbar /> {/* Navbar is outside the routes, always at the top */}
    <div className="mt-20"> {/* This margin-top ensures content doesn't overlap the navbar */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/viewevents" element={<ViewEvents />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/committee-wise-details" element={<CommitteeWiseDetails />} />
      </Routes>
    </div>
  </Router>
);
