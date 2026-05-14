import { useNavigate } from "react-router-dom";

// Displays flag, name, population, region, and capital for one country
function CountryCard({ country }) {
  const navigate = useNavigate();

  const name = country.name.common;
  const flag = country.flags?.png || country.flags?.svg;
  const population = country.population.toLocaleString();
  const region = country.region;
  const capital = country.capital?.[0] ?? "N/A";

  // Navigate to CountryDetail page when card is clicked
  function handleClick() {
    // navigate() switches to a different page
// the backtick string builds the URL dynamically using the country's unique code
    navigate(`/country/${country.cca3}`);
  }

  return (
    <div className="card" onClick={handleClick}>
      <img
  src={flag}
  alt={`Flag of ${name}`}
  className="card-flag"
  onError={(e) => e.target.src = "https://via.placeholder.com/320x200?text=No+Flag"}
/>
      <div className="card-info">
        <h2 className="card-name">{name}</h2>
        <p><span className="label">Population:</span> {population}</p>
        <p><span className="label">Capital:</span> {capital}</p>
        <p><span className="label">Region:</span> {region}</p>
      </div>
    </div>
  );
}

export default CountryCard;