// CountryCard: it displays flag, name, population, capital, region for one country
function CountryCard({ country }) {
  const name = country.name.common;
  const flag = country.flags?.png;
  const population = country.population.toLocaleString();
  const region = country.region;
  // Capital is an array; some countries have none
  const capital = country.capital?.[0] ?? "N/A";

  return (
    <div className="card">
      <img src={flag} alt={`Flag of ${name}`} className="card-flag" />
      <div className="card-info">
        <h2 className="card-name">{name}</h2>
        <p><span className="label">Population:</span> {population}</p>
        <p><span className="label">Region:</span> {region}</p>
        <p><span className="label">Capital:</span> {capital}</p>
      </div>
    </div>
  );
}

export default CountryCard;