import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import CardEditor from './components/CardEditor';
import DeckBuilder from './components/DeckBuilder';
import Simulator from './components/Simulator';
import Community from './components/Community';
import Navigation from './components/Navigation';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import TestGame from './components/TestGame';
import { CardData } from './types/card';

function App() {
  const handleSaveCard = (card: CardData) => {
    // Handle save
    console.log('Saving card:', card);
  };

  const handleCancelEdit = () => {
    // Handle cancel
    console.log('Cancelled editing');
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test-game"
                element={
                  <ProtectedRoute>
                    <TestGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/card-editor"
                element={
                  <ProtectedRoute>
                    <CardEditor
                      onSave={handleSaveCard}
                      onCancel={handleCancelEdit}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deck-builder"
                element={
                  <ProtectedRoute>
                    <DeckBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/simulator"
                element={
                  <ProtectedRoute>
                    <Simulator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
