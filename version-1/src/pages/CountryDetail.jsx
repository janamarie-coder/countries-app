import { useParams, useNavigate } from "react-router-dom";

// Shows detailed information about one country
function CountryDetail({ countriesData }) {
  const { cca3 } = useParams();
  const navigate = useNavigate();

  // Find the country that matches the URL parameter
  const country = countriesData.find((c) => c.cca3 === cca3);

  // Show loading state while data is being fetched
  if (!country) {
    return <p className="loading">Loading...</p>;
  }

  const name = country.name.common;
 const flag = country.flags?.png || country.flags?.svg;
  const population = country.population.toLocaleString();
  const region = country.region;
  const capital = country.capital?.[0] ?? "N/A";

  // Find the full names of bordering countries
  const borderCountries = (country.borders ?? []).map((borderCode) => {
    const found = countriesData.find((c) => c.cca3 === borderCode);
    return found ? found.name.common : borderCode;
  });

  return (
    <main className="detail">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-content">
       <img
  src={flag}
  alt={`Flag of ${name}`}
  className="card-flag"
  onError={(e) => e.target.src = "https://via.placeholder.com/320x200?text=No+Flag"}
/>

        <div className="detail-info">
          <h1 className="detail-name">{name}</h1>

          <div className="detail-columns">
            <div>
              <p><span className="label">Population:</span> {population}</p>
              <p><span className="label">Region:</span> {region}</p>
              <p><span className="label">Capital:</span> {capital}</p>
            </div>
          </div>

          {/* Bordering countries */}
          {borderCountries.length > 0 && (
            <div className="borders">
              <span className="label">Border Countries: </span>
              {borderCountries.map((borderName) => {
                // Find the cca3 code so we can navigate to that country
                const borderCountry = countriesData.find(
                  (c) => c.name.common === borderName
                );
                return (
                  <button
                    key={borderName}
                    className="border-btn"
                    onClick={() => navigate(`/country/${borderCountry?.cca3}`)}
                  >
                    {borderName}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default CountryDetail;