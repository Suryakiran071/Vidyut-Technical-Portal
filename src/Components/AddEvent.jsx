import React, { useState } from 'react';
import { db } from '../firebase.js'; // Import Firebase
import { collection, addDoc } from 'firebase/firestore';

const AddEvent = () => {
  const [transportationRequired, setTransportationRequired] = useState(false);
  const [accommodationRequired, setAccommodationRequired] = useState(false);

  const [transportation, setTransportation] = useState({
    workshopName: '',
    guestFullName: '',
    noOfPersons: '',
    arrivalDate: '',
    arrivalTime: '',
    arrivalLocation: '',
    dropDate: '',
    dropTime: '',
    dropLocation: ''
  });

  const [accommodation, setAccommodation] = useState({
    numParticipants: '',
    accommodationType: '',
    contactPerson: '',
    contactNumber: '',
    contactEmail: '',
    specialRequirements: ''
  });

  const [venue, setVenue] = useState({
    dateOfEvent: '',
    duration: '',  // Newly added field
    desiredVenue: '',
    chairs: '',
    lights: '',
    fans: '',
    projectors: '',
    speakers: '',
    plugPoints: '',
    board: '',
    strengthOfStudents: ''
  });

  const [generalInfo, setGeneralInfo] = useState({
    eventName: '',
    executiveName: '',
    studentCoordinatorName: '',
    eventType: '' // Event Type (Workshop or Competition)
  });

  const handleTransportationChange = (e) => {
    const { name, value } = e.target;
    setTransportation((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccommodationChange = (e) => {
    const { name, value } = e.target;
    setAccommodation((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVenueChange = (e) => {
    const { name, value } = e.target;
    setVenue((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneralInfoChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTransportationRequiredChange = (e) => {
    setTransportationRequired(e.target.checked);
  };

  const handleAccommodationRequiredChange = (e) => {
    setAccommodationRequired(e.target.checked);
  };

  const resetForm = () => {
    setTransportation({
      workshopName: '',
      guestFullName: '',
      noOfPersons: '',
      arrivalDate: '',
      arrivalTime: '',
      arrivalLocation: '',
      dropDate: '',
      dropTime: '',
      dropLocation: ''
    });
    setAccommodation({
      numParticipants: '',
      accommodationType: '',
      contactPerson: '',
      contactNumber: '',
      contactEmail: '',
      specialRequirements: ''
    });
    setVenue({
      dateOfEvent: '',
      duration: '',
      desiredVenue: '',
      chairs: '',
      lights: '',
      fans: '',
      projectors: '',
      speakers: '',
      plugPoints: '',
      board: '',
      strengthOfStudents: ''
    });
    setGeneralInfo({
      eventName: '',
      executiveName: '',
      studentCoordinatorName: '',
      eventType: ''
    });
    setTransportationRequired(false);
    setAccommodationRequired(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare event data
      const eventData = {
        transportation,
        accommodation,
        venue,
        generalInfo
      };

      // Save the event details to Firestore
      const docRef = await addDoc(collection(db, 'events'), eventData);
      console.log('Event Document Written with ID: ', docRef.id);
      alert('Event details saved successfully!'); // Success popup

      // Reset the form fields after successful submission
      resetForm();
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Error saving event details. Please try again.'); // Error popup
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-4xl font-bold text-center mb-6">Add Event Details</h2>

        <form onSubmit={handleSubmit}>
          {/* General Information Section */}
          <section className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">General Information</h3>
            <div className="flex space-x-6 mb-4">
              <div className="w-1/2">
                <label className="block mb-2">Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  value={generalInfo.eventName}
                  onChange={handleGeneralInfoChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2">Executive Name</label>
                <input
                  type="text"
                  name="executiveName"
                  value={generalInfo.executiveName}
                  onChange={handleGeneralInfoChange}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
            <div className="flex space-x-6 mb-4">
              <div className="w-1/2">
                <label className="block mb-2">Student Coordinator Name</label>
                <input
                  type="text"
                  name="studentCoordinatorName"
                  value={generalInfo.studentCoordinatorName}
                  onChange={handleGeneralInfoChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2">Event Type</label>
                <select
                  name="eventType"
                  value={generalInfo.eventType}
                  onChange={handleGeneralInfoChange}
                  className="border p-2 w-full rounded"
                >
                  <option value="">Select</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Competition">Competition</option>
                </select>
              </div>
            </div>
          </section>

          {/* Venue Section */}
          <section className="mb-6">
            <h3 className="text-2xl font-semibold mb-4">Venue</h3>
            <hr />
            <div className="flex space-x-6 mb-4">
              <div className="w-1/2">
                <label className="block mb-2">Date of Event</label>
                <input
                  type="date"
                  name="dateOfEvent"
                  value={venue.dateOfEvent}
                  onChange={handleVenueChange}
                  className="border p-2 w-full mb-4 rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2">Duration</label>
                <select
                  name="duration"
                  value={venue.duration}
                  onChange={handleVenueChange}
                  className="border p-2 w-full mb-4 rounded"
                >
                  <option value="">Select</option>
                  <option value="1 day">1 day</option>
                  <option value="2 day">2 day</option>
                  <option value="3 day">3 day</option>
                </select>
              </div>
            </div>

            <label className="block mb-2">Desired Venue with specifications including the requirements</label>
            <textarea
              name="desiredVenue"
              value={venue.desiredVenue}
              onChange={handleVenueChange}
              className="border p-2 w-full mb-4 rounded"
            />

            {/* Additional Venue Fields */}
            <div className="flex space-x-6 mb-4">
              <div className="w-1/2">
                <label className="block mb-2">Chairs</label>
                <input
                  type="number"
                  name="chairs"
                  value={venue.chairs}
                  onChange={handleVenueChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2">Lights</label>
                <input
                  type="number"
                  name="lights"
                  value={venue.lights}
                  onChange={handleVenueChange}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>

            <div className="flex space-x-6 mb-4">
              <div className="w-1/2">
                <label className="block mb-2">Fans</label>
                <input
                  type="number"
                  name="fans"
                  value={venue.fans}
                  onChange={handleVenueChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2">Projectors</label>
                <input
                  type="number"
                  name="projectors"
                  value={venue.projectors}
                  onChange={handleVenueChange}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>

            <div className="flex space-x-6 mb-4">
              <div className="w-1/2">
                <label className="block mb-2">Speakers</label>
                <input
                  type="number"
                  name="speakers"
                  value={venue.speakers}
                  onChange={handleVenueChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2">Plug Points</label>
                <input
                  type="number"
                  name="plugPoints"
                  value={venue.plugPoints}
                  onChange={handleVenueChange}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>

            <div className="flex space-x-6 mb-4">
              <div className="w-1/2">
                <label className="block mb-2">Board</label>
                <input
                  type="number"
                  name="board"
                  value={venue.board}
                  onChange={handleVenueChange}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-2">Strength of Students</label>
                <input
                  type="number"
                  name="strengthOfStudents"
                  value={venue.strengthOfStudents}
                  onChange={handleVenueChange}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
          </section>

          {/* Transportation Required Glide Switch */}
          <div className="mb-4 flex items-center">
            <label className="mr-4">Transportation Required</label>
            <input
              type="checkbox"
              checked={transportationRequired}
              onChange={handleTransportationRequiredChange}
              className="mr-2"
            />
          </div>

          {/* Transportation Section */}
          {transportationRequired && (
            <section className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Transportation</h3>
              <hr />
              <div className="flex space-x-6 mb-4">
                <div className="w-1/2">
                  <label className="block mb-2">Full Name of the Guest</label>
                  <input
                    type="text"
                    name="guestFullName"
                    value={transportation.guestFullName}
                    onChange={handleTransportationChange}
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block mb-2">No. of Accompanying Persons</label>
                  <input
                    type="number"
                    name="noOfPersons"
                    value={transportation.noOfPersons}
                    onChange={handleTransportationChange}
                    className="border p-2 w-full rounded"
                  />
                </div>
              </div>

              {/* Arrival Date and Arrival Time */}
              <div className="flex space-x-6 mb-4">
                <div className="w-1/2">
                  <label className="block mb-2">Arrival Date</label>
                  <input
                    type="date"
                    name="arrivalDate"
                    value={transportation.arrivalDate}
                    onChange={handleTransportationChange}
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block mb-2">Arrival Time</label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={transportation.arrivalTime}
                    onChange={handleTransportationChange}
                    className="border p-2 w-full rounded"
                  />
                </div>
              </div>

              {/* Arrival Location */}
              <label className="block mb-2">Arrival Location</label>
              <select
                name="arrivalLocation"
                value={transportation.arrivalLocation}
                onChange={handleTransportationChange}
                className="border p-2 w-full mb-4 rounded"
              >
                <option value="">Select</option>
                <option value="Trivandrum airport">Trivandrum airport</option>
                <option value="Cochin airport">Cochin airport</option>
                <option value="Karunagapally railway station">Karunagapally railway station</option>
                <option value="Kayamkulam railway station">Kayamkulam railway station</option>
                <option value="Karunagappally Bus Stand">Karunagappally Bus Stand</option>
                <option value="Kayamkulam Bus Stand">Kayamkulam Bus Stand</option>
              </select>

              {/* Drop Date and Drop Time */}
              <div className="flex space-x-6 mb-4">
                <div className="w-1/2">
                  <label className="block mb-2">Drop Date</label>
                  <input
                    type="date"
                    name="dropDate"
                    value={transportation.dropDate}
                    onChange={handleTransportationChange}
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block mb-2">Drop Time</label>
                  <input
                    type="time"
                    name="dropTime"
                    value={transportation.dropTime}
                    onChange={handleTransportationChange}
                    className="border p-2 w-full rounded"
                  />
                </div>
              </div>

              {/* Drop Location */}
              <label className="block mb-2">Drop Location</label>
              <select
                name="dropLocation"
                value={transportation.dropLocation}
                onChange={handleTransportationChange}
                className="border p-2 w-full mb-4 rounded"
              >
                <option value="">Select</option>
                <option value="Trivandrum airport">Trivandrum airport</option>
                <option value="Cochin airport">Cochin airport</option>
                <option value="Karunagapally railway station">Karunagapally railway station</option>
                <option value="Kayamkulam railway station">Kayamkulam railway station</option>
                <option value="Karunagappally Bus Stand">Karunagappally Bus Stand</option>
                <option value="Kayamkulam Bus Stand">Kayamkulam Bus Stand</option>
              </select>
            </section>
          )}

          {/* Accommodation Required Glide Switch */}
          <div className="mb-4 flex items-center">
            <label className="mr-4">Accommodation Required</label>
            <input
              type="checkbox"
              checked={accommodationRequired}
              onChange={handleAccommodationRequiredChange}
              className="mr-2"
            />
          </div>

          {/* Accommodation Section */}
          {accommodationRequired && (
            <section className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Accommodation</h3>
              <hr />
              {/* Number of Participants and Accommodation Type */}
              <div className="flex space-x-6 mb-4">
                <div className="w-1/2">
                  <label className="block mb-2">Number of Participants</label>
                  <input
                    type="number"
                    name="numParticipants"
                    value={accommodation.numParticipants}
                    onChange={handleAccommodationChange}
                    className="border p-2 w-full rounded"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block mb-2">Accommodation Type</label>
                  <select
                    name="accommodationType"
                    value={accommodation.accommodationType}
                    onChange={handleAccommodationChange}
                    className="border p-2 w-full mb-4 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Guest House">Guest House</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <label className="block mb-2">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={accommodation.contactPerson}
                onChange={handleAccommodationChange}
                className="border p-2 w-full mb-4 rounded"
              />

              <label className="block mb-2">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={accommodation.contactNumber}
                onChange={handleAccommodationChange}
                className="border p-2 w-full mb-4 rounded"
              />

              <label className="block mb-2">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={accommodation.contactEmail}
                onChange={handleAccommodationChange}
                className="border p-2 w-full mb-4 rounded"
              />

              <label className="block mb-2">Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={accommodation.specialRequirements}
                onChange={handleAccommodationChange}
                className="border p-2 w-full mb-4 rounded"
              />
            </section>
          )}

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Submit Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
