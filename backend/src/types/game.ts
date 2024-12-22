import { Document } from 'mongoose';
import { PowerSign } from './index';

export enum GamePhase {
  PREPARATION = 'PREPARATION',
  MAIN = 'MAIN',
  COMBAT = 'COMBAT',
  END = 'END'
}

export enum CardLocation {
  DECK = 'DECK',
  HAND = 'HAND',
  FIELD = 'FIELD',
  GRAVEYARD = 'GRAVEYARD',
  BANISHED = 'BANISHED'
}

export enum CardState {
  READY = 'READY',
  TAPPED = 'TAPPED',
  EXHAUSTED = 'EXHAUSTED'
}

export interface ICardInstance {
  cardId: string;
  instanceId: string;
  location: CardLocation;
  state: CardState;
  powerSignModifier?: PowerSign;
  counters: {
    power?: number;
    defense?: number;
    energy?: number;
    custom?: { [key: string]: number };
  };
}

export interface IPlayerState {
  userId: string;
  deck: ICardInstance[];
  hand: ICardInstance[];
  field: ICardInstance[];
  graveyard: ICardInstance[];
  banished: ICardInstance[];
  energy: {
    [key in PowerSign]?: number;
  };
  lifePoints: number;
  questProgress?: {
    [questId: string]: {
      progress: number;
      completed: boolean;
    };
  };
}

export interface IGameState {
  gameId: string;
  players: {
    [userId: string]: IPlayerState;
  };
  currentPhase: GamePhase;
  currentTurn: number;
  activePlayer: string;
  turnOrder: string[];
  lastAction?: {
    type: string;
    playerId: string;
    timestamp: number;
    data: any;
  };
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  winner?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGame extends IGameState, Document {
  addPlayer(userId: string, deck: string[]): Promise<void>;
  startGame(): Promise<void>;
  endTurn(): Promise<void>;
  playCard(playerId: string, cardInstanceId: string, target?: any): Promise<void>;
  useAbility(playerId: string, cardInstanceId: string, abilityIndex: number, target?: any): Promise<void>;
  declareAttack(playerId: string, attackerId: string, targetId?: string): Promise<void>;
  generateEnergy(playerId: string): Promise<void>;
}
