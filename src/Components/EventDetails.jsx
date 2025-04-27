import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { useParams } from 'react-router-dom'; // For accessing URL params

const EventDetails = () => {
  const [event, setEvent] = useState(null); // State to hold event data
  const { id } = useParams(); // Get event ID from URL

  useEffect(() => {
    const fetchEventDetails = async () => {
      const docRef = doc(db, 'events', id); // Reference to the specific event
      const docSnap = await getDoc(docRef); // Fetch the event document

      if (docSnap.exists()) {
        setEvent(docSnap.data()); // Set event data to state
      } else {
        console.log('No such document!');
      }
    };

    fetchEventDetails(); // Fetch event details on component mount
  }, [id]);

  if (!event) return <div className="text-center text-2xl">Loading...</div>; // Show loading while data is fetched

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6 text-blue-600">Event Details</h2>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* General Information Section */}
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-blue-500">General Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p><strong>Event Name:</strong> {event.generalInfo.eventName}</p>
              <p><strong>Executive Name:</strong> {event.generalInfo.executiveName}</p>
              <p><strong>Student Coordinator Name:</strong> {event.generalInfo.studentCoordinatorName}</p>
              <p><strong>Event Type:</strong> {event.generalInfo.eventType}</p>
            </div>
          </div>
        </section>

        {/* Venue Section */}
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-blue-500">Venue</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p><strong>Date of Event:</strong> {event.venue.dateOfEvent}</p>
              <p><strong>Desired Venue:</strong> {event.venue.desiredVenue}</p>
              <p><strong>Chairs:</strong> {event.venue.chairs}</p>
            </div>
            <div>
              <p><strong>Lights:</strong> {event.venue.lights}</p>
              <p><strong>Fans:</strong> {event.venue.fans}</p>
              <p><strong>Projectors:</strong> {event.venue.projectors}</p>
              <p><strong>Speakers:</strong> {event.venue.speakers}</p>
              <p><strong>Plug Points:</strong> {event.venue.plugPoints}</p>
              <p><strong>Board:</strong> {event.venue.board}</p>
              <p><strong>Strength of Students:</strong> {event.venue.strengthOfStudents}</p>
            </div>
          </div>
        </section>

        {/* Transportation Section */}
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-blue-500">Transportation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p><strong>Guest Full Name:</strong> {event.transportation.guestFullName}</p>
              <p><strong>No. of Accompanying Persons:</strong> {event.transportation.noOfPersons}</p>
              <p><strong>Arrival Date:</strong> {event.transportation.arrivalDate}</p>
            </div>
            <div>
              <p><strong>Arrival Time:</strong> {event.transportation.arrivalTime}</p>
              <p><strong>Arrival Location:</strong> {event.transportation.arrivalLocation}</p>
              <p><strong>Drop Date:</strong> {event.transportation.dropDate}</p>
              <p><strong>Drop Time:</strong> {event.transportation.dropTime}</p>
              <p><strong>Drop Location:</strong> {event.transportation.dropLocation}</p>
            </div>
          </div>
        </section>

        {/* Accommodation Section */}
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-blue-500">Accommodation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p><strong>Number of Participants:</strong> {event.accommodation.numParticipants}</p>
              <p><strong>Accommodation Type:</strong> {event.accommodation.accommodationType}</p>
              <p><strong>Contact Person:</strong> {event.accommodation.contactPerson}</p>
            </div>
            <div>
              <p><strong>Contact Number:</strong> {event.accommodation.contactNumber}</p>
              <p><strong>Contact Email:</strong> {event.accommodation.contactEmail}</p>
              <p><strong>Special Requirements:</strong> {event.accommodation.specialRequirements}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventDetails;
