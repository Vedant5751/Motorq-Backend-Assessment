import React from "react";
import VehicleDistance from "./components/VehicleDistance";
import SensorAnomalies from "./components/SensorAnomalies";
import MaintenanceHistory from "./components/MaintenanceHistory";
import FrequentTrips from "./components/FrequentTrips";

const App = () => {
  return (
    <div className="App">
      <VehicleDistance />
      <SensorAnomalies />
      <MaintenanceHistory vehicleId/>
      <FrequentTrips />
    </div>
  );
};

export default App;
