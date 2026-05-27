import { useState, useEffect } from "react";

function SavedCountries({ countriesData }) {

  // stores all the values the user types into the form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    bio: "",
  });

  // stores the most recently submitted user from the backend
  // starts as null because we don't know yet if a user exists
  const [currentUser, setCurrentUser] = useState(null);

  // stores the list of all saved countries from the backend
  // starts as an empty array because we haven't fetched the data yet
  const [savedCountries, setSavedCountries] = useState([]);


  // GET: retrieve the newest user when the page loads
  // if a user already exists, we show "Welcome, [name]!" instead of the form
  useEffect(() => {
    const getNewestUser = async () => {
      try {
        const response = await fetch("/api/get-newest-user");
        const data = await response.json();
        // the response is an array — we grab the first item
        if (data.length > 0) {
          setCurrentUser(data[0]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getNewestUser();
  }, []);


  // GET: retrieve all saved countries when the page loads
  // so the user can see which countries they have saved
  useEffect(() => {
    const getSavedCountries = async () => {
      try {
        const response = await fetch("/api/get-all-saved-countries");
        const data = await response.json();
        setSavedCountries(data);
      } catch (error) {
        console.error("Error fetching saved countries:", error);
      }
    };
    getSavedCountries();
  }, []);


  // update the correct field in formData when the user types
  // the spread operator ...prevFormData keeps all other fields the same
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }


  // POST: send the form data to the backend when the user submits
  // Content-Type header tells the backend we are sending JSON
  // after saving, we fetch the newest user again so the welcome message shows immediately
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/add-one-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          country_name: formData.country,
          bio: formData.bio,
        }),
      });
      const data = await response.text();
      console.log("POST response:", data);

      // after saving, fetch the newest user so "Welcome, [name]!" appears right away
      const userResponse = await fetch("/api/get-newest-user");
      const userData = await userResponse.json();
      if (userData.length > 0) {
        setCurrentUser(userData[0]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }


  // POST: unsave a country from the backend
  // after unsaving, we fetch the updated list so the page updates immediately
  async function handleUnsave(countryName) {
    try {
      const response = await fetch("/api/unsave-one-country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // send the name of the country we want to remove
        body: JSON.stringify({ country_name: countryName }),
      });
      const data = await response.text();
      console.log("Country unsaved:", data);

      // refresh the saved countries list so the page updates immediately
      const updated = await fetch("/api/get-all-saved-countries");
      const updatedData = await updated.json();
      setSavedCountries(updatedData);

    } catch (error) {
      console.error("Error unsaving country:", error);
    }
  }


  return (
    <main className="saved-page">
      <h1 className="saved-title">Saved Countries</h1>

      {/* show all saved countries with an unsave button for each */}
      <div className="saved-countries-list">
        {savedCountries.map((country) => (
          <div key={country.country_name} className="saved-country-chip">
            <span>{country.country_name}</span>
            {/* clicking ✕ removes this country from the saved list */}
            <button
              className="unsave-btn"
              onClick={() => handleUnsave(country.country_name)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

     {/* show welcome message if a user exists */}
      {currentUser && (
        <p className="welcome-message">Welcome, {currentUser.name}!</p>
     )}

     {/* always show the form */}
        <form className="profile-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select a country</option>
              {countriesData.map((c) => (
                <option key={c.cca3} value={c.name.common}>
                  {c.name.common}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <button type="submit" className="submit-btn">Save Profile</button>
        </form>
      
    </main>
  );
}

export default SavedCountries;