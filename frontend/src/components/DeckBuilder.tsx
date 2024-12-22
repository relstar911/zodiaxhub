import React from 'react';

const DeckBuilder: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Deck Builder</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Library */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Card Library</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Sample cards - replace with actual card data */}
            {[1, 2, 3, 4, 5, 6, 8].map((i) => (
              <div
                key={i}
                className="aspect-[2.5/3.5] bg-gray-700 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500"
              />
            ))}
          </div>
        </div>

        {/* Current Deck */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Deck</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[2.5/3.5] bg-gray-700 rounded-lg cursor-pointer hover:ring-2 hover:ring-red-500"
                />
              ))}
            </div>
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-lg font-medium mb-2">Deck Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cards:</span>
                  <span>6/40</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Energy:</span>
                  <span>3.5</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
              Save Deck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;
