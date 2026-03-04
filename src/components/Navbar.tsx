import React from "react";
import { NavLink } from "react-router-dom";
import "../assets/components/navbar.scss";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-logo">
          <h2>Finket</h2>
        </div>
        <ul className="navbar-links">
          <li>
            <NavLink
              to="/ahorro"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <AccountBalanceWalletIcon className="nav-icon" />
              <span>Ahorro</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/meses"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <CalendarMonthIcon className="nav-icon" />
              <span>Meses</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/viajes"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <FlightTakeoffIcon className="nav-icon" />
              <span>Viajes</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
