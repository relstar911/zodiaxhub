import { Request, Response } from 'express';
import { Card } from '../models/Card';
import { CardType, PowerSign, CardRarity } from '../types';

export const cardController = {
  // Create a new card
  async createCard(req: Request, res: Response) {
    try {
      const {
        name,
        type,
        powerSign,
        rarity,
        energyCost,
        limitPerDeck,
        attributes,
        abilities,
        description,
        imageUrl
      } = req.body;

      // Validate required fields
      if (!name || !type || !powerSign || !rarity || energyCost === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate enums
      if (!Object.values(CardType).includes(type)) {
        return res.status(400).json({ error: 'Invalid card type' });
      }
      if (!Object.values(PowerSign).includes(powerSign)) {
        return res.status(400).json({ error: 'Invalid power sign' });
      }
      if (!Object.values(CardRarity).includes(rarity)) {
        return res.status(400).json({ error: 'Invalid rarity' });
      }

      const card = new Card({
        name,
        type,
        powerSign,
        rarity,
        energyCost,
        limitPerDeck: limitPerDeck || 3,
        attributes,
        abilities,
        description,
        imageUrl
      });

      await card.save();
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ error: 'Error creating card' });
    }
  },

  // Get all cards with filtering
  async getCards(req: Request, res: Response) {
    try {
      const {
        type,
        powerSign,
        rarity,
        minEnergy,
        maxEnergy,
        search
      } = req.query;

      const filter: any = {};

      if (type) filter.type = type;
      if (powerSign) filter.powerSign = powerSign;
      if (rarity) filter.rarity = rarity;
      if (minEnergy || maxEnergy) {
        filter.energyCost = {};
        if (minEnergy) filter.energyCost.$gte = Number(minEnergy);
        if (maxEnergy) filter.energyCost.$lte = Number(maxEnergy);
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const cards = await Card.find(filter);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching cards' });
    }
  },

  // Get a single card by ID
  async getCard(req: Request, res: Response) {
    try {
      const card = await Card.findById(req.params.id);
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching card' });
    }
  },

  // Update a card
  async updateCard(req: Request, res: Response) {
    try {
      const {
        name,
        type,
        powerSign,
        rarity,
        energyCost,
        limitPerDeck,
        attributes,
        abilities,
        description,
        imageUrl
      } = req.body;

      const card = await Card.findByIdAndUpdate(
        req.params.id,
        {
          name,
          type,
          powerSign,
          rarity,
          energyCost,
          limitPerDeck,
          attributes,
          abilities,
          description,
          imageUrl
        },
        { new: true, runValidators: true }
      );

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      res.json(card);
    } catch (error) {
      res.status(500).json({ error: 'Error updating card' });
    }
  },

  // Delete a card
  async deleteCard(req: Request, res: Response) {
    try {
      const card = await Card.findByIdAndDelete(req.params.id);
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
      res.json({ message: 'Card deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting card' });
    }
  }
};
