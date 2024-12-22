import { CardStyleType, CardRarity } from '../../types/card';

export const CARD_STYLES: Record<CardStyleType, string> = {
  standard: 'standard',
  fullArt: 'fullArt',
  holo: 'holo',
  vintage: 'vintage',
  modern: 'modern'
};

export const RARITY_STYLES: Record<CardRarity, string> = {
  common: 'linear-gradient(45deg, #808080, #404040)',
  rare: 'linear-gradient(45deg, #0000FF, #000080)',
  epic: 'linear-gradient(45deg, #9400D3, #4B0082)',
  legendary: 'linear-gradient(45deg, #FFD700, #FFA500)'
};

export interface CardFrameConfig {
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export const getCardFrameConfig = (rarity: CardRarity, style: CardStyleType): CardFrameConfig => {
  const baseConfig: CardFrameConfig = {
    borderColor: '#000000',
    backgroundColor: '#2a2a2a',
    textColor: '#ffffff',
    accentColor: '#4a90e2'
  };

  // Apply rarity-specific styles
  switch (rarity) {
    case 'legendary':
      baseConfig.borderColor = '#FFD700';
      baseConfig.accentColor = '#FFA500';
      break;
    case 'epic':
      baseConfig.borderColor = '#9400D3';
      baseConfig.accentColor = '#4B0082';
      break;
    case 'rare':
      baseConfig.borderColor = '#0000FF';
      baseConfig.accentColor = '#000080';
      break;
    default:
      break;
  }

  // Apply style-specific modifications
  switch (style) {
    case 'fullArt':
      baseConfig.backgroundColor = 'transparent';
      break;
    case 'holo':
      baseConfig.borderColor = `linear-gradient(45deg, ${baseConfig.borderColor}, ${baseConfig.accentColor})`;
      break;
    case 'vintage':
      baseConfig.backgroundColor = '#d4c4a8';
      baseConfig.textColor = '#4a3c28';
      break;
    case 'modern':
      baseConfig.backgroundColor = '#1a1a1a';
      baseConfig.borderColor = '#333333';
      break;
    default:
      break;
  }

  return baseConfig;
};
