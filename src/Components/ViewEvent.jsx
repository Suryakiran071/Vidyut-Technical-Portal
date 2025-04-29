import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaSearch, FaPlus } from 'react-icons/fa';

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventType, setEventType] = useState('');
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editableEvent, setEditableEvent] = useState(null);

  // 🛠️ Helper function to format camelCase -> Normal Case
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

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

  const openPopup = (event) => {
    setSelectedEvent(event);
    setEditableEvent({ ...event });
    setEditMode(false);
  };

  const closePopup = () => {
    setSelectedEvent(null);
    setEditableEvent(null);
    setEditMode(false);
  };

  const handleEditChange = (e, section, field) => {
    const value = e.target.value;
    setEditableEvent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveEdits = async () => {
    try {
      const eventRef = doc(db, 'events', editableEvent.id);
      await updateDoc(eventRef, {
        generalInfo: editableEvent.generalInfo,
        venue: editableEvent.venue,
        transportation: editableEvent.transportation,
        accommodation: editableEvent.accommodation,
      });
      alert('Event updated successfully!');
      setSelectedEvent(editableEvent);
      setEditMode(false);
      window.location.reload(); // Refresh to fetch updated list
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event.');
    }
  };

  const deleteEvent = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;
    try {
      const eventRef = doc(db, 'events', selectedEvent.id);
      await deleteDoc(eventRef);
      alert('Event deleted successfully!');
      closePopup();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Top bar for search and filter (same as before) */}
      <h2 className="text-4xl font-bold text-center mb-6">View Event</h2>
      {/* Events Table */}
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
                  <button
                    onClick={() => openPopup(event)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {selectedEvent && editableEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl relative max-h-[80vh] overflow-y-auto p-8">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={closePopup}
            >
              &times;
            </button>

            {/* Heading with Edit/Remove buttons to the right */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editableEvent.generalInfo.eventName}</h2>
              {user && (
                <div className="flex space-x-2">
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={saveEdits}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  )}
                  <button
                    onClick={deleteEvent}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Event Full Details */}
            {/* General Information */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">General Information</h3>
              <p><strong>Executive Name:</strong> {editMode ? <input className="border p-1" value={editableEvent.generalInfo.executiveName} onChange={(e) => handleEditChange(e, 'generalInfo', 'executiveName')} /> : editableEvent.generalInfo.executiveName}</p>
              <p><strong>Student Coordinator:</strong> {editMode ? <input className="border p-1" value={editableEvent.generalInfo.studentCoordinatorName} onChange={(e) => handleEditChange(e, 'generalInfo', 'studentCoordinatorName')} /> : editableEvent.generalInfo.studentCoordinatorName}</p>
              <p><strong>Event Type:</strong> {editMode ? <input className="border p-1" value={editableEvent.generalInfo.eventType} onChange={(e) => handleEditChange(e, 'generalInfo', 'eventType')} /> : editableEvent.generalInfo.eventType}</p>
            </div>

            {/* Venue Information */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Venue Details</h3>
              {Object.keys(editableEvent.venue).map((field) => (
                field !== 'workshopName' && (  // Skip the 'workshopName' field
                  <p key={field}>
                    <strong>{formatFieldName(field)}:</strong>{' '}
                    {editMode
                      ? <input className="border p-1" value={editableEvent.venue[field]} onChange={(e) => handleEditChange(e, 'venue', field)} />
                      : editableEvent.venue[field]}
                  </p>
                )
              ))}
            </div>

            {/* Transportation Information */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Transportation Details</h3>
              {Object.keys(editableEvent.transportation).map((field) => (
                <p key={field}>
                  <strong>{formatFieldName(field)}:</strong>{' '}
                  {editMode
                    ? <input className="border p-1" value={editableEvent.transportation[field]} onChange={(e) => handleEditChange(e, 'transportation', field)} />
                    : editableEvent.transportation[field]}
                </p>
              ))}
            </div>

            {/* Accommodation Information */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Accommodation Details</h3>
              {Object.keys(editableEvent.accommodation).map((field) => (
                <p key={field}>
                  <strong>{formatFieldName(field)}:</strong>{' '}
                  {editMode
                    ? <input className="border p-1" value={editableEvent.accommodation[field]} onChange={(e) => handleEditChange(e, 'accommodation', field)} />
                    : editableEvent.accommodation[field]}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEvents;
