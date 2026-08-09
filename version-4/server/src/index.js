import express from "express";
import pg from "pg";
import config from "./config.js";

// create the Express app
const app = express();
const PORT = 3000;

// middleware — allows Express to read JSON from the request body
// without this, req.body would be undefined
app.use(express.json());

// set up the database connection pool using the Neon connection string
// Pool manages multiple database connections efficiently
// ssl: true is required for Neon hosted databases
const { Pool } = pg;
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: true,
});

// =====================
// USERS
// =====================

// GET /get-newest-user
// retrieves the most recently added user from the database
// ORDER BY user_id DESC gives us the highest (newest) user_id first
// LIMIT 1 means we only want one result
app.get("/get-newest-user", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY user_id DESC LIMIT 1");
    // result.rows is an array of objects — we send it as JSON to the frontend
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching newest user");
  }
});

// GET /get-all-users
// retrieves all users from the database ordered by user_id
app.get("/get-all-users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY user_id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching users");
  }
});

// POST /add-one-user
// adds a new user to the database using data from the request body
// we destructure the 4 fields we need from req.body
// $1, $2, $3, $4 are parameterized values — they prevent SQL injection attacks
app.post("/add-one-user", async (req, res) => {
  try {
    const { name, email, country_name, bio } = req.body;
    await pool.query(
      "INSERT INTO users (name, email, country_name, bio) VALUES ($1, $2, $3, $4)",
      [name, email, country_name, bio]
    );
    res.send("Success! User has been added.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding user");
  }
});

// =====================
// SAVED COUNTRIES
// =====================

// GET /get-all-saved-countries
// retrieves all saved country names from the database
app.get("/get-all-saved-countries", async (req, res) => {
  try {
    const result = await pool.query("SELECT country_name FROM saved_countries");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching saved countries");
  }
});

// POST /save-one-country
// saves a country to the database if it hasn't already been saved
// ON CONFLICT DO NOTHING prevents duplicate entries
// since country_name has a UNIQUE constraint, duplicates would cause an error without this
app.post("/save-one-country", async (req, res) => {
  try {
    const { country_name } = req.body;
    await pool.query(
      "INSERT INTO saved_countries (country_name) VALUES ($1) ON CONFLICT DO NOTHING",
      [country_name]
    );
    res.send("Success! The country is saved.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving country");
  }
});

// POST /unsave-one-country
// removes a country from the saved_countries table using the country name
// $1 is the parameterized value for the country name from the request body
app.post("/unsave-one-country", async (req, res) => {
  try {
    const { country_name } = req.body;
    await pool.query(
      "DELETE FROM saved_countries WHERE country_name = $1",
      [country_name]
    );
    res.send("Success! The country is unsaved.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error unsaving country");
  }
});

// =====================
// COUNTRY COUNTS
// =====================

// POST /update-one-country-count
// increases the view count for a country by 1 every time this endpoint is called
// if the country doesn't exist yet in country_counts, it gets inserted with count = 1
// ON CONFLICT DO UPDATE handles the case where the country already exists
// RETURNING count sends the updated count back to the frontend so we can display it
app.post("/update-one-country-count", async (req, res) => {
  try {
    const { country_name } = req.body;
    const result = await pool.query(
      `INSERT INTO country_counts (country_name, count) VALUES ($1, 1)
       ON CONFLICT (country_name) DO UPDATE SET count = country_counts.count + 1
       RETURNING count`,
      [country_name]
    );
    // result.rows[0].count is the updated count — we send it as JSON to the frontend
    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating country count");
  }
});

// start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});