import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import localData from "../localData.js";
import Home from "./pages/Home.js";
import SavedCountries from "./pages/SavedCountries.js";
import CountryDetail from "./pages/CountryDetail.js";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <Link to="/" className="header-title">Where in the world?</Link>
        <Link to="/saved" className="header-saved">Saved Countries</Link>
      </header>

      <Routes>
        <Route path="/" element={<Home countriesData={localData} />} />
        <Route path="/saved" element={<SavedCountries />} />
        <Route path="/country/:name" element={<CountryDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;