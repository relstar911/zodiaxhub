import { Request, Response } from 'express';
import { Deck } from '../models/Deck';
import { Card } from '../models/Card';

export const deckController = {
  // Create a new deck
  async createDeck(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        cards,
        powerSignFocus,
        isPublic
      } = req.body;

      // Validate required fields
      if (!name || !description || !cards || !cards.length) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate deck size
      const totalCards = cards.reduce((sum: number, card: any) => sum + card.quantity, 0);
      if (totalCards < 60 || totalCards > 100) {
        return res.status(400).json({ 
          error: 'Deck must contain between 60 and 100 cards' 
        });
      }

      // Validate card limits
      const cardCounts = new Map();
      for (const cardData of cards) {
        const card = await Card.findById(cardData.cardId);
        if (!card) {
          return res.status(400).json({ 
            error: `Card with ID ${cardData.cardId} not found` 
          });
        }

        const currentCount = cardCounts.get(cardData.cardId) || 0;
        const newCount = currentCount + cardData.quantity;
        if (newCount > card.limitPerDeck) {
          return res.status(400).json({ 
            error: `Exceeded limit for card ${card.name}` 
          });
        }
        cardCounts.set(cardData.cardId, newCount);
      }

      const deck = new Deck({
        name,
        description,
        cards,
        powerSignFocus,
        isPublic,
        createdBy: req.user?.id // Assuming user authentication is implemented
      });

      await deck.save();
      res.status(201).json(deck);
    } catch (error) {
      res.status(500).json({ error: 'Error creating deck' });
    }
  },

  // Get all decks with filtering
  async getDecks(req: Request, res: Response) {
    try {
      const { 
        isPublic, 
        powerSign,
        search,
        userId 
      } = req.query;

      const filter: any = {};

      if (isPublic !== undefined) filter.isPublic = isPublic;
      if (powerSign) filter.powerSignFocus = powerSign;
      if (userId) filter.createdBy = userId;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const decks = await Deck.find(filter)
        .populate('cards.cardId')
        .populate('createdBy', 'username');

      res.json(decks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching decks' });
    }
  },

  // Get a single deck by ID
  async getDeck(req: Request, res: Response) {
    try {
      const deck = await Deck.findById(req.params.id)
        .populate('cards.cardId')
        .populate('createdBy', 'username');

      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      res.json(deck);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching deck' });
    }
  },

  // Update a deck
  async updateDeck(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        cards,
        powerSignFocus,
        isPublic
      } = req.body;

      // Perform the same validations as in createDeck
      if (cards) {
        const totalCards = cards.reduce((sum: number, card: any) => sum + card.quantity, 0);
        if (totalCards < 60 || totalCards > 100) {
          return res.status(400).json({ 
            error: 'Deck must contain between 60 and 100 cards' 
          });
        }

        const cardCounts = new Map();
        for (const cardData of cards) {
          const card = await Card.findById(cardData.cardId);
          if (!card) {
            return res.status(400).json({ 
              error: `Card with ID ${cardData.cardId} not found` 
            });
          }

          const currentCount = cardCounts.get(cardData.cardId) || 0;
          const newCount = currentCount + cardData.quantity;
          if (newCount > card.limitPerDeck) {
            return res.status(400).json({ 
              error: `Exceeded limit for card ${card.name}` 
            });
          }
          cardCounts.set(cardData.cardId, newCount);
        }
      }

      const deck = await Deck.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          cards,
          powerSignFocus,
          isPublic
        },
        { new: true, runValidators: true }
      ).populate('cards.cardId');

      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }

      res.json(deck);
    } catch (error) {
      res.status(500).json({ error: 'Error updating deck' });
    }
  },

  // Delete a deck
  async deleteDeck(req: Request, res: Response) {
    try {
      const deck = await Deck.findByIdAndDelete(req.params.id);
      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }
      res.json({ message: 'Deck deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting deck' });
    }
  }
};
