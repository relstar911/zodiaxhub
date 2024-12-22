import { useState, useCallback } from 'react';
import { CardData, isCharacterCard } from '../types/card';
import AIService from '../services/aiService';

interface CardSuggestion {
  description?: string;
  card: CardData;
  reason: string;
}

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useCallback(async (card: CardData): Promise<CardSuggestion[]> => {
    setLoading(true);
    setError(null);

    try {
      const suggestions = await AIService.generateCardSuggestions(card);
      return suggestions;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeCard = useCallback(async (card: CardData): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const analysis = await AIService.analyzeCard(card);
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze card');
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateSuggestions,
    analyzeCard,
    loading,
    error
  };
};

export default useAI;
