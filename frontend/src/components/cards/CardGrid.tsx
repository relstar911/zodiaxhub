import React from 'react';
import styled from 'styled-components';
import { CardData } from '../../types/card';
import CardPreview from './CardPreview';

interface CardGridProps {
  cards: CardData[];
  onCardClick?: (card: CardData) => void;
  selectedCard?: CardData;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardClick,
  selectedCard
}) => {
  return (
    <Grid>
      {cards.map((card, index) => (
        <CardPreview
          key={card.id || index}
          card={card}
          onClick={() => onCardClick?.(card)}
          selected={selectedCard?.id === card.id}
          scale={0.7}
        />
      ))}
    </Grid>
  );
};

export default CardGrid;
