import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE = "https://doujaadan.pythonanywhere.com/api";

export default function Dashboard() {
  const [measurements, setMeasurements] = useState([]);
  const [tickets, setTickets] = useState([]);

  // Récupération données API
  useEffect(() => {
    axios.get(`${API_BASE}/measurements/`)
      .then(res => setMeasurements(res.data))
      .catch(err => console.error("Erreur Axios mesures:", err));

    axios.get(`${API_BASE}/tickets/`)
      .then(res => setTickets(res.data))
      .catch(err => console.error("Erreur Axios tickets:", err));
  }, []);

  // Cartes synthèse
  const avgTemp = measurements.length
    ? (measurements.reduce((a, b) => a + b.temperature, 0) / measurements.length).toFixed(1)
    : 0;
  const avgHum = measurements.length
    ? (measurements.reduce((a, b) => a + b.humidity, 0) / measurements.length).toFixed(1)
    : 0;
  const openTickets = tickets.filter(t => t.status.toLowerCase() === "ouvert").length;

  // Graphique
  const labels = measurements.map(m => new Date(m.created_at).toLocaleString());
  const chartData = {
    labels,
    datasets: [
      {
        label: "Température (°C)",
        data: measurements.map(m => m.temperature),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.3)",
        tension: 0.3,
      },
      {
        label: "Humidité (%)",
        data: measurements.map(m => m.humidity),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.3)",
        tension: 0.3,
      },
    ],
  };

  // Export CSV mesures
  const exportCSV = () => {
    const csvRows = [
      ["ID", "Capteur", "Température (°C)", "Humidité (%)", "Date"],
      ...measurements.map(m => [
        m.id,
        m.sensor_name,
        m.temperature,
        m.humidity,
        new Date(m.created_at).toLocaleString()
      ])
    ];
    const csvString = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mesures.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Fonction pour mettre à jour le statut des tickets
 const updateTicketStatus = async (ticketId, newStatus) => {
  try {
    await axios.patch(
      `${API_BASE}/tickets/${ticketId}/update-status/`,
      { status: newStatus }
    );

    // Mise à jour locale
    setTickets(prev =>
      prev.map(t =>
        t.id === ticketId ? { ...t, status: newStatus } : t
      )
    );

  } catch (error) {
    console.error("Erreur update ticket:", error);
  }
};


  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Projet IoT – Cold Chain Monitoring</h1>

      {/* Cartes synthèse */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <div style={{ flex: 1, margin: "0 10px", padding: "20px", background: "#f8d7da", borderRadius: "8px", textAlign: "center" }}>
          <div>Température Moyenne</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "red" }}>{avgTemp}°C</div>
        </div>
        <div style={{ flex: 1, margin: "0 10px", padding: "20px", background: "#d1ecf1", borderRadius: "8px", textAlign: "center" }}>
          <div>Humidité Moyenne</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "blue" }}>{avgHum}%</div>
        </div>
        <div style={{ flex: 1, margin: "0 10px", padding: "20px", background: "#fff3cd", borderRadius: "8px", textAlign: "center" }}>
          <div>Tickets Ouverts</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#856404" }}>{openTickets}</div>
        </div>
      </div>

      {/* Graphique */}
      <div style={{ marginBottom: "30px", padding: "20px", background: "#f1f1f1", borderRadius: "8px" }}>
        <h2 style={{ marginBottom: "10px" }}>Historique Température / Humidité</h2>
        <Line data={chartData} />
      </div>

      {/* Tableau mesures */}
      <div style={{ marginBottom: "30px", padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <h2>Mesures</h2>
          <button onClick={exportCSV} style={{ padding: "5px 15px", background: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Export CSV</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead style={{ background: "#dee2e6" }}>
            <tr>
              <th>ID</th>
              <th>Capteur</th>
              <th>Température (°C)</th>
              <th>Humidité (%)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map(m => (
              <tr key={m.id} style={{ borderTop: "1px solid #ced4da", background: "#fff" }}>
                <td>{m.id}</td>
                <td>{m.sensor_name}</td>
                <td>{m.temperature}</td>
                <td>{m.humidity}</td>
                <td>{new Date(m.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tableau tickets avec gestion */}
      <div style={{ marginBottom: "30px", padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
        <h2 style={{ marginBottom: "10px" }}>Tickets</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead style={{ background: "#dee2e6" }}>
            <tr>
              <th>ID</th>
              <th>Capteur</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} style={{ borderTop: "1px solid #ced4da", background: "#fff" }}>
                <td>{t.id}</td>
                <td>{t.sensor}</td>
                <td>{t.description}</td>
                <td>{t.status}</td>
                <td>{new Date(t.created_at).toLocaleString()}</td>
                <td>
                  {t.status === "ouvert" && (
                    <button onClick={() => updateTicketStatus(t.id, "assigne")} style={{ marginRight: "5px" }}>Ack</button>
                  )}
                  {t.status === "assigne" && (
                    <button onClick={() => updateTicketStatus(t.id, "en_cours")} style={{ marginRight: "5px" }}>En cours</button>
                  )}
                  {t.status !== "clos" && (
                    <button onClick={() => updateTicketStatus(t.id, "clos")}>Clôturer</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
