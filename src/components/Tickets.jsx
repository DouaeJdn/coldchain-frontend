import { useEffect, useState } from "react";
import axios from "axios";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);

  // Récupération tickets
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/tickets/");
    setTickets(res.data);
  };

  const updateStatus = async (ticketId, status) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/tickets/${ticketId}/update-status/`,
        { status }
      );
      fetchTickets();
    } catch (error) {
      console.error("Erreur update status :", error);
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>Tickets</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
       <thead>
  <tr style={{ background: "#dee2e6" }}>
    <th>ID</th>
    <th>Capteur</th>
    <th>Assigné à</th> {/* ← ajouté */}
    <th>Description</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {tickets.map(ticket => (
    <tr key={ticket.id} style={{ borderBottom: "1px solid #ccc" }}>
      <td>{ticket.id}</td>
      <td>{ticket.sensor_name || ticket.sensor}</td>
      <td>{ticket.assigned_to ? ticket.assigned_to.username : "Non assigné"}</td> {/* ← ajouté */}
      <td>{ticket.description}</td>
      <td>{ticket.status}</td>
      <td>
        {ticket.status !== "clos" && (
          <>
            {ticket.status === "ouvert" && (
              <button onClick={() => updateStatus(ticket.id, "en_cours")} style={{ marginRight: "5px" }}>Ack</button>
            )}
            <button onClick={() => updateStatus(ticket.id, "clos")} style={{ marginRight: "5px" }}>Clôturer</button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
