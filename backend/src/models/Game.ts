import { Schema, model, Document } from 'mongoose';
import { IGame, GamePhase, CardLocation, CardState, ICardInstance, IPlayerState } from '../types/game';
import { PowerSign } from '../types';

export interface IGameDocument extends Omit<IGame, keyof Document>, Document {
  addPlayer(userId: string, deck: string[]): Promise<void>;
  startGame(): Promise<void>;
  endTurn(): Promise<void>;
  playCard(playerId: string, cardInstanceId: string, target?: any): Promise<void>;
  useAbility(playerId: string, cardInstanceId: string, abilityIndex: number, target?: any): Promise<void>;
  declareAttack(playerId: string, attackerId: string, targetId?: string): Promise<void>;
  generateEnergy(playerId: string): Promise<void>;
  drawCards(playerId: string, count: number): Promise<void>;
}

const cardInstanceSchema = new Schema<ICardInstance>({
  cardId: {
    type: String,
    required: true
  },
  instanceId: {
    type: String,
    required: true
  },
  location: {
    type: String,
    enum: Object.values(CardLocation),
    required: true
  },
  state: {
    type: String,
    enum: Object.values(CardState),
    default: CardState.READY
  },
  powerSignModifier: {
    type: String,
    enum: Object.values(PowerSign)
  },
  counters: {
    power: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
    custom: { type: Object, default: {} }
  }
});

const playerStateSchema = new Schema<IPlayerState>({
  userId: {
    type: String,
    required: true
  },
  deck: [cardInstanceSchema],
  hand: [cardInstanceSchema],
  field: [cardInstanceSchema],
  graveyard: [cardInstanceSchema],
  banished: [cardInstanceSchema],
  energy: {
    type: Object,
    default: () => Object.values(PowerSign).reduce((acc, sign) => ({ ...acc, [sign]: 0 }), {})
  },
  lifePoints: {
    type: Number,
    default: 30
  },
  questProgress: {
    type: Object,
    default: () => ({})
  }
});

const gameSchema = new Schema<IGameDocument>({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  players: {
    type: Map,
    of: playerStateSchema,
    required: true
  },
  currentPhase: {
    type: String,
    enum: Object.values(GamePhase),
    default: GamePhase.PREPARATION
  },
  currentTurn: {
    type: Number,
    default: 1
  },
  activePlayer: {
    type: String,
    required: true
  },
  turnOrder: [{
    type: String,
    required: true
  }],
  lastAction: {
    type: {
      type: String
    },
    playerId: String,
    timestamp: Number,
    data: Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['WAITING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'WAITING'
  },
  winner: String
}, {
  timestamps: true
});

// Methods
gameSchema.methods.addPlayer = async function(userId: string, deck: string[]): Promise<void> {
  if (this.status !== 'WAITING') {
    throw new Error('Cannot join game in progress');
  }

  if (this.players.size >= 2) {
    throw new Error('Game is full');
  }

  const playerState: IPlayerState = {
    userId,
    deck: deck.map(cardId => ({
      cardId,
      instanceId: `${cardId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      location: CardLocation.DECK,
      state: CardState.READY,
      counters: {
        power: 0,
        defense: 0,
        energy: 0,
        custom: {}
      }
    })),
    hand: [],
    field: [],
    graveyard: [],
    banished: [],
    energy: Object.values(PowerSign).reduce((acc, sign) => ({ ...acc, [sign]: 0 }), {}),
    lifePoints: 30,
    questProgress: {}
  };

  this.players.set(userId, playerState);
  await this.save();
};

gameSchema.methods.startGame = async function(): Promise<void> {
  if (this.players.size !== 2) {
    throw new Error('Need exactly 2 players to start');
  }

  if (this.status !== 'WAITING') {
    throw new Error('Game already started');
  }

  // Randomly determine turn order
  this.turnOrder = Array.from(this.players.keys()).sort(() => Math.random() - 0.5);
  this.activePlayer = this.turnOrder[0];
  this.status = 'IN_PROGRESS';
  this.currentPhase = GamePhase.PREPARATION;

  // Draw initial hands
  for (const [playerId] of this.players) {
    await this.drawCards(playerId, 5);
  }

  await this.save();
};

gameSchema.methods.endTurn = async function(): Promise<void> {
  const currentPlayerIndex = this.turnOrder.indexOf(this.activePlayer);
  const nextPlayerIndex = (currentPlayerIndex + 1) % this.turnOrder.length;
  this.activePlayer = this.turnOrder[nextPlayerIndex];
  this.currentTurn += 1;

  await this.save();
};

gameSchema.methods.playCard = async function(playerId: string, cardInstanceId: string, target?: any): Promise<void> {
  const playerState = this.players.get(playerId) as IPlayerState | undefined;
  if (!playerState) throw new Error('Player not found');

  const cardIndex = playerState.hand.findIndex(card => card.instanceId === cardInstanceId);
  if (cardIndex === -1) throw new Error('Card not in hand');

  const [card] = playerState.hand.splice(cardIndex, 1);
  card.location = CardLocation.FIELD;
  playerState.field.push(card);

  await this.save();
};

gameSchema.methods.useAbility = async function(playerId: string, cardInstanceId: string, abilityIndex: number, target?: any): Promise<void> {
  // Implement ability usage logic
  await this.save();
};

gameSchema.methods.declareAttack = async function(playerId: string, attackerId: string, targetId?: string): Promise<void> {
  // Implement attack declaration logic
  await this.save();
};

gameSchema.methods.generateEnergy = async function(playerId: string): Promise<void> {
  const playerState = this.players.get(playerId) as IPlayerState | undefined;
  if (!playerState) throw new Error('Player not found');

  // Generate energy based on power signs
  playerState.field.forEach((card: ICardInstance) => {
    if (card.powerSignModifier) {
      playerState.energy[card.powerSignModifier] = (playerState.energy[card.powerSignModifier] || 0) + 1;
    }
  });

  await this.save();
};

gameSchema.methods.drawCards = async function(playerId: string, count: number): Promise<void> {
  const playerState = this.players.get(playerId) as IPlayerState | undefined;
  if (!playerState) throw new Error('Player not found');

  const cards = playerState.deck.slice(0, count) as ICardInstance[];
  if (cards.length < count) {
    throw new Error('Not enough cards in deck');
  }

  // Move cards from deck to hand
  playerState.deck.splice(0, count);
  playerState.hand.push(...cards.map((card: ICardInstance) => ({
    ...card,
    location: CardLocation.HAND
  })));

  await this.save();
};

export const Game = model<IGameDocument>('Game', gameSchema);
