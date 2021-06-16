import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { AuthProvider } from './context/AuthProvider';

// Common People or Users Components Imports
import PeopleLogin from './routes/people/login'
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
          <Route exact path="/peopleLogin" component={PeopleLogin} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
