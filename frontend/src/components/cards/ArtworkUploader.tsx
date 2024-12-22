import React, { useState } from 'react';
import styled from 'styled-components';
import { CardArtwork, ImagePosition, DEFAULT_IMAGE_POSITION } from '../../types/card';

type ArtworkType = keyof CardArtwork;

interface ArtworkUploaderProps {
  artwork: CardArtwork;
  onArtworkChange: (artwork: CardArtwork) => void;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ArtworkSection = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const PositionControls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Control = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.label`
  font-size: 0.9em;
  color: ${props => props.theme.textColor};
`;

const Input = styled.input`
  padding: 0.25rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${props => props.theme.textColor};
`;

export const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({
  artwork,
  onArtworkChange,
}) => {
  const handleImageUpload = (type: ArtworkType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      onArtworkChange({
        ...artwork,
        [type]: {
          url,
          position: DEFAULT_IMAGE_POSITION,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePositionChange = (type: ArtworkType, field: keyof ImagePosition) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    if (isNaN(value)) return;

    onArtworkChange({
      ...artwork,
      [type]: {
        ...artwork[type],
        position: {
          ...(artwork[type]?.position || DEFAULT_IMAGE_POSITION),
          [field]: value
        }
      }
    });
  };

  const renderPositionControls = (type: ArtworkType) => {
    const position = artwork[type]?.position || DEFAULT_IMAGE_POSITION;
    const fields: Array<{ key: keyof ImagePosition; label: string }> = [
      { key: 'x', label: 'X Position' },
      { key: 'y', label: 'Y Position' },
      { key: 'width', label: 'Width' },
      { key: 'height', label: 'Height' },
      { key: 'scale', label: 'Scale' },
      { key: 'rotation', label: 'Rotation' },
      { key: 'opacity', label: 'Opacity' },
    ];

    return (
      <PositionControls>
        {fields.map(({ key, label }) => (
          <Control key={key}>
            <Label>{label}</Label>
            <Input
              type="number"
              value={position[key] || 0}
              onChange={handlePositionChange(type, key)}
              step={key === 'scale' || key === 'opacity' ? 0.1 : 1}
              min={key === 'scale' || key === 'opacity' ? 0 : undefined}
              max={key === 'opacity' ? 1 : undefined}
            />
          </Control>
        ))}
      </PositionControls>
    );
  };

  const artworkTypes: ArtworkType[] = ['background', 'character', 'powerSignIcon'];

  return (
    <Container>
      {artworkTypes.map(type => {
        const image = artwork[type];
        const label = type.charAt(0).toUpperCase() + type.slice(1);

        return (
          <ArtworkSection key={type}>
            <h4>{label}</h4>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload(type)}
            />
            
            {image?.url && (
              <img
                src={image.url}
                alt={`${label} preview`}
                className="h-16 w-16 object-cover rounded"
              />
            )}

            {renderPositionControls(type)}
          </ArtworkSection>
        );
      })}
    </Container>
  );
};
