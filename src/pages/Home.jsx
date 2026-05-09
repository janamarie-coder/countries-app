import CountryCard from "../components/CountryCard.jsx";

function Home({ countriesData }) {
  return (
    <main className="home">
      <div className="countries-grid">
        {countriesData.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </div>
    </main>
  );
}


export default Home;