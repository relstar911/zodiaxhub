import { CardArtwork, ImagePosition } from '../types/card';

export interface UploadResponse {
  url: string;
  width: number;
  height: number;
}

class ArtworkService {
  private static instance: ArtworkService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  public static getInstance(): ArtworkService {
    if (!ArtworkService.instance) {
      ArtworkService.instance = new ArtworkService();
    }
    return ArtworkService.instance;
  }

  public async uploadImage(file: File): Promise<UploadResponse> {
    // TODO: Implement actual file upload
    // For now, return a mock URL using FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            url: e.target?.result as string,
            width: img.width,
            height: img.height
          });
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  public calculateDefaultPosition(imageWidth: number, imageHeight: number, containerWidth: number, containerHeight: number): ImagePosition {
    const aspectRatio = imageWidth / imageHeight;
    const containerAspectRatio = containerWidth / containerHeight;
    
    let scale: number;
    let x: number;
    let y: number;
    let width: number;
    let height: number;

    if (aspectRatio > containerAspectRatio) {
      // Image is wider than container
      width = containerWidth;
      height = containerWidth / aspectRatio;
      x = 0;
      y = (containerHeight - height) / 2;
      scale = containerWidth / imageWidth;
    } else {
      // Image is taller than container
      height = containerHeight;
      width = containerHeight * aspectRatio;
      x = (containerWidth - width) / 2;
      y = 0;
      scale = containerHeight / imageHeight;
    }

    return {
      x,
      y,
      width,
      height,
      scale,
      rotation: 0,
      opacity: 1
    };
  }

  public optimizeArtwork(artwork: CardArtwork): CardArtwork {
    // Deep clone the artwork to avoid mutations
    const optimized = JSON.parse(JSON.stringify(artwork));

    // Ensure all required properties exist
    if (optimized.background) {
      optimized.background.position = {
        ...this.getDefaultImagePosition(),
        ...optimized.background.position
      };
    }

    if (optimized.character) {
      optimized.character.position = {
        ...this.getDefaultImagePosition(),
        ...optimized.character.position
      };
    }

    if (optimized.powerSignIcon) {
      optimized.powerSignIcon.position = {
        ...this.getDefaultImagePosition(),
        ...optimized.powerSignIcon.position
      };
    }

    return optimized;
  }

  public getDefaultImagePosition(): ImagePosition {
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      scale: 1,
      rotation: 0,
      opacity: 1
    };
  }
}

export default ArtworkService;
