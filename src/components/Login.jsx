// src/components/Login.jsx
import { useState, useEffect } from "react";
import Dashboard from "../Dashboard"; // remonte d'un niveau

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Vérifier la connexion au chargement de la page
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // === Vérification simple ===
    if (email === "admin@example.com" && password === "123456") {
      setIsLoggedIn(true); // connexion réussie
      localStorage.setItem("loggedIn", "true"); // ✅ sauvegarde dans le navigateur
      setError("");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("loggedIn"); // ✅ supprime la connexion persistante
  };

  if (isLoggedIn) {
    // Affiche Dashboard après connexion
    return (
      <div>
        <button
          onClick={handleLogout}
          style={{ padding: "8px", margin: "10px", borderRadius: "4px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" }}
        >
          Déconnexion
        </button>
        <Dashboard />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center" }}>Connexion</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="123456"
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
          />
        </div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <button
          type="submit"
          style={{ padding: "10px", borderRadius: "4px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
