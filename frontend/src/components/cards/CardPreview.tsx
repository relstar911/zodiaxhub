import React from 'react';
import { CardData, isCharacterCard } from '../../types/card';
import {
  CardContainer,
  CardHeader,
  CardName,
  EnergyCost,
  CardImage,
  CardInfo,
  PowerSign,
  Description,
  Stats,
  StatItem,
  StatLabel,
  StatValue
} from './styles/CardStyles';

interface CardPreviewProps {
  card: CardData;
  scale?: number;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  scale = 1,
  onClick,
  selected,
  disabled
}) => {
  return (
    <CardContainer
      scale={scale}
      onClick={disabled ? undefined : onClick}
      style={{
        opacity: disabled ? 0.6 : 1,
        transform: selected ? 'scale(1.05)' : 'none',
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default'
      }}
    >
      <CardHeader>
        <CardName>{card.name}</CardName>
        <EnergyCost>{card.energyCost}</EnergyCost>
      </CardHeader>

      <CardImage url={card.artwork?.character?.url} />

      <CardInfo>
        <PowerSign>
          {card.artwork?.powerSignIcon?.url && (
            <img 
              src={card.artwork.powerSignIcon.url} 
              alt={card.powerSign} 
              width={20} 
              height={20} 
            />
          )}
          <span>{card.powerSign}</span>
        </PowerSign>

        <Description>{card.description}</Description>

        {isCharacterCard(card) && (
          <Stats>
            <StatItem>
              <StatLabel>ATK</StatLabel>
              <StatValue>{card.attack}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>DEF</StatLabel>
              <StatValue>{card.defense}</StatValue>
            </StatItem>
          </Stats>
        )}
      </CardInfo>
    </CardContainer>
  );
};

export default CardPreview;
