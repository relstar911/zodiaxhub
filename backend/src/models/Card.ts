import { Schema, model, Document } from 'mongoose';
import { PowerSign } from '../types';

export interface ICard {
  name: string;
  description: string;
  type: 'character' | 'spell' | 'trap';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  powerSign: PowerSign;
  attack?: number;
  defense?: number;
  energyCost: number;
  limitPerDeck: number;
  effects: Array<{
    type: string;
    value: number;
    target: string;
  }>;
  imageUrl?: string;
  createdBy: Schema.Types.ObjectId;
}

export interface ICardDocument extends Omit<ICard, keyof Document>, Document {}

const effectSchema = new Schema({
  type: {
    type: String,
    required: [true, 'Effect type is required']
  },
  value: {
    type: Number,
    required: [true, 'Effect value is required']
  },
  target: {
    type: String,
    required: [true, 'Effect target is required']
  }
});

const cardSchema = new Schema<ICardDocument>({
  name: {
    type: String,
    required: [true, 'Card name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Card description is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['character', 'spell', 'trap'],
    required: [true, 'Card type is required']
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    required: [true, 'Card rarity is required']
  },
  powerSign: {
    type: String,
    enum: Object.values(PowerSign),
    required: [true, 'Power sign is required']
  },
  attack: {
    type: Number,
    required: [
      function(this: ICard) {
        return this.type === 'character';
      },
      'Attack is required for character cards'
    ]
  },
  defense: {
    type: Number,
    required: [
      function(this: ICard) {
        return this.type === 'character';
      },
      'Defense is required for character cards'
    ]
  },
  energyCost: {
    type: Number,
    required: [true, 'Energy cost is required'],
    min: [0, 'Energy cost cannot be negative']
  },
  limitPerDeck: {
    type: Number,
    enum: [1, 2, 3],
    required: [true, 'Limit per deck is required'],
    default: 3
  },
  effects: [effectSchema],
  imageUrl: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Card must belong to a user']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
cardSchema.index({ name: 1 }, { unique: true });
cardSchema.index({ type: 1 });
cardSchema.index({ rarity: 1 });
cardSchema.index({ powerSign: 1 });
cardSchema.index({ createdBy: 1 });

export const Card = model<ICardDocument>('Card', cardSchema);
