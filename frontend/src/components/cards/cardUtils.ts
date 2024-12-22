import { CardType, PowerSign } from '../../types/card';

export const getCardTypeColor = (type: CardType): string => {
  switch (type) {
    case 'character':
      return '#9c27b0'; // Purple for character cards
    case 'spell':
      return '#2196f3'; // Blue for spell cards
    case 'trap':
      return '#f44336'; // Red for trap cards
    default:
      return '#000000';
  }
};

export const calculatePowerSignSynergy = (sign1: PowerSign, sign2: PowerSign): number => {
  // Define synergy pairs and their values
  const synergyPairs: Record<string, number> = {
    "Warrior's Might_Dragon's Fury": 0.8,
    "Scholar's Mind_Mystic's Aura": 0.9,
    "Time's Flow_Cosmic's Infinity": 0.8,
    "Nature's Growth_Light's Radiance": 0.7,
    "Shadow's Embrace_Seers Vision": 0.9,
    "Phoenix's Rebirth_Alchemist's Transmutation": 0.8,
  };

  // Create a key for both possible orders
  const key1 = `${sign1}_${sign2}`;
  const key2 = `${sign2}_${sign1}`;

  // Return the synergy value if it exists, otherwise return a base value
  return synergyPairs[key1] || synergyPairs[key2] || 0.5;
};

// Power sign relationships
export const POWER_SIGNS: PowerSign[] = [
  "Warrior's Might",
  "Scholar's Mind",
  "Time's Flow",
  "Nature's Growth",
  "Light's Radiance",
  "Shadow's Embrace",
  "Dragon's Fury",
  "Phoenix's Rebirth",
  "Mystic's Aura",
  "Alchemist's Transmutation",
  "Cosmic's Infinity",
  "Seers Vision"
];

export const POWER_SIGN_DESCRIPTIONS: Record<PowerSign, string> = {
  "Warrior's Might": "Enhances physical combat abilities and strength",
  "Scholar's Mind": "Boosts strategic thinking and knowledge-based abilities",
  "Time's Flow": "Manipulates the flow of time and action sequences",
  "Nature's Growth": "Controls natural elements and growth processes",
  "Light's Radiance": "Channels divine energy and healing powers",
  "Shadow's Embrace": "Harnesses dark energy and stealth abilities",
  "Dragon's Fury": "Unleashes primal power and devastating attacks",
  "Phoenix's Rebirth": "Enables resurrection and transformation abilities",
  "Mystic's Aura": "Amplifies magical abilities and spiritual connection",
  "Alchemist's Transmutation": "Enables matter manipulation and transformation",
  "Cosmic's Infinity": "Controls space and dimensional powers",
  "Seers Vision": "Grants foresight and prophetic abilities"
};
