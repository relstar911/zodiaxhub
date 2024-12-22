import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from 'react-router-dom';

const TestGame: React.FC = () => {
  const { user, logout } = useAuth();
  const [gameId, setGameId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useSocket(gameId || undefined);
  const navigate = useNavigate();

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    // Subscribe to game state updates
    const unsubscribeGameState = socket.onGameState((gameState) => {
      addMessage(`Game state updated: ${JSON.stringify(gameState)}`);
    });

    // Subscribe to error messages
    const unsubscribeError = socket.onError((error) => {
      addMessage(`Error: ${error.message}`);
    });

    return () => {
      unsubscribeGameState();
      unsubscribeError();
    };
  }, [socket]);

  const handleCreateGame = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage;
        try {
          const jsonError = JSON.parse(errorData);
          errorMessage = jsonError.message || 'Failed to create game';
        } catch {
          errorMessage = errorData || 'Failed to create game';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.game && data.game._id) {
        setGameId(data.game._id);
        addMessage(`Created game with ID: ${data.game._id}`);
      } else {
        throw new Error('Invalid game data received');
      }
    } catch (error) {
      addMessage(`Error creating game: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Create game error:', error);
    }
  };

  const handleStartGame = () => {
    try {
      socket.startGame();
      addMessage('Started game');
    } catch (error) {
      addMessage(`Error starting game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEndTurn = () => {
    try {
      socket.endTurn();
      addMessage('Ended turn');
    } catch (error) {
      addMessage(`Error ending turn: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test Game Component</h1>
        <div className="flex items-center gap-4">
          <span>Logged in as: {user?.username}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-700 rounded p-4">
          <h2 className="text-xl font-bold mb-4">Game Controls</h2>
          <div className="space-y-2">
            <button
              onClick={handleCreateGame}
              disabled={!!gameId}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600"
            >
              Create Game
            </button>
            <button
              onClick={handleStartGame}
              disabled={!gameId}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600"
            >
              Start Game
            </button>
            <button
              onClick={handleEndTurn}
              disabled={!gameId}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-gray-600"
            >
              End Turn
            </button>
          </div>

          {gameId && (
            <div className="mt-4">
              <h3 className="font-bold">Game ID:</h3>
              <code className="block bg-gray-800 p-2 rounded mt-1">{gameId}</code>
            </div>
          )}
        </div>

        <div className="border border-gray-700 rounded p-4">
          <h2 className="text-xl font-bold mb-4">Event Log</h2>
          <div className="h-96 overflow-y-auto bg-gray-800 p-4 rounded">
            {messages.map((message, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestGame;
