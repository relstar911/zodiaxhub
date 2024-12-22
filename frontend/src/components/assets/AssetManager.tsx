import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ImagePosition, DEFAULT_IMAGE_POSITION } from '../../types/card';

export interface CardAsset {
  url: string;
  position: ImagePosition;
}

interface AssetManagerProps {
  background?: CardAsset;
  character?: CardAsset;
  powerSignIcon?: CardAsset;
  onAssetChange: (type: 'background' | 'character' | 'powerSignIcon', asset: CardAsset) => void;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const AssetSection = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const Preview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin: 0.5rem 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${props => props.theme.textColor};
`;

export const AssetManager: React.FC<AssetManagerProps> = ({
  background,
  character,
  powerSignIcon,
  onAssetChange,
}) => {
  const handleFileUpload = useCallback(
    (type: 'background' | 'character' | 'powerSignIcon') => async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        onAssetChange(type, {
          url,
          position: DEFAULT_IMAGE_POSITION,
        });
      };
      reader.readAsDataURL(file);
    },
    [onAssetChange]
  );

  const renderAssetSection = (
    label: string,
    type: 'background' | 'character' | 'powerSignIcon',
    asset?: CardAsset
  ) => (
    <AssetSection key={type}>
      <h4>{label}</h4>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileUpload(type)}
      />
      {asset?.url && (
        <Preview src={asset.url} alt={label} />
      )}
    </AssetSection>
  );

  return (
    <Container>
      {renderAssetSection('Background', 'background', background)}
      {renderAssetSection('Character', 'character', character)}
      {renderAssetSection('Power Sign Icon', 'powerSignIcon', powerSignIcon)}
    </Container>
  );
};
