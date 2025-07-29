import React from 'react';
import BusinessAnalysisApp from '../components/BusinessAnalysisApp';

// Business Analysis App Component
const App = ({ actor, isAuthenticated, login, logout }) => {
  return (
    <BusinessAnalysisApp
      actor={actor}
      isAuthenticated={isAuthenticated}
      login={login}
      logout={logout}
    />
  );
};

export default App;