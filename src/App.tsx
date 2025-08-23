import React from 'react';
import PokemonBinder from './components/PokemonBinder';
import { useAuth } from './hooks/useAuth';
import './styles/PokemonBinder.css';

function App() {
  const { isDemoMode, loading, user, profile } = useAuth();

  // Show loading screen while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="text-white text-xl">Loading...</div>
          {isDemoMode && <div className="text-blue-400 text-sm">Demo Mode</div>}
        </div>
      </div>
    );
  }

  return (
    <PokemonBinder 
      key={`${isDemoMode ? 'demo' : 'normal'}-${user?.id || 'no-user'}`}
      isDemoMode={isDemoMode}
      user={user}
      profile={profile}
    />
  );
}

export default App;