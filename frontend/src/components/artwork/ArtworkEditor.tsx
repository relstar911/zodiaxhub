import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { CardArtwork, ImagePosition } from '../../types/card';
import ArtworkService from '../../services/artworkService';

interface ArtworkEditorProps {
  artwork: CardArtwork;
  onChange: (artwork: CardArtwork) => void;
}

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
  background: #1a1a1a;
  border-radius: 8px;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: #2a2a2a;
  border-radius: 4px;
  overflow: hidden;
`;

const DraggableImage = styled.img<{ $position: ImagePosition }>`
  position: absolute;
  left: ${props => props.$position.x}px;
  top: ${props => props.$position.y}px;
  width: ${props => props.$position.width}px;
  height: ${props => props.$position.height}px;
  transform: rotate(${props => props.$position.rotation}deg) scale(${props => props.$position.scale});
  opacity: ${props => props.$position.opacity};
  cursor: move;
  user-select: none;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 4px;
`;

const ArtworkEditor: React.FC<ArtworkEditorProps> = ({ artwork, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{
    type: 'background' | 'character' | 'powerSignIcon';
    startX: number;
    startY: number;
    initialPosition: ImagePosition;
  } | null>(null);

  const handleDragStart = useCallback((
    e: React.MouseEvent,
    type: 'background' | 'character' | 'powerSignIcon',
    position: ImagePosition
  ) => {
    e.preventDefault();
    setDragging({
      type,
      startX: e.clientX,
      startY: e.clientY,
      initialPosition: { ...position }
    });
  }, []);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragging || !containerRef.current) return;

    const dx = e.clientX - dragging.startX;
    const dy = e.clientY - dragging.startY;
    const rect = containerRef.current.getBoundingClientRect();

    const newPosition: ImagePosition = {
      ...dragging.initialPosition,
      x: Math.max(0, Math.min(rect.width - dragging.initialPosition.width, dragging.initialPosition.x + dx)),
      y: Math.max(0, Math.min(rect.height - dragging.initialPosition.height, dragging.initialPosition.y + dy))
    };

    const updatedArtwork = { ...artwork };
    if (dragging.type === 'background' && updatedArtwork.background) {
      updatedArtwork.background.position = newPosition;
    } else if (dragging.type === 'character' && updatedArtwork.character) {
      updatedArtwork.character.position = newPosition;
    } else if (dragging.type === 'powerSignIcon' && updatedArtwork.powerSignIcon) {
      updatedArtwork.powerSignIcon.position = newPosition;
    }

    onChange(updatedArtwork);
  }, [dragging, artwork, onChange]);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  const handleImageUpload = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'background' | 'character' | 'powerSignIcon'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !containerRef.current) return;

    try {
      const response = await ArtworkService.getInstance().uploadImage(file);
      const rect = containerRef.current.getBoundingClientRect();
      const position = ArtworkService.getInstance().calculateDefaultPosition(
        response.width,
        response.height,
        rect.width,
        rect.height
      );

      const updatedArtwork = { ...artwork };
      if (type === 'background') {
        updatedArtwork.background = { url: response.url, position };
      } else if (type === 'character') {
        updatedArtwork.character = { url: response.url, position };
      } else if (type === 'powerSignIcon') {
        updatedArtwork.powerSignIcon = { url: response.url, position };
      }

      onChange(updatedArtwork);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }, [artwork, onChange]);

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragging, handleDragMove, handleDragEnd]);

  return (
    <EditorContainer>
      <ImageContainer ref={containerRef}>
        {artwork.background && (
          <DraggableImage
            src={artwork.background.url}
            $position={artwork.background.position}
            onMouseDown={e => handleDragStart(e, 'background', artwork.background?.position || {
              x: 0, y: 0, width: 100, height: 100, scale: 1, rotation: 0, opacity: 1
            })}
            draggable={false}
          />
        )}
        {artwork.character && (
          <DraggableImage
            src={artwork.character.url}
            $position={artwork.character.position}
            onMouseDown={e => handleDragStart(e, 'character', artwork.character?.position || {
              x: 0, y: 0, width: 100, height: 100, scale: 1, rotation: 0, opacity: 1
            })}
            draggable={false}
          />
        )}
        {artwork.powerSignIcon && (
          <DraggableImage
            src={artwork.powerSignIcon.url}
            $position={artwork.powerSignIcon.position}
            onMouseDown={e => handleDragStart(e, 'powerSignIcon', artwork.powerSignIcon?.position || {
              x: 0, y: 0, width: 100, height: 100, scale: 1, rotation: 0, opacity: 1
            })}
            draggable={false}
          />
        )}
      </ImageContainer>

      <Controls>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Background Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleImageUpload(e, 'background')}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Character Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleImageUpload(e, 'character')}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Power Sign Icon
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleImageUpload(e, 'powerSignIcon')}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700"
          />
        </div>
      </Controls>
    </EditorContainer>
  );
};

export default ArtworkEditor;
