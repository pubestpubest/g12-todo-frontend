import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import "@styles/NavBar.css";

const NavBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title" data-test="navbar-title">Events Dashboard</h1>
        
        <button 
          className="theme-toggle-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          data-test="theme-toggle-button"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;