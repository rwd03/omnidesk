import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>OmniDesk Dashboard</h1>

        <p>Welcome, {user.fullName}</p>
        <p>Your role: {user.role}</p>

        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>Total Tickets</h3>
            <p>Coming soon</p>
          </div>

          <div className="stat-card">
            <h3>Open Tickets</h3>
            <p>Coming soon</p>
          </div>

          <div className="stat-card">
            <h3>Resolved Tickets</h3>
            <p>Coming soon</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={() => navigate("/tickets")}>
            View Tickets
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;