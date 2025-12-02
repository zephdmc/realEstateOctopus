import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRouter from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
// import GlobalSearch from './components/common/GlobalSearch';
// Import global styles
import './styles/globals.css';
import './styles/components.css';
import './styles/animations.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router> {/* ← NO basename with HashRouter */}
          <div className="App">
            <AppRouter />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;