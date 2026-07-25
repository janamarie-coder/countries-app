import express from "express";
import pg from "pg";
import config from "./config.js";

const app = express();
const PORT = 3000;

// middleware — allows Express to read JSON from request body
app.use(express.json());

// set up the database connection using the Neon connection string
const { Pool } = pg;
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: true,
});

// =====================
// USERS
// =====================

// GET /get-newest-user
app.get("/get-newest-user", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY user_id DESC LIMIT 1");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching newest user");
  }
});

// GET /get-all-users
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
app.post("/update-one-country-count", async (req, res) => {
  try {
    const { country_name } = req.body;
    const result = await pool.query(
      `INSERT INTO country_counts (country_name, count) VALUES ($1, 1)
       ON CONFLICT (country_name) DO UPDATE SET count = country_counts.count + 1
       RETURNING count`,
      [country_name]
    );
    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating country count");
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});