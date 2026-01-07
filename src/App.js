import './App.css';
import { useState } from 'react';
import Dashboard from './Dashboard';
import Tickets from './components/Tickets';
import Login from './components/Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' ou 'tickets'

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />;

  return (
    <div className="App" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Navigation simple */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", background: "#343a40", color: "#fff" }}>
        <h1 style={{ margin: 0 }}>Projet IoT – Cold Chain Monitoring</h1>
        <div>
          <button
            onClick={() => setView('dashboard')}
            style={{ marginRight: "10px", padding: "5px 15px", cursor: "pointer" }}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView('tickets')}
            style={{ marginRight: "10px", padding: "5px 15px", cursor: "pointer" }}
          >
            Tickets
          </button>
          <button
            onClick={() => setLoggedIn(false)}
            style={{ padding: "5px 15px", cursor: "pointer", background: "red", color: "#fff", border: "none" }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
        {view === 'dashboard' && <Dashboard />}
        {view === 'tickets' && <Tickets />}
      </div>
    </div>
  );
}

export default App;
