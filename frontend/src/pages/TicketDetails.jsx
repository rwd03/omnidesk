import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTicketById,
  getStatuses,
  assignTicket,
  updateTicketStatus,
  addTicketComment,
  getTicketComments,
  getTicketHistory,
} from "../api/ticketsApi";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [assignedToUserId, setAssignedToUserId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const ticketResponse = await getTicketById(id);
      const statusesResponse = await getStatuses();
      const commentsResponse = await getTicketComments(id);
      const historyResponse = await getTicketHistory(id);

      setTicket(ticketResponse.data);
      setStatuses(statusesResponse.data);
      setComments(commentsResponse.data);
      setHistory(historyResponse.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load ticket details.");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAssignTicket = async (e) => {
    e.preventDefault();

    if (!assignedToUserId) {
      setMessage("Please enter an agent user ID.");
      return;
    }

    try {
      await assignTicket(id, Number(assignedToUserId));
      setMessage("Ticket assigned successfully.");
      setAssignedToUserId("");
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data || "Failed to assign ticket.");
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!statusId) {
      setMessage("Please select a status.");
      return;
    }

    try {
      await updateTicketStatus(id, Number(statusId));
      setMessage("Ticket status updated successfully.");
      setStatusId("");
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data || "Failed to update status.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentMessage.trim()) {
      setMessage("Please enter a comment.");
      return;
    }

    try {
      await addTicketComment(id, commentMessage);
      setMessage("Comment added successfully.");
      setCommentMessage("");
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data || "Failed to add comment.");
    }
  };

  if (!ticket) {
    return <div className="page-container">Loading ticket details...</div>;
  }

  return (
    <div className="page-container">
      <h1>Ticket Details</h1>

      {message && <p>{message}</p>}

      <div className="card">
        <p><strong>Reference:</strong> {ticket.referenceNumber}</p>
        <p><strong>Title:</strong> {ticket.title}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Category:</strong> {ticket.category}</p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Created By:</strong> {ticket.createdBy}</p>
        <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
      </div>

      <div className="card">
        <h2>Assign Ticket</h2>
        <form onSubmit={handleAssignTicket}>
          <input
            type="number"
            placeholder="Enter IT Support Agent User ID"
            value={assignedToUserId}
            onChange={(e) => setAssignedToUserId(e.target.value)}
          />
          <button type="submit">Assign Ticket</button>
        </form>
      </div>

      <div className="card">
        <h2>Update Status</h2>
        <form onSubmit={handleUpdateStatus}>
          <select value={statusId} onChange={(e) => setStatusId(e.target.value)}>
            <option value="">Select status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
          <button type="submit">Update Status</button>
        </form>
      </div>

      <div className="card">
        <h2>Comments</h2>
        <form onSubmit={handleAddComment}>
          <textarea
            placeholder="Write a comment..."
            value={commentMessage}
            onChange={(e) => setCommentMessage(e.target.value)}
          />
          <button type="submit">Add Comment</button>
        </form>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-box">
              <p><strong>{comment.commentedBy}</strong></p>
              <p>{comment.message}</p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h2>Activity History</h2>

        {history.length === 0 ? (
          <p>No activity yet.</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="comment-box">
              <p><strong>{item.action}</strong></p>
              <p>{item.description}</p>
              <small>
                By {item.performedBy} — {new Date(item.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>

      <button onClick={() => navigate("/tickets")}>Back to Tickets</button>
    </div>
  );
}

export default TicketDetails;