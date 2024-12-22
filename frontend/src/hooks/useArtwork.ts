import { useState, useCallback } from 'react';
import { CardArtwork, ImagePosition } from '../types/card';
import ArtworkService from '../services/artworkService';

interface UseArtworkReturn {
  artwork: CardArtwork;
  updateArtwork: (newArtwork: CardArtwork) => void;
  updateImagePosition: (
    type: 'background' | 'character' | 'powerSignIcon',
    position: Partial<ImagePosition>
  ) => void;
  resetImagePosition: (
    type: 'background' | 'character' | 'powerSignIcon'
  ) => void;
  uploadImage: (
    type: 'background' | 'character' | 'powerSignIcon',
    file: File
  ) => Promise<void>;
}

export const useArtwork = (initialArtwork: CardArtwork = {}): UseArtworkReturn => {
  const [artwork, setArtwork] = useState<CardArtwork>(
    ArtworkService.getInstance().optimizeArtwork(initialArtwork)
  );

  const updateArtwork = useCallback((newArtwork: CardArtwork) => {
    setArtwork(ArtworkService.getInstance().optimizeArtwork(newArtwork));
  }, []);

  const updateImagePosition = useCallback((
    type: 'background' | 'character' | 'powerSignIcon',
    position: Partial<ImagePosition>
  ) => {
    setArtwork(prev => {
      const updated = { ...prev };
      if (updated[type]) {
        updated[type] = {
          ...updated[type]!,
          position: {
            ...updated[type]!.position,
            ...position
          }
        };
      }
      return updated;
    });
  }, []);

  const resetImagePosition = useCallback((
    type: 'background' | 'character' | 'powerSignIcon'
  ) => {
    setArtwork(prev => {
      const updated = { ...prev };
      if (updated[type]) {
        updated[type] = {
          ...updated[type]!,
          position: ArtworkService.getInstance().getDefaultImagePosition()
        };
      }
      return updated;
    });
  }, []);

  const uploadImage = useCallback(async (
    type: 'background' | 'character' | 'powerSignIcon',
    file: File
  ) => {
    try {
      const response = await ArtworkService.getInstance().uploadImage(file);
      setArtwork(prev => {
        const updated = { ...prev };
        updated[type] = {
          url: response.url,
          position: ArtworkService.getInstance().calculateDefaultPosition(
            response.width,
            response.height,
            300, // Default container width
            420  // Default container height
          )
        };
        return updated;
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }, []);

  return {
    artwork,
    updateArtwork,
    updateImagePosition,
    resetImagePosition,
    uploadImage
  };
};

export default useArtwork;
