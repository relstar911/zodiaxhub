import React, { useEffect, useRef } from 'react';
import { CardEffect, GlowEffect, ShineEffect, SparkleEffect, HolographicEffect, AgedEffect } from '../../../types/card';

interface EffectsRendererProps {
  effects: CardEffect[];
  width: number;
  height: number;
}

const EffectsRenderer: React.FC<EffectsRendererProps> = ({ effects, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    effects.forEach(effect => {
      switch (effect.type) {
        case 'glow':
          const glowEffect = effect as GlowEffect;
          ctx.shadowBlur = glowEffect.radius;
          ctx.shadowColor = glowEffect.color || '#ffffff';
          ctx.fillStyle = glowEffect.color || '#ffffff';
          ctx.globalAlpha = glowEffect.opacity || 0.5;
          ctx.fillRect(0, 0, width, height);
          break;

        case 'shine':
          const shineEffect = effect as ShineEffect;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            Math.cos(shineEffect.angle * Math.PI / 180) * width,
            Math.sin(shineEffect.angle * Math.PI / 180) * height
          );
          
          gradient.addColorStop(0, 'transparent');
          gradient.addColorStop(0.5, shineEffect.color || '#ffffff');
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.globalAlpha = shineEffect.opacity || 0.3;
          ctx.fillRect(0, 0, width, height);
          break;

        case 'sparkle':
          const sparkleEffect = effect as SparkleEffect;
          for (let i = 0; i < sparkleEffect.density; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            
            ctx.beginPath();
            ctx.arc(x, y, sparkleEffect.size, 0, Math.PI * 2);
            ctx.fillStyle = sparkleEffect.color || '#ffffff';
            ctx.globalAlpha = (sparkleEffect.opacity || 0.5) * Math.random();
            ctx.fill();
          }
          break;

        case 'holographic':
          const holoEffect = effect as HolographicEffect;
          const holoGradient = ctx.createLinearGradient(0, 0, width, height);
          holoGradient.addColorStop(0, holoEffect.color || '#ffffff');
          holoGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = holoGradient;
          ctx.globalAlpha = holoEffect.opacity || 0.3;
          ctx.fillRect(0, 0, width, height);
          break;

        case 'aged':
          const agedEffect = effect as AgedEffect;
          // Add grain
          const imageData = ctx.getImageData(0, 0, width, height);
          const pixels = imageData.data;
          
          for (let i = 0; i < pixels.length; i += 4) {
            const grainValue = (Math.random() - 0.5) * agedEffect.wear * 255;
            pixels[i] = Math.min(255, Math.max(0, pixels[i] + grainValue));
            pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + grainValue));
            pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + grainValue));
          }
          ctx.putImageData(imageData, 0, 0);

          // Add patina
          ctx.fillStyle = agedEffect.color || '#8b7355';
          ctx.globalAlpha = agedEffect.patina;
          ctx.fillRect(0, 0, width, height);
          break;
      }
    });
  }, [effects, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />
  );
};

export default EffectsRenderer;
