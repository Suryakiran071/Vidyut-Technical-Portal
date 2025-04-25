import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const HeroSection = () => {
  const [eventCount, setEventCount] = useState(0); // Replace with backend data later

  return (
    <div className="p-6 text-center">
      {/* Title & Tagline */}
      <h2 className="text-4xl font-bold mb-2">Welcome to Vidyut’s Technical Portal ⚡</h2>
      <p className="text-gray-600 text-lg mb-10">Organize. Manage. Execute your event responsibilities smoothly.</p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-center">

  {/* Add Event Card */}
  <div className="bg-white shadow-md p-6 rounded border flex flex-col items-center text-center">
    <span className="text-4xl mb-3">📝</span>
    <h3 className="text-xl font-semibold mb-1">Add New Event</h3>
    <p className="text-gray-600 text-sm mb-4">
      Enter transportation, accommodation, and venue details for your event.
    </p>
    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        <Link to="/add-event">+ Add Event</Link>
    </button>
  </div>

  {/* View Event List Card */}
  <div className="bg-white shadow-md p-6 rounded border flex flex-col items-center text-center">
    <span className="text-4xl mb-3">📋</span>
    <h3 className="text-xl font-semibold mb-1">View Event List</h3>
    <p className="text-gray-600 text-sm mb-4">
      Access the list of all submitted events with their complete details.
    </p>
    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
      📂 View Events
    </button>
  </div>

  {/* Stats Card */}
  <div className="bg-white shadow-md p-6 rounded border flex flex-col items-center text-center">
    <span className="text-4xl mb-3">📊</span>
    <h3 className="text-xl font-semibold mb-1">Stats</h3>
    <p className="text-gray-600 text-sm mb-4">
      See how many events have been submitted so far in the portal.
    </p>
    <p className="text-2xl font-bold mt-1">{eventCount}</p>
  </div>

</div>

      
    </div>
  );
};

export default HeroSection;
