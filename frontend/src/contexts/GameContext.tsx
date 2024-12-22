import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { IGameState } from '../../../backend/src/types/game';

interface GameContextType {
  gameState: IGameState | null;
  error: string | null;
  isLoading: boolean;
  startGame: () => void;
  endTurn: () => void;
  playCard: (cardInstanceId: string, target?: any) => void;
  attackWithCard: (attackerId: string, targetId?: string) => void;
  useCardAbility: (cardInstanceId: string, abilityIndex: number, target?: any) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ gameId: string; children: React.ReactNode }> = ({
  gameId,
  children
}) => {
  const [gameState, setGameState] = useState<IGameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket(gameId);

  useEffect(() => {
    const unsubscribeGameState = socket.onGameState((newGameState) => {
      setGameState(newGameState);
      setIsLoading(false);
    });

    const unsubscribeError = socket.onError((error) => {
      setError(error.message);
      setIsLoading(false);
    });

    return () => {
      unsubscribeGameState();
      unsubscribeError();
    };
  }, [socket]);

  const value = {
    gameState,
    error,
    isLoading,
    startGame: socket.startGame,
    endTurn: socket.endTurn,
    playCard: socket.playCard,
    attackWithCard: socket.attackWithCard,
    useCardAbility: socket.useCardAbility
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
