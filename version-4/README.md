# 🌍 Countries App

## 📌 Project Description & Purpose

This project is a full-stack web app that lets users explore countries from around the world. Users can search and filter countries, view detailed information, save their favorite countries, and track how many times they've viewed each country. The app is built across 4 versions, each adding more complexity — from local data to a full backend with a PostgreSQL database.

## 🚀 Live Site

Here's the link to view the live app: https://countries-app-jana.netlify.app/ 

## 🖼️ Screenshots

<img width="1440" height="809" alt="Screenshot 2026-08-08 at 9 57 18 PM" src="https://github.com/user-attachments/assets/d77e9d1d-c447-44fb-b067-151b527e2244" />

<img width="1440" height="814" alt="Screenshot 2026-08-08 at 9 56 51 PM" src="https://github.com/user-attachments/assets/21644b48-166e-4799-9b99-07dd9e2bb304" />



## ✨ Features

- Browse all countries with flag, population, capital and region
- Search countries by name
- Filter countries by region
- Click on a country to see detailed information
- Save countries and view them on the Saved Countries page
- Track how many times each country has been viewed
- Submit a profile form that gets stored in the database
- Heart button to save and unsave countries

## 🛠️ Tech Stack

**Frontend**
- **Languages:** JavaScript, HTML, CSS
- **Framework:** React (Vite)
- **Deployment:** Netlify

**Server/API**
- **Languages:** JavaScript (Node.js)
- **Framework:** Express
- **Deployment:** https://countries-app-xyba.onrender.com 

**Database**
- **Languages:** SQL (PostgreSQL)
- **Deployment:** Neon

## 🔹 API Documentation

These are the API endpoints I built:

Method | Endpoint | Full URL 

1. GET | /get-newest-user | https://countries-app-xyba.onrender.com/get-newest-user 

2. GET | /get-all-users | https://countries-app-xyba.onrender.com/get-all-users 

3. POST | /add-one-user | https://countries-app-xyba.onrender.com/add-one-user 

4. GET | /get-all-saved-countries | https://countries-app-xyba.onrender.com/get-all-saved-countries 

5. POST | /save-one-country | https://countries-app-xyba.onrender.com/save-one-country 

6. POST | /unsave-one-country | https://countries-app-xyba.onrender.com/unsave-one-country 

7. POST | /update-one-country-count | https://countries-app-xyba.onrender.com/update-one-country-count 


## 🗄️ Database Schema

Here's the SQL I used to create my tables:

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  country_name VARCHAR(255),
  bio TEXT
);

CREATE TABLE saved_countries (
  id SERIAL PRIMARY KEY,
  country_name VARCHAR(255) UNIQUE
);

CREATE TABLE country_counts (
  id SERIAL PRIMARY KEY,
  country_name VARCHAR(255) UNIQUE,
  count INTEGER DEFAULT 0
);
```

## 💭 Reflections

**What I learned:** How to build a full-stack app from scratch — connecting a React frontend to an Express server and a PostgreSQL database using GET and POST requests.

**What I'm proud of:** Building my own backend API and database for the first time, and adding bonus features like the heart button and unsave functionality.

**What challenged me:** Understanding how useEffect works with async functions, and figuring out the correct order of hooks in React.

**Future ideas:**
1. Add user authentication so each user has their own saved countries
2. Add a notes feature so users can write about each country
3. Show more detailed country statistics

## 🙌 Credits & Shoutouts

- REST Countries API: https://restcountries.com
- AnnieCannons bootcamp instructors: Cat, Haniya and Xavier
- Neon for hosted PostgreSQL database
