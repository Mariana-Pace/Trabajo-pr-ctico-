import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
        </button>
        <Link to="/">Inicio</Link>
        <Link to="/favorites">Favoritos</Link>
      </div>
    </nav>
  );
}

export default Navbar;
