import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTickets, deleteTicket } from "../api/ticketsApi";

function TicketList() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await getTickets();
      setTickets(response.data);
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
      await deleteTicket(id);
      loadTickets();
    } catch (err) {
      alert("Failed to delete ticket.");
    }
  };

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  return (
    <div className="page">
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h1>Tickets</h1>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>

            <Link to="/tickets/create">
              <button>Create Ticket</button>
            </Link>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Reference</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.referenceNumber}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.category}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.createdBy}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/tickets/${ticket.id}`}>
                      <button>View Details</button>
                    </Link>

                    <Link to={`/tickets/edit/${ticket.id}`}>
                      <button style={{ marginLeft: "8px" }}>Edit</button>
                    </Link>

                    <button
                      onClick={() => handleDelete(ticket.id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TicketList;