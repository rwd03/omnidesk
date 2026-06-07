import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket, getCategories, getPriorities } from "../api/ticketsApi";

function CreateTicket() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    priorityId: "",
  });

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const categoriesResponse = await getCategories();
        const prioritiesResponse = await getPriorities();

        setCategories(categoriesResponse.data);
        setPriorities(prioritiesResponse.data);
      } catch (err) {
        setError("Failed to load categories or priorities.");
      }
    };

    loadDropdowns();
  }, []);

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
      await createTicket({
        title: form.title,
        description: form.description,
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
      });

      navigate("/tickets");
    } catch (err) {
      setError("Failed to create ticket.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Create Ticket</h1>

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

          <button type="submit">Create</button>
        </form>

        <button onClick={() => navigate("/tickets")} style={{ marginTop: "10px" }}>
          Back
        </button>
      </div>
    </div>
  );
}

export default CreateTicket;