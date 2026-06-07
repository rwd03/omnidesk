import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTicketById,
  updateTicket,
  getCategories,
  getPriorities,
  getStatuses,
} from "../api/ticketsApi";

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    priorityId: "",
    statusId: "",
  });

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const ticketResponse = await getTicketById(id);
        const categoriesResponse = await getCategories();
        const prioritiesResponse = await getPriorities();
        const statusesResponse = await getStatuses();

        const ticket = ticketResponse.data;
        const categoriesData = categoriesResponse.data;
        const prioritiesData = prioritiesResponse.data;
        const statusesData = statusesResponse.data;

        setCategories(categoriesData);
        setPriorities(prioritiesData);
        setStatuses(statusesData);

        const selectedCategory = categoriesData.find(
          (c) => c.name === ticket.category
        );

        const selectedPriority = prioritiesData.find(
          (p) => p.name === ticket.priority
        );

        const selectedStatus = statusesData.find(
          (s) => s.name === ticket.status
        );

        setForm({
          title: ticket.title,
          description: ticket.description,
          categoryId: selectedCategory ? selectedCategory.id : "",
          priorityId: selectedPriority ? selectedPriority.id : "",
          statusId: selectedStatus ? selectedStatus.id : "",
        });
      } catch (err) {
        setError("Failed to load ticket data.");
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateTicket(id, {
        title: form.title,
        description: form.description,
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
        statusId: Number(form.statusId),
      });

      navigate("/tickets");
    } catch (err) {
      setError("Failed to update ticket.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Edit Ticket</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label>Priority</label>
          <select
            name="priorityId"
            value={form.priorityId}
            onChange={handleChange}
            required
          >
            <option value="">Select priority</option>
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>

          <label>Status</label>
          <select
            name="statusId"
            value={form.statusId}
            onChange={handleChange}
            required
          >
            <option value="">Select status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>

          <button type="submit">Update</button>
        </form>

        <button onClick={() => navigate("/tickets")} style={{ marginTop: "10px" }}>
          Back
        </button>
      </div>
    </div>
  );
}

export default EditTicket;