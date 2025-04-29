import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaSearch, FaPlus } from 'react-icons/fa';

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventType, setEventType] = useState('');
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList);
      setFilteredEvents(eventsList);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAccommodationRequired = (accommodation) => {
    return Object.values(accommodation).some(value => value);
  };

  const isTransportationRequired = (transportation) => {
    return Object.values(transportation).some(value => value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const lowercasedQuery = e.target.value.toLowerCase();
    const filtered = events.filter(event =>
      event.generalInfo.eventName.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredEvents(filtered);
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
    if (e.target.value === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => event.generalInfo.eventType === e.target.value);
      setFilteredEvents(filtered);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">View Events</h2>

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        
        {/* For Mobile */}
        {isMobile ? (
          <div className="flex items-center w-full justify-center space-x-2">
            {/* Search Button */}
            <button
              onClick={() => {
                const term = prompt('Search Event Name:');
                if (term !== null) handleSearchChange({ target: { value: term } });
              }}
              className="bg-gray-200 p-3 rounded-full"
            >
              <FaSearch />
            </button>

            {/* Filter */}
            <select
              value={eventType}
              onChange={handleEventTypeChange}
              className="border p-2 rounded w-40"
            >
              <option value="">Filter Type</option>
              <option value="Workshop">Workshop</option>
              <option value="Competition">Competition</option>
            </select>

            {/* Add Button (if user logged in) */}
            {user && (
              <Link to="/add-event">
                <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700">
                  <FaPlus />
                </button>
              </Link>
            )}
          </div>
        ) : (
          /* For Desktop */
          <>
            {/* Search Box */}
            <input
              type="text"
              placeholder="Search by Event Name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border p-2 rounded w-full max-w-md"
            />

            {/* Filter */}
            <select
              value={eventType}
              onChange={handleEventTypeChange}
              className="border p-2 rounded w-48"
            >
              <option value="">Filter by Event Type</option>
              <option value="Workshop">Workshop</option>
              <option value="Competition">Competition</option>
            </select>

            {/* Add Event Button */}
            {user && (
              <Link to="/add-event">
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  + Add Event
                </button>
              </Link>
            )}
          </>
        )}
      </div>

      {/* Table */}
      <div className="shadow-lg p-3 rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-300 text-gray-700">
              <th className="px-4 py-2 text-left">Sl.No</th>
              <th className="px-4 py-2 text-left">Event Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Executive Name</th>
              <th className="px-4 py-2 text-left">Date of Event</th>
              <th className="px-4 py-2 text-left">Venue</th>
              <th className="px-4 py-2 text-left">Accommodation</th>
              <th className="px-4 py-2 text-left">Transportation</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr key={event.id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{event.generalInfo.eventName}</td>
                <td className="px-4 py-2">{event.generalInfo.eventType}</td>
                <td className="px-4 py-2">{event.generalInfo.executiveName}</td>
                <td className="px-4 py-2">{event.venue.dateOfEvent}</td>
                <td className="px-4 py-2">{event.venue.desiredVenue}</td>
                <td className="px-4 py-2">{isAccommodationRequired(event.accommodation) ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{isTransportationRequired(event.transportation) ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
                  <Link to={`/event/${event.id}`}>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewEvents;
