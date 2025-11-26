import React from 'react';
import { HashRouter as Router } from 'react-router-dom'; // ← Change this
import AppRouter from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
// Import global styles
import './styles/globals.css';
import './styles/components.css';
import './styles/animations.css';

function App() {
  const basename = window.location.hostname === 'localhost' ? '/realEstateOctopus' : '';
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router basename={basename}>
          <div className="App">
            <AppRouter />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;