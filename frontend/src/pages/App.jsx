import React from 'react';
import BusinessAnalysisApp from '../components/BusinessAnalysisApp';

// Business Analysis App Component
const App = ({ actor, isAuthenticated, login, logout, user }) => {
  return (
    <BusinessAnalysisApp
      user={user}
      logout={logout}
    />
  );
};

export default App;