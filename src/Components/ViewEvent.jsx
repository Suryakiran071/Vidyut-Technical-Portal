import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import { Link } from 'react-router-dom'; // For navigation

const ViewEvents = () => {
  const [events, setEvents] = useState([]); // State to hold events data
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredEvents, setFilteredEvents] = useState([]); // State for filtered events
  const [eventType, setEventType] = useState(''); // State for filtering by event type (Workshop/Competition)

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events'); // Reference to 'events' collection
      const eventsSnapshot = await getDocs(eventsCollection); // Fetch data
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList); // Set events data to state
      setFilteredEvents(eventsList); // Set filtered events
    };

    fetchEvents(); // Call the function to fetch events
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Function to determine if accommodation is required
  const isAccommodationRequired = (accommodation) => {
    return Object.values(accommodation).some(value => value); // Check if any field in accommodation is filled
  };

  // Function to determine if transportation is required
  const isTransportationRequired = (transportation) => {
    return Object.values(transportation).some(value => value); // Check if any field in transportation is filled
  };

  // Search filter function
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const lowercasedQuery = e.target.value.toLowerCase();
    const filtered = events.filter(event =>
      event.generalInfo.eventName.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredEvents(filtered);
  };

  // Event type filter function
  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
    if (e.target.value === '') {
      setFilteredEvents(events); // If no filter is selected, show all events
    } else {
      const filtered = events.filter(event => event.generalInfo.eventType === e.target.value);
      setFilteredEvents(filtered);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-center mb-6">View Events</h2>

      {/* Add Event Button */}
      <div className="mb-1 flex justify-between items-center">
        {/* Search and Filter Side by Side */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by Event Name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border p-2 rounded w-full max-w-md"
          />
          <select
            value={eventType}
            onChange={handleEventTypeChange}
            className="border p-2 rounded"
          >
            <option value="">Filter by Event Type</option>
            <option value="Workshop">Workshop</option>
            <option value="Competition">Competition</option>
          </select>
        </div>

        {/* Add Event Button on the Right */}
        <Link to="/add-event">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            + Add Event
          </button>
        </Link>
      </div>

      {/* Table to display event data */}
      <div className="shadow-lg p-3 rounded-lg"> {/* Table shadow */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-300 text-gray-700">
              <th className="px-4 py-2 text-left">Sl.No</th>
              <th className="px-4 py-2 text-left">Event Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Executive Name</th> {/* Added Executive Name */}
              <th className="px-4 py-2 text-left">Date of Event</th>
              <th className="px-4 py-2 text-left">Venue</th>
              <th className="px-4 py-2 text-left">Accommodation</th> {/* Removed "Required" */}
              <th className="px-4 py-2 text-left">Transportation</th> {/* Removed "Required" */}
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr key={event.id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{event.generalInfo.eventName}</td>
                <td className="px-4 py-2">{event.generalInfo.eventType}</td>
                <td className="px-4 py-2">{event.generalInfo.executiveName}</td> {/* Added Executive Name */}
                <td className="px-4 py-2">{event.venue.dateOfEvent}</td>
                <td className="px-4 py-2">{event.venue.desiredVenue}</td>
                <td className="px-4 py-2">
                  {isAccommodationRequired(event.accommodation) ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-2">
                  {isTransportationRequired(event.transportation) ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-2">
                  {/* Link to detailed view of the event */}
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
