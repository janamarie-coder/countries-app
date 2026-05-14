import { useState } from "react";
import CountryCard from "../components/CountryCard.jsx";

// Home receives the full list of countries from App as a prop
function Home({ countriesData }) {

  // search holds whatever the user types in the search bar
  const [search, setSearch] = useState("");

  // region holds the selected region from the dropdown (empty = show all)
  const [region, setRegion] = useState("");

  // filter the countries list every time search or region changes
  // we don't store this in state, we just calculate it fresh each render
  const filteredCountries = countriesData.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRegion = region === "" || country.region === region;
    // only keep the country if it matches both the search AND the region
    return matchesSearch && matchesRegion;
  });

  return (
    <main className="home">
      {/* Search bar and region dropdown */}
      <div className="controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search for a country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">Filter by Region</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      {/* Render one CountryCard for each country that passed the filter */}
      <div className="countries-grid">
        {filteredCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>
    </main>
  );
}

export default Home;