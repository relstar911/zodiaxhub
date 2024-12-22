// Card Types
export enum CardType {
  COMPAN = 'COMPAN',
  COMPAGNON = 'COMPAGNON',
  SYNERGIE = 'SYNERGIE',
  AKTION = 'AKTION',
  AUSRUSTUNG = 'AUSRUSTUNG',
  UMWELT = 'UMWELT'
}

// Power Signs (Machtzeichen)
export enum PowerSign {
  GUARDIANS_FORCE = 'GUARDIANS_FORCE',
  HEALERS_TOUCH = 'HEALERS_TOUCH',
  WARRIORS_MIGHT = 'WARRIORS_MIGHT',
  SCHOLARS_MIND = 'SCHOLARS_MIND',
  SEERS_VISION = 'SEERS_VISION',
  ALCHEMISTS_TRANSMUTATION = 'ALCHEMISTS_TRANSMUTATION',
  SHADOWS_EMBRACE = 'SHADOWS_EMBRACE',
  ELEMENTALS_FURY = 'ELEMENTALS_FURY',
  BEASTMASTERS_COMMAND = 'BEASTMASTERS_COMMAND',
  MYSTICS_AURA = 'MYSTICS_AURA',
  TIMEKEEPERS_CHRONOLOGY = 'TIMEKEEPERS_CHRONOLOGY',
  ARTIFICERS_CREATION = 'ARTIFICERS_CREATION',
  NEUTRAL = 'NEUTRAL'
}

// Card Rarity
export enum CardRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  LEGENDARY = 'LEGENDARY'
}

// Interfaces
export interface IAbility {
  name: string;
  description: string;
  energyCost: number;
  effects: string[];
}

export interface ICard {
  id: string;
  name: string;
  type: CardType;
  powerSign: PowerSign;
  rarity: CardRarity;
  energyCost: number;
  limitPerDeck: 1 | 3;
  attributes: {
    atk?: number;
    def?: number;
  };
  abilities: IAbility[];
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeck {
  id: string;
  name: string;
  description: string;
  cards: Array<{
    cardId: string;
    quantity: number;
  }>;
  powerSignFocus: PowerSign[];
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPowerSignRelationship {
  powerSign: PowerSign;
  complementary: PowerSign;
  antagonists: PowerSign[];
  energyGeneration: string;
  description: string;
}
