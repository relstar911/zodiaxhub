import React from 'react';

const Simulator: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Game Simulator</h1>
      <div className="space-y-6">
        {/* Game Board */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="aspect-[16/9] bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Game Board</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Player Hand</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-24 aspect-[2.5/3.5] bg-gray-700 rounded-lg"
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Game Controls</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                  Draw Card
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">
                  End Turn
                </button>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md">
                  Attack
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md">
                  Surrender
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
