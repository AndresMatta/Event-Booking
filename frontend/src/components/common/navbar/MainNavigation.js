import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../../context/auth-context";

import "./MainNavigation.css";

const MainNavigation = () => {
  const currentAuth = useContext(AuthContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EventBooking</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!currentAuth.token && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {currentAuth.token && (
            <React.Fragment>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={currentAuth.logout}>Logout</button>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
