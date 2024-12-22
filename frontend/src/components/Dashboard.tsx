import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Zodiax Hub</h1>
      
      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/card-editor" className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h2 className="text-xl font-semibold mb-2">Card Editor</h2>
          <p className="text-gray-400">Create and manage your cards</p>
        </Link>
        
        <Link to="/deck-builder" className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h2 className="text-xl font-semibold mb-2">Deck Builder</h2>
          <p className="text-gray-400">Build and organize your decks</p>
        </Link>
        
        <Link to="/simulator" className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h2 className="text-xl font-semibold mb-2">Simulator</h2>
          <p className="text-gray-400">Test your decks and strategies</p>
        </Link>
        
        <Link to="/community" className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          <h2 className="text-xl font-semibold mb-2">Community</h2>
          <p className="text-gray-400">Connect with other players</p>
        </Link>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add recent activity items here */}
        </div>
      </div>
      
      {/* Statistics */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Add statistics here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
