require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected...");
});

// Endpoint to get all vehicles
app.get('/vehicles', (req, res) => {
  const query = `
    SELECT vehicle_id, make, model FROM Vehicles;
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Endpoint to get total distance traveled by a specific vehicle
app.get("/vehicles/:vehicle_id/distance_traveled", (req, res) => {
  const vehicleId = req.params.vehicle_id;
  const query = `
        SELECT 
            v.vehicle_id,
            v.make, 
            v.model, 
            o.name AS owner_name, 
            SUM(t.distance_traveled) AS total_distance
        FROM 
            Vehicles v
        JOIN 
            Owners o ON v.owner_id = o.owner_id
        LEFT JOIN 
            Trips t ON v.vehicle_id = t.vehicle_id
        WHERE 
            v.vehicle_id > 0  -- Filter by the specific vehicle_id
            AND t.start_time >= NOW() - INTERVAL 30 DAY  -- Filter trips from the last 30 days
        GROUP BY 
            v.vehicle_id, v.make, v.model, o.name
        HAVING 
            total_distance > 0;  -- Only show vehicles with total distance traveled
    `;

  db.query(query, [vehicleId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});




// Endpoint to get vehicles with sensor anomalies
app.get('/vehicles/sensor_anomalies', (req, res) => {
    const query = `
        SELECT 
            v.vehicle_id, 
            v.make, 
            v.model, 
            s.sensor_type, 
            s.sensor_reading, 
            s.timestamp
        FROM Vehicles v
        JOIN Sensors s ON v.vehicle_id = s.vehicle_id
        WHERE (s.sensor_type = 'Speed' AND s.sensor_reading > 120) OR 
              (s.sensor_type = 'Fuel Level' AND s.sensor_reading < 10)
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Endpoint to get maintenance history for a specific vehicle
app.get('/vehicles/:vehicle_id/maintenance_history', (req, res) => {
    const vehicleId = req.params.vehicle_id;
    const query = `
        SELECT 
            m.vehicle_id,
            m.maintenance_type, 
            m.maintenance_date, 
            m.maintenance_cost
        FROM Maintenance m
        WHERE m.vehicle_id > 0
    `;
    db.query(query, [vehicleId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Endpoint to get vehicles that made more than 5 trips in the last 7 days
app.get('/vehicles/frequent_trips', (req, res) => {
    const query = `
        SELECT 
            v.vehicle_id, 
            v.make, 
            v.model, 
            COUNT(t.trip_id) AS trip_count
        FROM Vehicles v
        JOIN Trips t ON v.vehicle_id = t.vehicle_id
        WHERE t.start_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY v.vehicle_id, v.make, v.model
        HAVING trip_count > 5
        ORDER BY v.vehicle_id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
