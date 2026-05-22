import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Shows detailed information about one country
function CountryDetail({ countriesData }) {
  const { cca3 } = useParams();
  const navigate = useNavigate();

  // stores the view count we get back from the backend after updating it
  const [viewCount, setViewCount] = useState(null);


  // POST REQUEST: update the view count for this country
  // this useEffect runs every time the cca3 code in the URL changes
  // meaning: every time the user opens a different country's detail page
  // we send a POST request to the backend to increase the view count by 1
  // the backend returns the new total count, which we save in state and display

  useEffect(() => {

    const updateViewCount = async () => {
      try {

        const response = await fetch("/api/update-one-country-count", {
          method: "POST",
          headers: {
            // tell the backend we are sending JSON so it can read the request body
            "Content-Type": "application/json",
          },
          // send the country name in the request body as a JSON string
         body: JSON.stringify({ country_name: countriesData.find(c => c.cca3 === cca3)?.name.common }),
        });

        // convert the response into a JavaScript object
        const data = await response.json();

        // save the updated count in state so we can display it on the page
        // the API returns an object like: { count: 3 }
        setViewCount(data.count);

        console.log("View count updated:", data.count);

      } catch (error) {
        console.error("Error updating view count:", error);
      }
    };

    updateViewCount();

  }, [cca3]); // re-runs whenever the user navigates to a different country

  // Find the country that matches the URL parameter
  const country = countriesData.find((c) => c.cca3 === cca3);

  // Show loading state while data is being fetched
  if (!country) {
    return <p className="loading">Loading...</p>;
  }

  const name = country.name.common;
 const flag = country.flags?.svg || country.flags?.png;
  const population = country.population.toLocaleString();
  const region = country.region;
  const capital = country.capital?.[0] ?? "N/A";

  // Find the full names of bordering countries
  const borderCountries = (country.borders ?? []).map((borderCode) => {
    const found = countriesData.find((c) => c.cca3 === borderCode);
    return found ? found.name.common : borderCode;
  });



  // POST REQUEST: save this country to the backend
  // this function runs when the user clicks the Save button
  // it sends the country name to the backend via a POST request
  // if the country is already saved, the backend ignores it (no duplicates)
  const handleSave = async () => {
    try {

      const response = await fetch("/api/save-one-country", {
        method: "POST",
        headers: {
          // tell the backend we are sending JSON
          "Content-Type": "application/json",
        },
        // send the country name in the request body
        body: JSON.stringify({ country_name: name }),
      });

      const data = await response.text();
      console.log("Country saved:", data);
      alert(`${name} has been saved!`);

    } catch (error) {
      console.error("Error saving country:", error);
    }
  };

return (
    <main className="detail">

      {/* Back button — navigates to the previous page */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-content">
        <img
          src={flag}
          alt={`Flag of ${name}`}
          className="detail-flag"
          onError={(e) => e.target.style.display = "none"}
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

          {/* show the view count once it has been fetched from the backend */}
          {viewCount !== null && (
            <p className="view-count">
              <span className="label">Times viewed:</span> {viewCount}
            </p>
          )}

          {/* Save button — sends this country to the backend */}
          <button className="save-btn" onClick={handleSave}>
            Save Country
          </button>

          {/* Bordering countries — each button navigates to that country's detail page */}
          {borderCountries.length > 0 && (
            <div className="borders">
              <span className="label">Border Countries: </span>
              {borderCountries.map((borderName) => {
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