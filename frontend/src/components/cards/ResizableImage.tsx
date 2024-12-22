import React, { useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { ImagePosition } from '../../types/card';

interface ResizableImageProps {
  src: string;
  position: ImagePosition;
  isEditing: boolean;
  onPositionChange?: (newPosition: ImagePosition) => void;
  className?: string;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startPosition: ImagePosition;
  startAngle?: number;
}

const ImageContainer = styled.div<{ position: ImagePosition }>`
  position: absolute;
  top: ${props => props.position.y}%;
  left: ${props => props.position.x}%;
  width: ${props => props.position.width}%;
  height: ${props => props.position.height}%;
  transform: rotate(${props => props.position.rotation}deg) scale(${props => props.position.scale});
  opacity: ${props => props.position.opacity || 1};
  cursor: move;
  user-select: none;
  touch-action: none;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const ResizeHandle = styled.div<{ position: string }>`
  position: absolute;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #4a90e2;
  border-radius: 50%;
  z-index: 1000;
  ${props => {
    switch (props.position) {
      case 'top-left':
        return 'top: -12px; left: -12px; cursor: nw-resize;';
      case 'top-right':
        return 'top: -12px; right: -12px; cursor: ne-resize;';
      case 'bottom-left':
        return 'bottom: -12px; left: -12px; cursor: sw-resize;';
      case 'bottom-right':
        return 'bottom: -12px; right: -12px; cursor: se-resize;';
      default:
        return '';
    }
  }}

  &:hover {
    transform: scale(1.2);
    background: white;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const RotateHandle = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #4a90e2;
  border-radius: 50%;
  cursor: grab;
  z-index: 1000;

  &::after {
    content: '↻';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #4a90e2;
    font-size: 20px;
  }

  &:hover {
    transform: translateX(-50%) scale(1.2);
    background: white;
  }

  &:active {
    cursor: grabbing;
    transform: translateX(-50%) scale(0.9);
  }
`;

const ResizableImage: React.FC<ResizableImageProps> = ({
  src,
  position,
  isEditing,
  onPositionChange,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosition: position
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosition: position
    });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const parentRect = containerRef.current.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    const deltaXPercent = ((e.clientX - dragState.startX) / parentRect.width) * 100;
    const deltaYPercent = ((e.clientY - dragState.startY) / parentRect.height) * 100;

    onPositionChange?.({
      ...dragState.startPosition,
      x: Math.max(0, Math.min(100 - position.width, dragState.startPosition.x + deltaXPercent)),
      y: Math.max(0, Math.min(100 - position.height, dragState.startPosition.y + deltaYPercent))
    });
  }, [dragState, onPositionChange, position]);

  const handleMouseUp = useCallback(() => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleRotateStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosition: position,
      startAngle
    });
  }, [position]);

  const handleRotate = useCallback((e: MouseEvent) => {
    if (!dragState || !containerRef.current || dragState.startAngle === undefined) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const currentRotation = position.rotation || 0;
    const rotation = currentRotation + ((angle - dragState.startAngle) * 180) / Math.PI;

    onPositionChange?.({ ...position, rotation });
  }, [dragState, onPositionChange, position]);

  const handleResize = useCallback((corner: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const parentRect = containerRef.current.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaXPercent = ((e.clientX - dragState.startX) / parentRect.width) * 100;
      const deltaYPercent = ((e.clientY - dragState.startY) / parentRect.height) * 100;
      const startPosition = dragState.startPosition;
      const newPosition = { ...startPosition };

      switch (corner) {
        case 'top-left':
          newPosition.x = Math.min(startPosition.x + deltaXPercent, startPosition.x + startPosition.width - 20);
          newPosition.y = Math.min(startPosition.y + deltaYPercent, startPosition.y + startPosition.height - 20);
          newPosition.width = Math.max(20, startPosition.width - deltaXPercent);
          newPosition.height = Math.max(20, startPosition.height - deltaYPercent);
          break;
        case 'top-right':
          newPosition.y = Math.min(startPosition.y + deltaYPercent, startPosition.y + startPosition.height - 20);
          newPosition.width = Math.max(20, startPosition.width + deltaXPercent);
          newPosition.height = Math.max(20, startPosition.height - deltaYPercent);
          break;
        case 'bottom-left':
          newPosition.x = Math.min(startPosition.x + deltaXPercent, startPosition.x + startPosition.width - 20);
          newPosition.width = Math.max(20, startPosition.width - deltaXPercent);
          newPosition.height = Math.max(20, startPosition.height + deltaYPercent);
          break;
        case 'bottom-right':
          newPosition.width = Math.max(20, startPosition.width + deltaXPercent);
          newPosition.height = Math.max(20, startPosition.height + deltaYPercent);
          break;
      }

      onPositionChange?.(newPosition);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [dragState, onPositionChange]);

  React.useEffect(() => {
    if (dragState.isDragging) {
      if (dragState.startAngle !== undefined) {
        window.addEventListener('mousemove', handleRotate);
      } else {
        window.addEventListener('mousemove', handleMouseMove);
      }
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleRotate);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, handleMouseMove, handleRotate, handleMouseUp]);

  return (
    <ImageContainer
      ref={containerRef}
      position={position}
      onMouseDown={isEditing ? handleMouseDown : undefined}
      className={className}
    >
      <Image src={src} draggable={false} />
      {isEditing && (
        <>
          <ResizeHandle position="top-left" onMouseDown={(e) => handleResize('top-left', e)} />
          <ResizeHandle position="top-right" onMouseDown={(e) => handleResize('top-right', e)} />
          <ResizeHandle position="bottom-left" onMouseDown={(e) => handleResize('bottom-left', e)} />
          <ResizeHandle position="bottom-right" onMouseDown={(e) => handleResize('bottom-right', e)} />
          <RotateHandle onMouseDown={handleRotateStart} />
        </>
      )}
    </ImageContainer>
  );
};

export default ResizableImage;
