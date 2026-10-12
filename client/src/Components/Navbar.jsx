import React, { useState } from "react";
import "./Navbar.css";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsNavOpen(false);
  };

  const handleNavOpenClick = () => {
    setIsNavOpen(true);
    setIsSearchOpen(false);
  };

  const handleNavCloseClick = () => {
    setIsNavOpen(false);
  };

  return (
    <>
      <nav
        className={`nav ${isSearchOpen ? "openSearch" : ""} ${
          isNavOpen ? "openNav" : ""
        }`}
      >
        <i className="uil uil-bars navOpenBtn" onClick={handleNavOpenClick}></i>
        <a href="/#" className="logo">
          Finance Tracker
        </a>

        <ul className="nav-links">
          <i
            className="uil uil-times navCloseBtn"
            onClick={handleNavCloseClick}
          ></i>
          <li>
            <a href="/#">Home</a>
          </li>
          <li>
            <a href="/core">Dashboard</a>
          </li>
          <li>
            <a href="/aboutus">About Us</a>
          </li>
          <li>
            {currentUser ? (
              <span
                style={{
                  color: "#00FF66",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: "rgba(0, 255, 102, 0.12)",
                  border: "1px solid rgba(0, 255, 102, 0.3)",
                }}
                onClick={() => setCurrentUser(null)}
                title="Click to logout"
              >
                ● {currentUser.name || "Parth"} (Logout)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                style={{
                  background:
                    "linear-gradient(135deg, #00FF66 0%, #00bb4b 100%)",
                  color: "#000000",
                  fontWeight: "700",
                  border: "none",
                  padding: "7px 18px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                }}
              >
                Sign In
              </button>
            )}
          </li>
        </ul>

        <i
          className={`uil uil-search search-icon ${
            isSearchOpen ? "openSearch" : ""
          }`}
          id="searchIcon"
          onClick={handleSearchClick}
        ></i>
        <div className={`search-box ${isSearchOpen ? "openSearch" : ""}`}>
          <i className="uil uil-search search-icon"></i>
          <input type="text" placeholder="Search here..." />
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </>
  );
};

export default Navbar;
