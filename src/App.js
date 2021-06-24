import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { AuthProvider } from './context/AuthProvider';

// Common People or Users Components Imports
import PeopleLogin from './routes/people/Login'
import PeopleRegister from './routes/people/Register'
import GovtLogin from './routes/govt/GovtLogin';
import GovtRegister from './routes/govt/GovtRegister';
import GovtDashboard from './routes/govt/GovtDashboard';
import Shops from './routes/govt/Shops';
import Schemes from './routes/govt/Schemes';
import Quota from './routes/govt/Quota';
// End

// Government Components Imports

// End

// Shops Components Imports

// End

// Company Components Imports

// End

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={PeopleLogin} />
          <Route exact path="/govt-login" component={GovtLogin} />
          <Route exact path="/govt-registration" component={GovtRegister} />
          <Route exact path="/govt-dashboard" component={GovtDashboard} />
          <Route exact path="/login" component={PeopleLogin} />
          <Route exact path="/register" component={PeopleRegister} />
          <Route exact path="/shops" component={Shops} />
          <Route exact path="/schemes" component={Schemes} />
          <Route exact path="/quota" component={Quota} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
