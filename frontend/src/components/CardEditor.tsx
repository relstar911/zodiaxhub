import React, { useState } from 'react';
import { CardData, CardType, CardRarity, CharacterCardData, CardArtwork } from '../types/card';
import ResponsiveCardPreview from './cards/ResponsiveCardPreview';
import PowerSignSelector from './selectors/PowerSignSelector';
import CardSuggestions from './ai/CardSuggestions';
import ArtworkEditor from './artwork/ArtworkEditor';

interface CardEditorProps {
  onSave: (card: CardData) => void;
  onCancel: () => void;
  initialCard?: CardData;
}

const DEFAULT_CHARACTER_CARD: CharacterCardData = {
  type: 'character',
  name: '',
  description: '',
  powerSign: "Warrior's Might",
  cardStyle: 'standard',
  rarity: 'common',
  energyCost: 1,
  limitPerDeck: 3,
  attack: 1,
  defense: 1,
  abilities: []
};

const CardEditor: React.FC<CardEditorProps> = ({
  onSave,
  onCancel,
  initialCard = DEFAULT_CHARACTER_CARD
}) => {
  const [card, setCard] = useState<CharacterCardData>(initialCard as CharacterCardData);

  const handleChange = (field: keyof CharacterCardData, value: any) => {
    if (field === 'type') {
      value = value as CardType;
    } else if (field === 'rarity') {
      value = value as CardRarity;
    }
    setCard(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Card Type
            </label>
            <select
              value={card.type}
              onChange={(e) => handleChange('type', e.target.value as CardType)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            >
              <option value="character">Character</option>
              <option value="spell">Spell</option>
              <option value="item">Item</option>
              <option value="location">Location</option>
              <option value="trap">Trap</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={card.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={card.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Rarity
            </label>
            <select
              value={card.rarity}
              onChange={(e) => handleChange('rarity', e.target.value as CardRarity)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            >
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Energy Cost
            </label>
            <input
              type="number"
              value={card.energyCost}
              onChange={(e) => handleChange('energyCost', parseInt(e.target.value))}
              min={0}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Limit Per Deck
            </label>
            <input
              type="number"
              value={card.limitPerDeck}
              onChange={(e) => handleChange('limitPerDeck', parseInt(e.target.value))}
              min={1}
              max={4}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <PowerSignSelector
            value={card.powerSign}
            onChange={(value) => handleChange('powerSign', value)}
          />

          {card.type === 'character' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Attack
                </label>
                <input
                  type="number"
                  value={card.attack}
                  onChange={(e) => handleChange('attack', parseInt(e.target.value))}
                  min={0}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Defense
                </label>
                <input
                  type="number"
                  value={card.defense}
                  onChange={(e) => handleChange('defense', parseInt(e.target.value))}
                  min={0}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(card)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Card
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Card Artwork</h3>
            <ArtworkEditor
              artwork={card.artwork || {}}
              onChange={(newArtwork: CardArtwork) => handleChange('artwork', newArtwork)}
            />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Card Preview</h3>
            <ResponsiveCardPreview
              card={card}
              $maxWidth={300}
              $maxHeight={420}
            />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">AI Suggestions</h3>
            <CardSuggestions
              card={card}
              onSelect={(updatedCard: CardData) => {
                if (updatedCard.type === 'character') {
                  setCard(updatedCard as CharacterCardData);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;
