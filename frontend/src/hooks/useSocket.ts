import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import socketService from '../services/socketService';

export const useSocket = (gameId?: string) => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (gameId && token) {
      socketService.joinGame(gameId, token);

      return () => {
        socketService.leaveGame(gameId);
      };
    }
  }, [gameId, token]);

  const startGame = useCallback(() => {
    if (!gameId) throw new Error('Game ID is required');
    socketService.startGame(gameId);
  }, [gameId]);

  const endTurn = useCallback(() => {
    if (!gameId) throw new Error('Game ID is required');
    socketService.endTurn(gameId);
  }, [gameId]);

  const playCard = useCallback((cardInstanceId: string, target?: any) => {
    if (!gameId) throw new Error('Game ID is required');
    socketService.playCard(gameId, cardInstanceId, target);
  }, [gameId]);

  const attackWithCard = useCallback((attackerId: string, targetId?: string) => {
    if (!gameId) throw new Error('Game ID is required');
    socketService.attackWithCard(gameId, attackerId, targetId);
  }, [gameId]);

  const useCardAbility = useCallback((cardInstanceId: string, abilityIndex: number, target?: any) => {
    if (!gameId) throw new Error('Game ID is required');
    socketService.useCardAbility(gameId, cardInstanceId, abilityIndex, target);
  }, [gameId]);

  return {
    startGame,
    endTurn,
    playCard,
    attackWithCard,
    useCardAbility,
    onGameState: socketService.onGameState.bind(socketService),
    onError: socketService.onError.bind(socketService)
  };
};
