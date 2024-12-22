import { Socket } from 'socket.io';
import { IGameState, ICardInstance } from './game';

export interface ServerToClientEvents {
  // Game state updates
  'game:state': (gameState: IGameState) => void;
  'game:error': (error: { message: string }) => void;
  
  // Game events
  'game:started': (gameState: IGameState) => void;
  'game:ended': (gameState: IGameState) => void;
  'game:turnChanged': (data: { gameId: string; activePlayer: string }) => void;
  
  // Card events
  'card:played': (data: { gameId: string; playerId: string; card: ICardInstance }) => void;
  'card:attacked': (data: { 
    gameId: string;
    attackerId: string;
    attackingCard: ICardInstance;
    targetId?: string;
    targetCard?: ICardInstance | undefined;
  }) => void;
  'card:abilityUsed': (data: {
    gameId: string;
    playerId: string;
    card: ICardInstance;
    abilityIndex: number;
    target?: any;
  }) => void;
  
  // Player events
  'player:joined': (data: { gameId: string; playerId: string }) => void;
  'player:left': (data: { gameId: string; playerId: string }) => void;
  'player:energyUpdated': (data: {
    gameId: string;
    playerId: string;
    energy: { [key: string]: number }
  }) => void;
}

export interface ClientToServerEvents {
  // Game actions
  'game:join': (data: { gameId: string; token: string }) => void;
  'game:leave': (data: { gameId: string }) => void;
  'game:start': (data: { gameId: string }) => void;
  'game:endTurn': (data: { gameId: string }) => void;
  
  // Card actions
  'card:play': (data: { 
    gameId: string;
    cardInstanceId: string;
    target?: any;
  }) => void;
  'card:attack': (data: {
    gameId: string;
    attackerId: string;
    targetId?: string;
  }) => void;
  'card:useAbility': (data: {
    gameId: string;
    cardInstanceId: string;
    abilityIndex: number;
    target?: any;
  }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  gameId?: string;
}

export type GameSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
