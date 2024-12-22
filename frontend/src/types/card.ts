// Card Types
export type CardType = 'character' | 'spell' | 'item' | 'location' | 'trap';

// Power Signs
export type PowerSign =
  | "Warrior's Might"
  | "Dragon's Fury"
  | "Scholar's Mind"
  | "Mystic's Aura"
  | "Time's Flow"
  | "Cosmic's Infinity"
  | "Nature's Growth"
  | "Light's Radiance"
  | "Shadow's Embrace"
  | "Seers Vision"
  | "Phoenix's Rebirth"
  | "Alchemist's Transmutation";

export const POWER_SIGNS: PowerSign[] = [
  "Warrior's Might",
  "Dragon's Fury",
  "Scholar's Mind",
  "Mystic's Aura",
  "Time's Flow",
  "Cosmic's Infinity",
  "Nature's Growth",
  "Light's Radiance",
  "Shadow's Embrace",
  "Seers Vision",
  "Phoenix's Rebirth",
  "Alchemist's Transmutation"
];

// Card Styles
export type CardStyleType = 'standard' | 'fullArt' | 'holo' | 'vintage' | 'modern';
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

// Image and Layout Types
export interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  opacity: number;
}

export interface TextPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface TextStyle {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  textShadow?: string;
}

export interface CardLayout {
  style: {
    background: string;
    color: string;
    headerBackground: string;
    descriptionBackground: string;
  };
  frame: {
    borderColor: string;
    borderWidth: string;
    borderStyle: string;
    borderRadius: string;
    boxShadow: string;
  };
}

export interface CardArtwork {
  background?: {
    url: string;
    position: ImagePosition;
  };
  character?: {
    url: string;
    position: ImagePosition;
  };
  powerSignIcon?: {
    url: string;
    position: ImagePosition;
  };
}

export interface BaseEffect {
  type: 'glow' | 'particles' | 'animation' | 'shine' | 'sparkle' | 'holographic' | 'aged';
  color?: string;
  opacity?: number;
}

export interface GlowEffect extends BaseEffect {
  type: 'glow';
  radius: number;
}

export interface ShineEffect extends BaseEffect {
  type: 'shine';
  angle: number;
}

export interface SparkleEffect extends BaseEffect {
  type: 'sparkle';
  density: number;
  size: number;
}

export interface HolographicEffect extends BaseEffect {
  type: 'holographic';
}

export interface AgedEffect extends BaseEffect {
  type: 'aged';
  wear: number;
  patina: number;
}

export type CardEffect = GlowEffect | ShineEffect | SparkleEffect | HolographicEffect | AgedEffect;

// Base card interface that all card types extend
export interface BaseCardData {
  id?: string;
  name: string;
  type: CardType;
  description: string;
  powerSign: PowerSign;
  cardStyle: CardStyleType;
  rarity: CardRarity;
  energyCost: number;
  limitPerDeck: number;
  artwork?: CardArtwork;
  effects?: CardEffect[];
}

// Specific card type interfaces
export interface CharacterCardData extends BaseCardData {
  type: 'character';
  attack: number;
  defense: number;
  abilities: string[];
}

export interface SpellCardData extends BaseCardData {
  type: 'spell';
  manaCost: number;
  effect: string;
}

export interface ItemCardData extends BaseCardData {
  type: 'item';
  cost: number;
  durability: number;
}

export interface LocationCardData extends BaseCardData {
  type: 'location';
  influence: number;
  controlPoints: number;
}

export interface TrapCardData extends BaseCardData {
  type: 'trap';
}

// Union type for all card types
export type CardData = CharacterCardData | SpellCardData | ItemCardData | LocationCardData | TrapCardData;

// Type guards
export const isCharacterCard = (card: CardData): card is CharacterCardData => {
  return card.type === 'character';
};

export const isSpellCard = (card: CardData): card is SpellCardData => {
  return card.type === 'spell';
};

export const isItemCard = (card: CardData): card is ItemCardData => {
  return card.type === 'item';
};

export const isLocationCard = (card: CardData): card is LocationCardData => {
  return card.type === 'location';
};

export const isTrapCard = (card: CardData): card is TrapCardData => {
  return card.type === 'trap';
};

// Default values
export const DEFAULT_IMAGE_POSITION: ImagePosition = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  scale: 1,
  rotation: 0,
  opacity: 1
};

export const DEFAULT_TEXT_POSITION: TextPosition = {
  x: 0,
  y: 0,
  width: 100,
  height: 20,
  fontSize: 14,
  lineHeight: 1.5,
  textAlign: 'left'
};

export const DEFAULT_TEXT_STYLE: TextStyle = {
  color: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  fontSize: 14,
  fontWeight: 'normal',
  textAlign: 'left',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
};

export const DEFAULT_CARD_ARTWORK: CardArtwork = {
  background: {
    url: '',
    position: DEFAULT_IMAGE_POSITION
  },
  character: {
    url: '',
    position: DEFAULT_IMAGE_POSITION
  },
  powerSignIcon: {
    url: '',
    position: DEFAULT_IMAGE_POSITION
  }
};

export const DEFAULT_CARD_DATA: BaseCardData = {
  name: '',
  type: 'character',
  description: '',
  powerSign: "Warrior's Might",
  cardStyle: 'standard',
  rarity: 'common',
  energyCost: 0,
  limitPerDeck: 3,
  artwork: {
    background: {
      url: '',
      position: DEFAULT_IMAGE_POSITION
    },
    character: {
      url: '',
      position: DEFAULT_IMAGE_POSITION
    },
    powerSignIcon: {
      url: '',
      position: DEFAULT_IMAGE_POSITION
    }
  },
  effects: []
};
