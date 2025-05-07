import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaPlus, FaClipboardList, FaChartBar, FaUsers } from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion'; // Import Framer Motion
import logo from '../assets/Vidyut 25.png';
import logo2 from '../assets/Vidyut-25-logo2.png';

const HeroSection = () => {
  const [eventCount, setEventCount] = useState(0);
  const [workshopCount, setWorkshopCount] = useState(0);
  const [competitionCount, setCompetitionCount] = useState(0);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map(doc => doc.data());

      setEvents(eventsList);

      setEventCount(eventsList.length);
      const workshops = eventsList.filter(event => event.generalInfo.eventType === 'Workshop');
      const competitions = eventsList.filter(event => event.generalInfo.eventType === 'Competition');
      setWorkshopCount(workshops.length);
      setCompetitionCount(competitions.length);
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

  // Group events by date
  const eventsByDate = {
    "2025-05-23": [],
    "2025-05-24": [],
    "2025-05-25": [],
  };

  events.forEach(event => {
    const eventDate = event.venue?.dateOfEvent;
    if (eventsByDate[eventDate]) {
      eventsByDate[eventDate].push(event.generalInfo.eventName);
    }
  });

  return (
    <motion.div
      className="relative w-full min-h-screen"
      initial={{ opacity: 0, y: -100 }} // Initial state
      animate={{ opacity: 1, y: 0 }} // Final state (from top to normal)
      transition={{ duration: 1 }}
    >
      {/* Background Logo */}
      <div
        style={{
          backgroundImage: `url(${logo2})`,
          backgroundSize: '40%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          filter: 'invert(1)',
          zIndex: -1
        }}
      ></div>

      <div className="p-6 text-center relative z-10">
        {/* Logo */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, x: -100 }} // Animate from left
          animate={{ opacity: 1, x: 0 }} // Final state
          transition={{ duration: 1 }}
        >
          <img src={logo} alt="Vidyut Logo" className="h-20 md:h-24 invert object-contain" />
        </motion.div>

        {/* Title and Tagline */}
        <motion.h2
          className="text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: -50 }} // From top
          animate={{ opacity: 1, y: 0 }} // Final state
          transition={{ duration: 1 }}
        >
          Welcome to Vidyut’s Technical Portal
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg mb-10"
          initial={{ opacity: 0, y: -50 }} // From top
          animate={{ opacity: 1, y: 0 }} // Final state
          transition={{ duration: 1, delay: 0.3 }}
        >
          Organize. Manage. Execute your event responsibilities smoothly.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-center">
          {user ? (
            <motion.div
              className="bg-white shadow-md p-6 rounded border flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
              initial={{ opacity: 0, x: 100 }} // Animate from right
              animate={{ opacity: 1, x: 0 }} // Final state
              transition={{ duration: 1, delay: 0.5 }}
            >
              <FaPlus className="h-14 w-16 text-blue-600 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Add New Event</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enter transportation, accommodation, and venue details for your event.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300">
                <Link to="/add-event">Add Event</Link>
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white shadow-md p-6 rounded border flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
              initial={{ opacity: 0, x: -100 }} // Animate from left
              animate={{ opacity: 1, x: 0 }} // Final state
              transition={{ duration: 1, delay: 0.5 }}
            >
              <FaUsers className="h-14 w-16 text-purple-600 mb-3" />
              <h3 className="text-xl font-semibold mb-1">View Committee Wise Details</h3>
              <p className="text-gray-600 text-sm mb-4">
                Explore committee-wise event details submitted to the portal.
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-all duration-300">
                <Link to="/committee-wise-details">View Details</Link>
              </button>
            </motion.div>
          )}

          <motion.div
            className="bg-white shadow-md p-6 rounded border flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
            initial={{ opacity: 0, x: 100 }} // Animate from right
            animate={{ opacity: 1, x: 0 }} // Final state
            transition={{ duration: 1, delay: 0.7 }}
          >
            <FaClipboardList className="h-14 w-16 text-green-600 mb-3" />
            <h3 className="text-xl font-semibold mb-1">View Event List</h3>
            <p className="text-gray-600 text-sm mb-4">
              Access the list of all submitted events with their complete details.
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-300">
              <Link to="/viewevents">View Events</Link>
            </button>
          </motion.div>

          <motion.div
            className="bg-white shadow-md p-6 rounded border flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
            initial={{ opacity: 0, x: -100 }} // Animate from left
            animate={{ opacity: 1, x: 0 }} // Final state
            transition={{ duration: 1, delay: 0.9 }}
          >
            <FaChartBar className="h-14 w-16 text-yellow-600 mb-3" />
            <h3 className="text-xl font-semibold mb-1">Stats</h3>
            <p className="text-gray-600 text-sm mb-4">
              See how many events have been submitted so far in the portal.
            </p>
            <div className="text-lg mb-2">
              <p><strong>Total Events:</strong> {eventCount}</p>
              <p><strong>Workshops:</strong> {workshopCount}</p>
              <p><strong>Competitions:</strong> {competitionCount}</p>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          className="mt-10" // Reduced margin
          initial={{ opacity: 0, y: 50 }} // Animate from bottom
          animate={{ opacity: 1, y: 0 }} // Final state
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-4">Event Timeline</h2> {/* Reduced margin-bottom */}

          <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-24">
            {Object.entries(eventsByDate).map(([date, events], index) => {
              const formattedDate = {
                "2025-05-23": "May 23",
                "2025-05-24": "May 24",
                "2025-05-25": "May 25",
              }[date] || date;

              const isLast = index === Object.keys(eventsByDate).length - 1;
              return (
                <motion.div
                  key={date}
                  className="flex flex-col items-center relative group"
                  initial={{ opacity: 0, x: -50 }} // From left
                  animate={{ opacity: 1, x: 0 }} // Final state
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  {/* Date Heading */}
                  <h3 className={`font-bold text-lg mb-2 ${date === '2025-05-25' ? 'text-black-600' : ''} transition-transform duration-300 group-hover:scale-105`}>
                    {formattedDate}
                  </h3>

                  {/* Blue Underline for May 25 */}
                  {date === '2025-05-25' && (
                    <div className="h-1 w-32 bg-blue-400 mb-4"></div>
                  )}

                  {/* Line */}
                  {!isLast && (
                    <div className="h-1 w-32 bg-blue-400"></div>
                  )}

                  {/* Content */}
                  <div className="bg-white shadow p-4 rounded-lg text-center w-48 mt-4 group-hover:scale-105 transition-transform duration-300">
                    {events.length > 0 ? (
                      <ul className="list-disc ml-5 text-left">
                        {events.map((eventName, idx) => (
                          <li key={idx} className="text-gray-700 text-sm">{eventName}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">No events scheduled</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default HeroSection;
