import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MyEvents = ({ organizerEmail }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigator = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`/event/organizer/${user.email}`);
                setEvents(response.data.events);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [organizerEmail]);

    if (loading) return <p className="text-center text-gray-500">Loading events...</p>;
    if (error) return <p className="text-center text-red-500">Error loading events: {error}</p>;

    const handleRowClick = (event) => {
        setSelectedEvent(event);
        navigator(`/event/${event._id}`);
    };

    return (
        <div className="w-[90%] mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Events</h1>
            {events.length === 0 ? (
                <p className="text-center text-gray-500">You have not created any events yet.</p>
            ) : (
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-3 px-5 text-left">Name</th>
                        <th className="py-3 px-5 text-left">Date</th>
                        <th className="py-3 px-5 text-left">Time</th>
                        <th className="py-3 px-5 text-left">Description</th>
                        <th className="py-3 px-5 text-left">Location</th>
                        <th className='py-3 px-5 text-left'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr
                            key={event._id}
                            onClick={() => handleRowClick(event)}
                            className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        >
                            <td className="py-4 px-5 border-b">{event.title}</td>
                            <td className="py-4 px-5 border-b">{event.eventDate.split("T")[0]}</td>
                            <td className="py-4 px-5 border-b">{event.eventTime}</td>
                            <td className="py-4 px-5 border-b">{event.description}</td>
                            <td className="py-4 px-5 border-b">{event.location}</td>
                            <td className="py-4 px-5 border-b flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator(`/createEvent?isEdit=true`, { state: { event } });
                                    }}
                                className="text-blue-600 hover:text-blue-900">
                                    <i className="material-icons"><FaEdit /></i>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        axios.delete(`/deleteEvent/${event._id}`)
                                            .then(() => {
                                                setEvents(events.filter(e => e._id !== event._id));
                                            })
                                            .catch(err => console.error(err));
                                    }}
                                    className="text-red-600 hover:text-red-900">
                                    <i className="material-icons"><FaTrash /></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
    );
};

export default MyEvents;
