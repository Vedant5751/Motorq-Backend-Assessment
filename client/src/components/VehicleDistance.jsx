import React, { useEffect, useState } from "react";

const VehicleDistance = ({ vehicleId }) => {
  const [vehicleData, setVehicleData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleDistance = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/vehicles/${vehicleId}/distance_traveled`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setVehicleData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchVehicleDistance();
  }, [vehicleId]);

  console.log(vehicleId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">
        Total Distance Traveled by Vehicles (Last 30 Days)
      </h1>
      {error && <p className="text-red-500">{error}</p>}
        <table className="min-w-full mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Vehicle ID</th>
              <th className="border px-4 py-2">Make</th>
              <th className="border px-4 py-2">Model</th>
              <th className="border px-4 py-2">Owner Name</th>
              <th className="border px-4 py-2">Total Distance (km)</th>
            </tr>
          </thead>
          <tbody>
            {vehicleData.map((record, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{record.vehicle_id}</td>
                <td className="border px-4 py-2">{record.make}</td>
                <td className="border px-4 py-2">{record.model}</td>
                <td className="border px-4 py-2">{record.owner_name}</td>
                <td className="border px-4 py-2">
                  {record.total_distance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default VehicleDistance;
