import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/components/navbar.scss";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();

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
              <span>{t("navbar.ahorro")}</span>
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
              <span>{t("navbar.meses")}</span>
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
              <span>{t("navbar.viajes")}</span>
            </NavLink>
          </li>
          <li>
            <div className="nav-lang-toggle">
              <span
                className={i18n.language === "es-ES" ? "lang active" : "lang"}
                onClick={() => i18n.changeLanguage("es-ES")}
              >
                ES
              </span>
              <span className="separator">|</span>
              <span
                className={i18n.language === "en-GB" ? "lang active" : "lang"}
                onClick={() => i18n.changeLanguage("en-GB")}
              >
                EN
              </span>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
