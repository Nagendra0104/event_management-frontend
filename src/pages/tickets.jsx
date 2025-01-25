import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState("");
    const { search: queryString } = useLocation();
    const eventName = new URLSearchParams(queryString).get('eventName');
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // Fetch all tickets from the backend
        const fetchTickets = async () => {
            try {
                const response = await axios.get("/all-tickets"); // Replace with your API endpoint
                setTickets(response.data.tickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        const fetchTicketsByUserEvents = async () => {
            try {
                const response = await axios.get(`/tickets/event/${user.email}`);
                setTickets(response.data.tickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        if(user.role === "organizer") {
            fetchTicketsByUserEvents();
        } 
            if (user.role === "admin") {
                fetchTickets();
            }
    }, []);

    useEffect(() => {
        if (eventName) {
            setSearch(eventName);
        }
    }, [eventName]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleDelete = async (ticketId) => {
        if(window.confirm("Are you sure you want to delete this ticket?")) {
            try {
                await axios.delete(`/tickets/${ticketId}`); // Replace with your API endpoint
                setTickets(tickets.filter(ticket => ticket._id !== ticketId));
            } catch (error) {
                console.error("Error deleting ticket:", error);
            }
        }
    };

    const filteredTickets = tickets.filter((ticket) =>
        ticket?.ticketDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
        ticket?.ticketDetails?.email?.toLowerCase().includes(search.toLowerCase()) ||
        ticket?.ticketDetails?.eventname?.toLowerCase().includes(search.toLowerCase())
    );

    const hasInvalidTickets = filteredTickets.some(ticket => !ticket.isValid);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Tickets</h1>

            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by name, email, or event name"
                    value={search}
                    onChange={handleSearch}
                    className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="table-auto w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border-b">Name</th>
                            <th className="p-2 border-b">Email</th>
                            <th className="p-2 border-b">Event Name</th>
                            <th className="p-2 border-b">Event Date</th>
                            <th className="p-2 border-b">Booked On</th>
                            <th className="p-2 border-b">Event Time</th>
                            <th className="p-2 border-b">Ticket Price</th>
                            <th className="p-2 border-b">Ticket ID</th>
                            <th className="p-2 border-b">QR</th>
                            {hasInvalidTickets && <th className="p-2 border-b">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket._id} className={` ${!ticket.isValid ? 'bg-red-100' : ''}`}>
                                    <td className="p-2 border-b">{ticket.ticketDetails.name}</td>
                                    <td className="p-2 border-b">{ticket.ticketDetails.email}</td>
                                    <td className="p-2 border-b">{ticket.ticketDetails.eventname}</td>
                                    <td className="p-2 border-b">{new Date(ticket.ticketDetails.eventdate).toLocaleDateString()}</td>
                                    <td className="p-2 border-b">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                    <td className="p-2 border-b">{ticket.ticketDetails.eventtime}</td>
                                    <td className="p-2 border-b">Rs.{ticket.ticketDetails.ticketprice}</td>
                                    <td className="p-2 border-b">{ticket.ticketDetails.ticketId}</td>
                                    <td className="p-2 border-b">
                                        <img src={ticket.ticketDetails.qr} alt="QR Code" className="w-16 h-16" />
                                    </td>
                                    <td className="p-2 border-b text-center">
                                        {!ticket.isValid && (
                                            <button
                                                onClick={() => handleDelete(ticket._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="p-4 text-center text-gray-500">
                                    No Tickets Sold yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tickets;
