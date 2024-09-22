import React, { useEffect, useState } from "react";

const MaintenanceHistory = ({ vehicleId }) => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/vehicles/${vehicleId}/maintenance_history`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMaintenanceData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMaintenanceHistory();
  }, [vehicleId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">
        Maintenance History for Vehicle ID: {vehicleId}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Vehicle ID</th>
            <th className="border px-4 py-2">Maintenance Type</th>
            <th className="border px-4 py-2">Maintenance Date</th>
            <th className="border px-4 py-2">Maintenance Cost</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceData.map((record, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{record.vehicle_id}</td>{" "}
              <td className="border px-4 py-2">{record.maintenance_type}</td>
              <td className="border px-4 py-2">{record.maintenance_date}</td>
              <td className="border px-4 py-2">{record.maintenance_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceHistory;
