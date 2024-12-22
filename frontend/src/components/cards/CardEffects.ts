import { PowerSign } from '../../types/card';

export interface CardEffect {
  id: string;
  type: 'glow' | 'particles' | 'animation';
  duration?: number;
  intensity?: number;
  color?: string;
  powerSign?: PowerSign;
}

export const getEffectColor = (powerSign: PowerSign): string => {
  const colors: Record<PowerSign, string> = {
    "Warrior's Might": '#ff4444',
    "Dragon's Fury": '#ff8800',
    "Scholar's Mind": '#2196f3',
    "Mystic's Aura": '#9c27b0',
    "Time's Flow": '#00bcd4',
    "Cosmic's Infinity": '#3f51b5',
    "Nature's Growth": '#4caf50',
    "Light's Radiance": '#ffeb3b',
    "Shadow's Embrace": '#607d8b',
    "Seers Vision": '#e91e63',
    "Phoenix's Rebirth": '#ff5722',
    "Alchemist's Transmutation": '#795548'
  };

  return colors[powerSign] || '#ffffff';
};

export const createGlowEffect = (powerSign: PowerSign): CardEffect => ({
  id: `glow-${Math.random().toString(36).substr(2, 9)}`,
  type: 'glow',
  intensity: 0.5,
  color: getEffectColor(powerSign),
  powerSign
});

export const createParticleEffect = (powerSign: PowerSign): CardEffect => ({
  id: `particles-${Math.random().toString(36).substr(2, 9)}`,
  type: 'particles',
  duration: 2000,
  intensity: 0.7,
  color: getEffectColor(powerSign),
  powerSign
});

export const createAnimationEffect = (powerSign: PowerSign): CardEffect => ({
  id: `animation-${Math.random().toString(36).substr(2, 9)}`,
  type: 'animation',
  duration: 1500,
  intensity: 0.6,
  color: getEffectColor(powerSign),
  powerSign
});
