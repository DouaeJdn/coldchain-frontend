return (
  <>
    <div className="measurements">
      <h2>Mesures Température / Humidité</h2>

      <table>
        <thead>
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
            <tr key={m.id}>
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
  </>
);
