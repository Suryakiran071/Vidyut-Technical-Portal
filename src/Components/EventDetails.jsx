import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom'; // Updated to use navigate

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to enable editing
  const { id } = useParams();
  const navigate = useNavigate(); // Navigate after delete

  useEffect(() => {
    const fetchEventDetails = async () => {
      const docRef = doc(db, 'events', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEvent(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (section, field, value) => {
    setEvent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleGeneralInfoChange = (field, value) => {
    setEvent((prev) => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'events', id);
      await updateDoc(docRef, event);
      setIsEditing(false);
      alert('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      try {
        const docRef = doc(db, 'events', id);
        await deleteDoc(docRef);
        alert('Event deleted successfully!');
        navigate('/viewevents'); // Redirect after deletion
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event.');
      }
    }
  };

  if (!event) return <div className="text-center text-2xl">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-blue-600">Event Details</h2>
        <div className="flex space-x-4">
          {/* Edit and Delete Buttons */}
          <button
            onClick={handleEditToggle}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Event'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Remove Event
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* General Information Section */}
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-blue-500">General Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label><strong>Event Name:</strong></label>
              {isEditing ? (
                <input
                  type="text"
                  value={event.generalInfo.eventName}
                  onChange={(e) => handleGeneralInfoChange('eventName', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              ) : (
                <p>{event.generalInfo.eventName}</p>
              )}
              
              <label><strong>Executive Name:</strong></label>
              {isEditing ? (
                <input
                  type="text"
                  value={event.generalInfo.executiveName}
                  onChange={(e) => handleGeneralInfoChange('executiveName', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              ) : (
                <p>{event.generalInfo.executiveName}</p>
              )}

              <label><strong>Student Coordinator Name:</strong></label>
              {isEditing ? (
                <input
                  type="text"
                  value={event.generalInfo.studentCoordinatorName}
                  onChange={(e) => handleGeneralInfoChange('studentCoordinatorName', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              ) : (
                <p>{event.generalInfo.studentCoordinatorName}</p>
              )}

              <label><strong>Event Type:</strong></label>
              {isEditing ? (
                <input
                  type="text"
                  value={event.generalInfo.eventType}
                  onChange={(e) => handleGeneralInfoChange('eventType', e.target.value)}
                  className="border p-2 rounded w-full"
                />
              ) : (
                <p>{event.generalInfo.eventType}</p>
              )}
            </div>
          </div>
        </section>

        {/* Venue Section */}
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-blue-500">Venue</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(event.venue).map((field) => (
              <div key={field}>
                <label><strong>{field}:</strong></label>
                {isEditing ? (
                  <input
                    type="text"
                    value={event.venue[field]}
                    onChange={(e) => handleInputChange('venue', field, e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p>{event.venue[field]}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Transportation Section */}
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-blue-500">Transportation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(event.transportation).map((field) => (
              <div key={field}>
                <label><strong>{field}:</strong></label>
                {isEditing ? (
                  <input
                    type="text"
                    value={event.transportation[field]}
                    onChange={(e) => handleInputChange('transportation', field, e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p>{event.transportation[field]}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Accommodation Section */}
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-blue-500">Accommodation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(event.accommodation).map((field) => (
              <div key={field}>
                <label><strong>{field}:</strong></label>
                {isEditing ? (
                  <input
                    type="text"
                    value={event.accommodation[field]}
                    onChange={(e) => handleInputChange('accommodation', field, e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p>{event.accommodation[field]}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
