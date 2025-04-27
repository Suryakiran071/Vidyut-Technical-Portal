import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaSearch } from 'react-icons/fa';  // import search icon

const CommitteeWiseDetails = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState('');
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false); // 🔥 control search bar

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.generalInfo.eventName.toLowerCase().includes(searchQuery);
    const matchesType = eventType === '' || event.generalInfo.eventType === eventType;
    return matchesSearch && matchesType;
  });

  const openDetails = (type, event) => {
    setSelectedType(type);
    setSelectedDetails(event);
  };

  const closeDetails = () => {
    setSelectedDetails(null);
    setSelectedType('');
  };

  const getTitle = () => {
    if (selectedType === 'accommodation') return 'Accommodation Details';
    if (selectedType === 'transportation') return 'Transportation Details';
    if (selectedType === 'venue') return 'Venue Details';
    return '';
  };

  const renderVenueDetails = (venue) => {
    if (!venue) return null;
    const { desiredVenue, strengthOfStudents, dateOfEvent, ...rest } = venue;

    return (
      <div className="bg-gray-100 p-4 rounded text-sm space-y-2">
        {desiredVenue && (
          <div className="flex">
            <span className="font-semibold capitalize mr-2">Desired Venue:</span>
            <span>{desiredVenue}</span>
          </div>
        )}
        {strengthOfStudents && (
          <div className="flex">
            <span className="font-semibold capitalize mr-2">Strength Of Students:</span>
            <span>{strengthOfStudents}</span>
          </div>
        )}
        {Object.entries(rest).map(([key, value]) => (
          <div key={key} className="flex">
            <span className="font-semibold capitalize mr-2">
              {key.replace(/([A-Z])/g, ' $1')}:
            </span>
            <span>{value ? value.toString() : '-'}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-center mb-6">View Committee Wise Details</h2>

      {/* Search and Filter */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Search Bar or Search Button */}
        <div className="flex items-center space-x-4">
          {!showSearchBar ? (
            <button
              onClick={() => setShowSearchBar(true)}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FaSearch className="h-5 w-5" />
            </button>
          ) : (
            <input
              type="text"
              placeholder="Search by Event Name"
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={() => { if (searchQuery === '') setShowSearchBar(false); }}
              className="border p-2 rounded w-full max-w-md"
              autoFocus
            />
          )}
        </div>

        {/* Event Type Filter */}
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

      {/* Table */}
      <div className="shadow-lg p-3 rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-300 text-gray-700">
              <th className="px-4 py-2 text-left">Sl.No</th>
              <th className="px-4 py-2 text-left">Event Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Executive Name</th>
              <th className="px-4 py-2 text-left">Accommodation</th>
              <th className="px-4 py-2 text-left">Transportation</th>
              <th className="px-4 py-2 text-left">Venue</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr key={event.id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{event.generalInfo.eventName}</td>
                <td className="px-4 py-2">{event.generalInfo.eventType}</td>
                <td className="px-4 py-2">{event.generalInfo.executiveName}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => openDetails('accommodation', event)}
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => openDetails('transportation', event)}
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => openDetails('venue', event)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup */}
      {selectedDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-11/12 max-w-lg shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={closeDetails}
            >
              &times;
            </button>

            {/* Event Info */}
            <h2 className="text-2xl font-bold mb-4">{selectedDetails.generalInfo.eventName}</h2>
            <p><strong>Date of Event:</strong> {selectedDetails.venue.dateOfEvent}</p>
            <p><strong>Executive Name:</strong> {selectedDetails.generalInfo.executiveName}</p>
            <p><strong>Student Coordinator Name:</strong> {selectedDetails.generalInfo.studentCoordinatorName}</p>

            {/* Divider */}
            <hr className="my-4" />

            {/* Section Title */}
            <h3 className="text-xl font-semibold mb-2">{getTitle()}</h3>

            {/* Details Section */}
            {selectedType === 'venue'
              ? renderVenueDetails(selectedDetails.venue)
              : (
                <div className="bg-gray-100 p-4 rounded text-sm space-y-2">
                  {selectedDetails[selectedType] && Object.entries(selectedDetails[selectedType]).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-semibold capitalize mr-2">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span>{value ? value.toString() : '-'}</span>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteeWiseDetails;
