import React, { useEffect, useState } from "react";

const FrequentTrips = () => {
  const [frequentTripData, setFrequentTripData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFrequentTrips = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/vehicles/frequent_trips"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFrequentTripData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFrequentTrips();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">
        Vehicles with More Than 5 Trips in the Last 7 Days
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Vehicle ID</th>
            <th className="border px-4 py-2">Make</th>
            <th className="border px-4 py-2">Model</th>
            <th className="border px-4 py-2">Number of Trips</th>
          </tr>
        </thead>
        <tbody>
          {frequentTripData.map((vehicle, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{vehicle.vehicle_id}</td>
              <td className="border px-4 py-2">{vehicle.make}</td>
              <td className="border px-4 py-2">{vehicle.model}</td>
              <td className="border px-4 py-2">{vehicle.trip_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FrequentTrips;
