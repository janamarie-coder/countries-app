import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import localData from "../localData.js";
import Home from "./pages/Home.jsx";
import SavedCountries from "./pages/SavedCountries.jsx";
import CountryDetail from "./pages/CountryDetail.jsx";
import "./App.css";

// The API URL, we only request the fields we actually need
const API_URL = "https://restcountries.com/v3.1/all?fields=name,flags,population,capital,region,cca3,borders";

function App() {

  // countriesData holds the list of all countries
  // it starts empty and gets filled when the API responds
  const [countriesData, setCountriesData] = useState([]);

  // useEffect runs this function once when the page first loads
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json()) // convert the response to JavaScript
      .then((data) => {
        // sort the countries alphabetically by their common name
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        // save the sorted countries into state so React can display them
        setCountriesData(sorted);
      })
      .catch((error) => {
        // if the API is down, fall back to the local data file instead
        console.error("API failed, falling back to localData:", error);
        const sorted = [...localData].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountriesData(sorted);
      });
  }, []); // the empty array means: only run this once, on first load

  return (
    <BrowserRouter>
      {/* The header is visible on every page */}
      <header className="header">
        <Link to="/" className="header-title">Where in the world?</Link>
        <Link to="/saved" className="header-saved">Saved Countries</Link>
      </header>

      {/* Routes decide which page to show based on the URL */}
      <Routes>
        <Route path="/" element={<Home countriesData={countriesData} />} />
        <Route path="/saved" element={<SavedCountries countriesData={countriesData} />} />
        <Route path="/country/:cca3" element={<CountryDetail countriesData={countriesData} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;