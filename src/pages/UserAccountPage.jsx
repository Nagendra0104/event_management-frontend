import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

export default function UserAccountPage() {
  const { user, setUser, loading } = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]); // Fetch tickets only after user data is available

  const fetchTickets = async () => {
    axios
      .get(`/tickets/user/${user._id}`)
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user tickets:", error);
      });
  };

  const convertTimeStamptoDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString();
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>; // Show a loading message
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
        <div className="flex items-center gap-6 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">My Tickets</h2>
          {tickets.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {ticket.eventName}
                    </h3>
                    <p className="text-gray-600">
                      Date: {convertTimeStamptoDate(ticket.ticketDetails.eventdate)}
                    </p>
                    <p className="text-gray-600">
                      Price: {ticket.ticketDetails.ticketprice}/-
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/wallet")}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                  >
                    View Ticket
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mt-4">No tickets purchased yet.</p>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition"
          >
            Browse Events
          </button>
        </div>
      </div>
    </div>
  );
}
