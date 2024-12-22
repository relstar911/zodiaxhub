import React from 'react';

const Community: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Community Hub</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Games */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Active Games</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Game #{i}</h3>
                    <p className="text-sm text-gray-400">Player1 vs Player2</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md">
                    Watch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Events */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Upcoming Tournaments</h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium">Weekend Tournament #{i}</h3>
                  <p className="text-sm text-gray-400">Starts in 2 days</p>
                  <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md">
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{i}</span>
                    <span>Player {i}</span>
                  </div>
                  <span className="text-gray-400">{1000 - i * 50} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
