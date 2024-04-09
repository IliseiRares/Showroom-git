import express from 'express';
import mysql from 'mysql';

const router = express.Router();

// MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "car_sales_db"
});

// GET request handler for retrieving cars
router.get('/', (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    // Query the database
    connection.query("SELECT * FROM cars", (err, result, fields) => {
      // Release the connection back to the pool
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Error executing query' });
      }

      // Send the result to the client
      res.status(200).json(result);
    });
  });
});

export default router;