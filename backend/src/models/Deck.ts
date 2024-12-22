import { Schema, model, Document } from 'mongoose';
import { PowerSign } from '../types';

export interface IDeck {
  name: string;
  description?: string;
  createdBy: Schema.Types.ObjectId;
  cards: Array<{
    cardId: Schema.Types.ObjectId;
    quantity: number;
  }>;
  powerSignFocus: PowerSign[];
  isPublic: boolean;
  totalCards: number;
}

export interface IDeckDocument extends Omit<IDeck, keyof Document>, Document {
  calculateTotalCards(): number;
}

const deckSchema = new Schema<IDeckDocument>({
  name: {
    type: String,
    required: [true, 'Deck name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Deck must belong to a user']
  },
  cards: [{
    cardId: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
      required: [true, 'Card reference is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Card quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [3, 'Maximum 3 copies of a card allowed']
    }
  }],
  powerSignFocus: [{
    type: String,
    enum: Object.values(PowerSign),
    required: [true, 'Power sign focus is required']
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  totalCards: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Methods
deckSchema.methods.calculateTotalCards = function() {
  return this.cards.reduce((total: number, card: { quantity: number }) => total + card.quantity, 0);
};

// Middleware
deckSchema.pre('save', function(next) {
  this.totalCards = this.calculateTotalCards();
  next();
});

// Validate deck size
deckSchema.pre('save', function(next) {
  const totalCards = this.calculateTotalCards();
  if (totalCards < 40 || totalCards > 60) {
    next(new Error('Deck must contain between 40 and 60 cards'));
  }
  next();
});

// Indexes
deckSchema.index({ name: 1, createdBy: 1 }, { unique: true });
deckSchema.index({ createdBy: 1 });
deckSchema.index({ isPublic: 1 });
deckSchema.index({ powerSignFocus: 1 });

export const Deck = model<IDeckDocument>('Deck', deckSchema);
