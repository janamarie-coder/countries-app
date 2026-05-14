import { useState } from "react";

function SavedCountries({ countriesData }) {
  // Form state, one object holds all field values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    bio: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Update the correct field when user types
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  }

  return (
    <main className="saved-page">
      <h1 className="saved-title">Saved Countries</h1>

      {submitted ? (
        <p className="success-message">Profile saved! 🎉</p>
      ) : (
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
              {/* Populate dropdown from API data */}
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
      )}
    </main>
  );
}

export default SavedCountries;