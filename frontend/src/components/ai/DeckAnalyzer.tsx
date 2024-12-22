import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  CardData,
  POWER_SIGNS,
  PowerSign,
  isCharacterCard
} from '../../types/card';

interface DeckStats {
  totalCards: number;
  characterCount: number;
  spellCount: number;
  trapCount: number;
  averageEnergyCost: number;
  averageAttack: number;
  averageDefense: number;
  powerSignDistribution: Record<PowerSign, number>;
}

interface DeckAnalyzerProps {
  cards: CardData[];
}

const Container = styled.div`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
`;

const PowerSigns = styled.div`
  margin-top: 1rem;
`;

const PowerSignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const PowerSignItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

export const DeckAnalyzer: React.FC<DeckAnalyzerProps> = ({ cards }) => {
  const [stats, setStats] = useState<DeckStats | null>(null);

  useEffect(() => {
    const initialStats: DeckStats = {
      totalCards: 0,
      characterCount: 0,
      spellCount: 0,
      trapCount: 0,
      averageEnergyCost: 0,
      averageAttack: 0,
      averageDefense: 0,
      powerSignDistribution: POWER_SIGNS.reduce(
        (acc, sign) => ({ ...acc, [sign]: 0 }),
        {} as Record<PowerSign, number>
      ),
    };

    const calculatedStats = cards.reduce((stats, card) => {
      stats.totalCards++;
      stats.averageEnergyCost += card.energyCost;

      switch (card.type) {
        case 'character':
          stats.characterCount++;
          if (isCharacterCard(card)) {
            stats.averageAttack += card.attack;
            stats.averageDefense += card.defense;
          }
          break;
        case 'spell':
          stats.spellCount++;
          break;
        case 'trap':
          stats.trapCount++;
          break;
      }

      stats.powerSignDistribution[card.powerSign]++;
      return stats;
    }, initialStats);

    if (calculatedStats.characterCount > 0) {
      calculatedStats.averageAttack /= calculatedStats.characterCount;
      calculatedStats.averageDefense /= calculatedStats.characterCount;
    }

    if (calculatedStats.totalCards > 0) {
      calculatedStats.averageEnergyCost /= calculatedStats.totalCards;
    }

    setStats(calculatedStats);
  }, [cards]);

  if (!stats) return null;

  return (
    <Container>
      <h3>Deck Analysis</h3>
      
      <StatsGrid>
        <StatItem>
          <label>Total Cards:</label>
          <span>{stats.totalCards}</span>
        </StatItem>
        
        <StatItem>
          <label>Characters:</label>
          <span>{stats.characterCount}</span>
        </StatItem>
        
        <StatItem>
          <label>Spells:</label>
          <span>{stats.spellCount}</span>
        </StatItem>
        
        <StatItem>
          <label>Traps:</label>
          <span>{stats.trapCount}</span>
        </StatItem>
        
        <StatItem>
          <label>Avg Energy Cost:</label>
          <span>{stats.averageEnergyCost.toFixed(1)}</span>
        </StatItem>
        
        {stats.characterCount > 0 && (
          <>
            <StatItem>
              <label>Avg Attack:</label>
              <span>{stats.averageAttack.toFixed(1)}</span>
            </StatItem>
            
            <StatItem>
              <label>Avg Defense:</label>
              <span>{stats.averageDefense.toFixed(1)}</span>
            </StatItem>
          </>
        )}
      </StatsGrid>

      <PowerSigns>
        <h4>Power Sign Distribution</h4>
        <PowerSignsGrid>
          {POWER_SIGNS.map(sign => (
            <PowerSignItem key={sign}>
              <label>{sign}:</label>
              <span>{stats.powerSignDistribution[sign]}</span>
            </PowerSignItem>
          ))}
        </PowerSignsGrid>
      </PowerSigns>
    </Container>
  );
};
