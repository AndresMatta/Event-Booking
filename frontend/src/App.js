import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import "./App.css";

import AuthContext from "./context/auth-context";

import AuthPage from "./components/pages/Auth";
import EventsPage from "./components/pages/Events";
import BookingsPage from "./components/pages/Bookings";

import MainNavigation from "./components/common/navbar/MainNavigation";

function App() {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const login = (currenteUserId, currentToken, tokenExpiration) => {
    setUserId(currenteUserId);
    setToken(currentToken);
  };
  const logout = () => {
    setUserId(null);
    setToken(null);
  };

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider
          value={{
            userId,
            token,
            login,
            logout
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {token && <Redirect from="/" to="/events" exact />}
              {token && <Redirect from="/auth" to="/events" exact />}
              {!token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {token && <Route path="/bookings" component={BookingsPage} />}
              {!token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
