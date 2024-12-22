import { PowerSign, CardType, CardData } from '../types/card';

interface PowerSignInfo {
  powerSign: PowerSign;
  complementary: PowerSign;
  antagonists: PowerSign[];
  description: string;
  energyGeneration: string;
}

export const POWER_SIGNS: Record<PowerSign, PowerSignInfo> = {
  "Warrior's Might": {
    powerSign: "Warrior's Might",
    complementary: "Dragon's Fury",
    antagonists: ["Scholar's Mind", "Nature's Growth"],
    description: "Enhances combat abilities",
    energyGeneration: "+1 Energy when attacking"
  },
  "Scholar's Mind": {
    powerSign: "Scholar's Mind",
    complementary: "Seers Vision",
    antagonists: ["Warrior's Might", "Time's Flow"],
    description: "Accumulates and applies knowledge",
    energyGeneration: "+1 Energy when playing multiple cards in a turn"
  },
  "Time's Flow": {
    powerSign: "Time's Flow",
    complementary: "Phoenix's Rebirth",
    antagonists: ["Scholar's Mind", "Shadow's Embrace"],
    description: "Manipulates time and sequence",
    energyGeneration: "+1 Energy at the start of each turn"
  },
  "Nature's Growth": {
    powerSign: "Nature's Growth",
    complementary: "Light's Radiance",
    antagonists: ["Warrior's Might", "Dragon's Fury"],
    description: "Harnesses natural energy",
    energyGeneration: "+1 Energy when healing"
  },
  "Light's Radiance": {
    powerSign: "Light's Radiance",
    complementary: "Nature's Growth",
    antagonists: ["Shadow's Embrace", "Cosmic's Infinity"],
    description: "Channels divine power",
    energyGeneration: "+1 Energy when buffing allies"
  },
  "Shadow's Embrace": {
    powerSign: "Shadow's Embrace",
    complementary: "Dragon's Fury",
    antagonists: ["Light's Radiance", "Time's Flow"],
    description: "Harnesses dark energy",
    energyGeneration: "+1 Energy when debuffing enemies"
  },
  "Dragon's Fury": {
    powerSign: "Dragon's Fury",
    complementary: "Warrior's Might",
    antagonists: ["Nature's Growth", "Mystic's Aura"],
    description: "Unleashes raw power",
    energyGeneration: "+1 Energy when dealing damage"
  },
  "Phoenix's Rebirth": {
    powerSign: "Phoenix's Rebirth",
    complementary: "Time's Flow",
    antagonists: ["Alchemist's Transmutation", "Cosmic's Infinity"],
    description: "Cycles of renewal",
    energyGeneration: "+1 Energy when reviving units"
  },
  "Mystic's Aura": {
    powerSign: "Mystic's Aura",
    complementary: "Alchemist's Transmutation",
    antagonists: ["Dragon's Fury", "Seers Vision"],
    description: "Mystical enhancement",
    energyGeneration: "+1 Energy when casting spells"
  },
  "Alchemist's Transmutation": {
    powerSign: "Alchemist's Transmutation",
    complementary: "Mystic's Aura",
    antagonists: ["Phoenix's Rebirth", "Cosmic's Infinity"],
    description: "Transforms resources",
    energyGeneration: "+1 Energy when transforming cards"
  },
  "Cosmic's Infinity": {
    powerSign: "Cosmic's Infinity",
    complementary: "Seers Vision",
    antagonists: ["Light's Radiance", "Alchemist's Transmutation"],
    description: "Infinite possibilities",
    energyGeneration: "+1 Energy when drawing cards"
  },
  "Seers Vision": {
    powerSign: "Seers Vision",
    complementary: "Scholar's Mind",
    antagonists: ["Mystic's Aura", "Phoenix's Rebirth"],
    description: "Future sight",
    energyGeneration: "+1 Energy when scrying"
  }
};

export const powerSignRelationships: Record<PowerSign, { strongAgainst: PowerSign[]; weakAgainst: PowerSign[] }> = {
  "Warrior's Might": {
    strongAgainst: ["Scholar's Mind", "Time's Flow"],
    weakAgainst: ["Nature's Growth", "Light's Radiance"]
  },
  "Scholar's Mind": {
    strongAgainst: ["Time's Flow", "Nature's Growth"],
    weakAgainst: ["Shadow's Embrace", "Dragon's Fury"]
  },
  "Time's Flow": {
    strongAgainst: ["Nature's Growth", "Light's Radiance"],
    weakAgainst: ["Phoenix's Rebirth", "Mystic's Aura"]
  },
  "Nature's Growth": {
    strongAgainst: ["Light's Radiance", "Shadow's Embrace"],
    weakAgainst: ["Alchemist's Transmutation", "Cosmic's Infinity"]
  },
  "Light's Radiance": {
    strongAgainst: ["Shadow's Embrace", "Dragon's Fury"],
    weakAgainst: ["Seers Vision", "Warrior's Might"]
  },
  "Shadow's Embrace": {
    strongAgainst: ["Dragon's Fury", "Phoenix's Rebirth"],
    weakAgainst: ["Mystic's Aura", "Scholar's Mind"]
  },
  "Dragon's Fury": {
    strongAgainst: ["Phoenix's Rebirth", "Mystic's Aura"],
    weakAgainst: ["Time's Flow", "Nature's Growth"]
  },
  "Phoenix's Rebirth": {
    strongAgainst: ["Mystic's Aura", "Alchemist's Transmutation"],
    weakAgainst: ["Light's Radiance", "Shadow's Embrace"]
  },
  "Mystic's Aura": {
    strongAgainst: ["Alchemist's Transmutation", "Cosmic's Infinity"],
    weakAgainst: ["Dragon's Fury", "Phoenix's Rebirth"]
  },
  "Alchemist's Transmutation": {
    strongAgainst: ["Cosmic's Infinity", "Seers Vision"],
    weakAgainst: ["Warrior's Might", "Scholar's Mind"]
  },
  "Cosmic's Infinity": {
    strongAgainst: ["Seers Vision", "Warrior's Might"],
    weakAgainst: ["Time's Flow", "Nature's Growth"]
  },
  "Seers Vision": {
    strongAgainst: ["Warrior's Might", "Scholar's Mind"],
    weakAgainst: ["Light's Radiance", "Shadow's Embrace"]
  }
};

export const getRelatedPowerSigns = (powerSign: PowerSign) => {
  const info = POWER_SIGNS[powerSign];
  return {
    complementary: info.complementary,
    antagonists: info.antagonists
  };
};

export const calculatePowerSignSynergy = (sign1: PowerSign, sign2: PowerSign): 'complementary' | 'antagonist' | 'neutral' => {
  const info = POWER_SIGNS[sign1];
  if (info.complementary === sign2) return 'complementary';
  if (info.antagonists.includes(sign2)) return 'antagonist';
  return 'neutral';
};

export const getEnergyGeneration = (powerSign: PowerSign): string => {
  return POWER_SIGNS[powerSign].energyGeneration;
};

export const validateDeck = (
  cards: CardData[],
  minSize = 60,
  maxSize = 100
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check deck size
  if (cards.length < minSize) {
    errors.push(`Deck must contain at least ${minSize} cards (currently has ${cards.length})`);
  }
  if (cards.length > maxSize) {
    errors.push(`Deck cannot contain more than ${maxSize} cards (currently has ${cards.length})`);
  }

  // Check power sign balance
  const powerSignCounts: Record<PowerSign, number> = {} as Record<PowerSign, number>;
  cards.forEach(card => {
    powerSignCounts[card.powerSign] = (powerSignCounts[card.powerSign] || 0) + 1;
  });

  const totalCards = cards.length;
  Object.entries(powerSignCounts).forEach(([sign, count]) => {
    const percentage = (count / totalCards) * 100;
    if (percentage > 40) {
      errors.push(`Too many ${sign} cards (${count} cards, ${percentage.toFixed(1)}% of deck)`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};
