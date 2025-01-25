import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTicketAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all events from the backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events"); // Replace with your API endpoint
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredEvents = events.filter((event) =>
    event?.title?.toLowerCase().includes(search.toLowerCase()) ||
    event?.organizedBy?.toLowerCase().includes(search.toLowerCase()) ||
    event?.organizerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Events</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by title or organizer"
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            onClick={() => navigate('/createEvent')}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Create Event</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Title</th>
              <th className="p-2 border-b">Organizer</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Time</th>
              <th className="p-2 border-b">Location</th>
              <th className="p-2 border-b">Tickets Sold</th>
              <th className="p-2 border-b">Likes</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event._id} className={` ${event.outDated ? 'bg-red-100' : ''}`}>
                  <td className="p-2 border-b">{event.title}</td>
                  <td className="p-2 border-b">{event.organizedBy}</td>
                  <td className="p-2 border-b">{event?.organizerEmail}</td>
                  <td className="p-2 border-b">{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="p-2 border-b">{event.eventTime}</td>
                  <td className="p-2 border-b">{event.location}</td>
                  <td className="p-2 border-b text-center">{event.ticketCount || 0}</td>
                  <td className="p-2 border-b text-center">{event.likes || 0}</td>
                  <td className="p-2 border-b flex gap-4">
                    <button
                    onClick={() => navigate(`/createEvent?isEdit=true`, { state: { event } })}
                    className="text-blue-500 hover:underline flex items-center gap-1">
                      <FaEdit /> Edit
                    </button>
                    <button
                    onClick={() => {
                        if(window.confirm('Are you sure you want to delete this event?')) {
                          axios.delete(`/deleteEvent/${event._id}`)
                            .then(() => {
                            setEvents(events.filter(e => e._id !== event._id));
                            })
                            .catch(err => console.error(err));
                        }
                      }
                    }
                    className="text-red-500 hover:underline flex items-center gap-1">
                      <FaTrash /> Delete
                    </button>
                    {event.ticketCount > 0 && (
                      <button
                        onClick={() => navigate(`/tickets?eventName=${event.title}`)}
                        className="text-green-500 hover:underline flex items-center gap-1"
                      >
                        <FaTicketAlt /> View Tickets
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
