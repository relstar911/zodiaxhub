import styled from 'styled-components';
import { CardRarity } from '../../../types/card';

// Base card container
export const CardContainer = styled.div<{ scale?: number }>`
  width: ${props => 300 * (props.scale || 1)}px;
  height: ${props => 420 * (props.scale || 1)}px;
  border-radius: 15px;
  position: relative;
  background: #2a2a2a;
  color: white;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

// Card header
export const CardHeader = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardName = styled.h3`
  margin: 0;
  font-size: 1.2em;
  font-weight: bold;
`;

export const EnergyCost = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

// Card image
export const CardImage = styled.div<{ url?: string }>`
  width: 100%;
  height: 200px;
  background-image: ${props => props.url ? `url(${props.url})` : 'none'};
  background-size: cover;
  background-position: center;
`;

// Card info
export const CardInfo = styled.div`
  padding: 10px;
`;

export const PowerSign = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
`;

export const Description = styled.p`
  font-size: 0.9em;
  margin: 10px 0;
  color: #ccc;
`;

// Stats
export const Stats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatLabel = styled.div`
  font-size: 0.8em;
  color: #999;
`;

export const StatValue = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #4a90e2;
`;

// Rarity styles
export const getRarityStyle = (rarity: CardRarity) => {
  switch (rarity) {
    case 'legendary':
      return 'linear-gradient(45deg, #FFD700, #FFA500)';
    case 'epic':
      return 'linear-gradient(45deg, #9400D3, #4B0082)';
    case 'rare':
      return 'linear-gradient(45deg, #0000FF, #000080)';
    default:
      return 'linear-gradient(45deg, #808080, #404040)';
  }
};
