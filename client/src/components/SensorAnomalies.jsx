import React, { useEffect, useState } from "react";

const SensorAnomalies = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/vehicles/sensor_anomalies"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAnomalies(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAnomalies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Sensor Anomalies</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Make</th>
            <th className="border px-4 py-2">Model</th>
            <th className="border px-4 py-2">Sensor Type</th>
            <th className="border px-4 py-2">Sensor Reading</th>
            <th className="border px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {anomalies.map((anomaly, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{anomaly.make}</td>
              <td className="border px-4 py-2">{anomaly.model}</td>
              <td className="border px-4 py-2">{anomaly.sensor_type}</td>
              <td className="border px-4 py-2">{anomaly.sensor_reading}</td>
              <td className="border px-4 py-2">{anomaly.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SensorAnomalies;
