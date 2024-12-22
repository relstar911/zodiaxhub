import React from 'react';
import { CardLayout, ImagePosition, TextPosition, TextStyle } from '../../types/card';
import styled from 'styled-components';

interface LayoutEditorProps {
  layout: CardLayout;
  onChange: (layout: CardLayout) => void;
}

type LayoutSection = {
  path: string;
  title: string;
  type: 'image' | 'text';
};

const LAYOUT_SECTIONS: LayoutSection[] = [
  { path: 'artwork.background', title: 'Background', type: 'image' },
  { path: 'artwork.character', title: 'Character', type: 'image' },
  { path: 'artwork.frame', title: 'Frame', type: 'image' },
  { path: 'artwork.powerSignIcon', title: 'Power Sign Icon', type: 'image' },
  { path: 'name', title: 'Name', type: 'text' },
  { path: 'type', title: 'Type', type: 'text' },
  { path: 'powerSign', title: 'Power Sign', type: 'text' },
  { path: 'description', title: 'Description', type: 'text' }
];

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 4px;
  color: #ffffff;
  
  &:focus {
    outline: none;
    border-color: #6a6a6a;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  border-radius: 4px;
  color: #ffffff;
  
  &:focus {
    outline: none;
    border-color: #6a6a6a;
  }
`;

const LayoutEditor: React.FC<LayoutEditorProps> = ({ layout, onChange }) => {
  const updateNestedValue = (path: string, value: any) => {
    const keys = path.split('.');
    const newLayout = { ...layout };
    let current: any = newLayout;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    onChange(newLayout);
  };

  const getPositionFromPath = (path: string): ImagePosition | (TextPosition & TextStyle) => {
    const keys = path.split('.');
    let current: any = layout;
    
    for (const key of keys) {
      current = current[key];
    }
    
    return current;
  };

  const renderPositionControls = (section: LayoutSection) => {
    const position = getPositionFromPath(section.path);
    
    return (
      <EditorContainer>
        <InputGroup>
          <Label>X Position (%)</Label>
          <Input
            type="number"
            value={position.x}
            onChange={e => updateNestedValue(`${section.path}.x`, Number(e.target.value))}
          />
        </InputGroup>

        <InputGroup>
          <Label>Y Position (%)</Label>
          <Input
            type="number"
            value={position.y}
            onChange={e => updateNestedValue(`${section.path}.y`, Number(e.target.value))}
          />
        </InputGroup>

        <InputGroup>
          <Label>Width (%)</Label>
          <Input
            type="number"
            value={position.width}
            onChange={e => updateNestedValue(`${section.path}.width`, Number(e.target.value))}
          />
        </InputGroup>

        {section.type === 'image' && (
          <InputGroup>
            <Label>Height (%)</Label>
            <Input
              type="number"
              value={(position as ImagePosition).height}
              onChange={e => updateNestedValue(`${section.path}.height`, Number(e.target.value))}
            />
          </InputGroup>
        )}

        {section.type === 'image' && (
          <InputGroup>
            <Label>Rotation (deg)</Label>
            <Input
              type="number"
              value={(position as ImagePosition).rotation}
              onChange={e => updateNestedValue(`${section.path}.rotation`, Number(e.target.value))}
            />
          </InputGroup>
        )}

        {section.type === 'image' && (
          <InputGroup>
            <Label>Scale</Label>
            <Input
              type="number"
              value={(position as ImagePosition).scale}
              onChange={e => updateNestedValue(`${section.path}.scale`, Number(e.target.value))}
              step="0.1"
            />
          </InputGroup>
        )}

        {section.type === 'text' && (
          <InputGroup>
            <Label>Font Size</Label>
            <Input
              type="number"
              value={(position as TextPosition & TextStyle).fontSize}
              onChange={e => updateNestedValue(`${section.path}.fontSize`, Number(e.target.value))}
            />
          </InputGroup>
        )}

        {section.type === 'text' && (
          <InputGroup>
            <Label>Font Family</Label>
            <Input
              type="text"
              value={(position as TextPosition & TextStyle).fontFamily}
              onChange={e => updateNestedValue(`${section.path}.fontFamily`, e.target.value)}
            />
          </InputGroup>
        )}

        {section.type === 'text' && (
          <InputGroup>
            <Label>Font Weight</Label>
            <Input
              type="text"
              value={(position as TextPosition & TextStyle).fontWeight}
              onChange={e => updateNestedValue(`${section.path}.fontWeight`, e.target.value)}
            />
          </InputGroup>
        )}

        {section.type === 'text' && (
          <InputGroup>
            <Label>Text Align</Label>
            <Select
              value={(position as TextPosition & TextStyle).textAlign}
              onChange={e => updateNestedValue(`${section.path}.textAlign`, e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </Select>
          </InputGroup>
        )}

        {section.type === 'text' && (
          <InputGroup>
            <Label>Color</Label>
            <Input
              type="color"
              value={(position as TextPosition & TextStyle).color}
              onChange={e => updateNestedValue(`${section.path}.color`, e.target.value)}
            />
          </InputGroup>
        )}

        {section.type === 'text' && (
          <InputGroup>
            <Label>Text Shadow</Label>
            <Input
              type="text"
              value={(position as TextPosition & TextStyle).textShadow || ''}
              onChange={e => updateNestedValue(`${section.path}.textShadow`, e.target.value)}
            />
          </InputGroup>
        )}
      </EditorContainer>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <h2 className="text-xl font-semibold mb-4">Layout Editor</h2>

      {/* Artwork Positions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Artwork Positions</h3>
        <div className="space-y-4">
          {LAYOUT_SECTIONS.filter(section => section.type === 'image').map(section => (
            <div key={section.path}>
              <h4 className="text-md font-medium mb-2">{section.title}</h4>
              {renderPositionControls(section)}
            </div>
          ))}
        </div>
      </div>

      {/* Text Positions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Text Positions</h3>
        <div className="space-y-4">
          {LAYOUT_SECTIONS.filter(section => section.type === 'text').map(section => (
            <div key={section.path}>
              <h4 className="text-md font-medium mb-2">{section.title}</h4>
              {renderPositionControls(section)}
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => onChange({
          style: {
            background: '#000000',
            color: '#ffffff',
            headerBackground: '#333333',
            descriptionBackground: '#222222'
          },
          frame: {
            borderColor: '#444444',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }
        })}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Reset to Default Layout
      </button>
    </div>
  );
};

export default LayoutEditor;
