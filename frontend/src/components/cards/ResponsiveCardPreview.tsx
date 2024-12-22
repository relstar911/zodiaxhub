import React from 'react';
import styled from 'styled-components';
import { CardData } from '../../types/card';
import CardPreview from './CardPreview';

interface ResponsiveCardPreviewProps {
  card: CardData;
  $maxWidth?: number;
  $maxHeight?: number;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

const Container = styled.div<{ $maxWidth?: number; $maxHeight?: number }>`
  width: 100%;
  height: 100%;
  max-width: ${props => props.$maxWidth ? `${props.$maxWidth}px` : 'none'};
  max-height: ${props => props.$maxHeight ? `${props.$maxHeight}px` : 'none'};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResponsiveCardPreview: React.FC<ResponsiveCardPreviewProps> = ({
  card,
  $maxWidth = 300,
  $maxHeight = 420,
  onClick,
  selected,
  disabled
}) => {
  const calculateScale = () => {
    const cardAspectRatio = 420 / 300; // height / width
    const containerAspectRatio = $maxHeight / $maxWidth;

    if (containerAspectRatio > cardAspectRatio) {
      return $maxWidth / 300;
    } else {
      return $maxHeight / 420;
    }
  };

  return (
    <Container $maxWidth={$maxWidth} $maxHeight={$maxHeight}>
      <CardPreview
        card={card}
        scale={calculateScale()}
        onClick={onClick}
        selected={selected}
        disabled={disabled}
      />
    </Container>
  );
};

export default ResponsiveCardPreview;
