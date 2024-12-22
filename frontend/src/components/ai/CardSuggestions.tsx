import React from 'react';
import { CardData } from '../../types/card';
import ResponsiveCardPreview from '../cards/ResponsiveCardPreview';
import AIService from '../../services/aiService';

interface CardSuggestionsProps {
  card: CardData;
  onSelect: (card: CardData) => void;
}

const CardSuggestions: React.FC<CardSuggestionsProps> = ({ card, onSelect }) => {
  const [suggestions, setSuggestions] = React.useState<Array<{ card: CardData; reason: string }>>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await AIService.generateCardSuggestions(card);
        setSuggestions(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [card]);

  if (loading) {
    return <div className="text-gray-400">Loading suggestions...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (suggestions.length === 0) {
    return <div className="text-gray-400">No suggestions available</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Suggested Variations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="space-y-2">
            <ResponsiveCardPreview
              card={suggestion.card}
              $maxWidth={200}
              onClick={() => onSelect(suggestion.card)}
            />
            <p className="text-sm text-gray-400">{suggestion.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSuggestions;
