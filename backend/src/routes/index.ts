import express from 'express';
import cardRoutes from './cardRoutes';
import deckRoutes from './deckRoutes';
import powerSignRoutes from './powerSignRoutes';
import authRoutes from './authRoutes';
import gameRoutes from './gameRoutes';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
router.use('/api/auth', authRoutes);
router.use('/api/cards', cardRoutes);
router.use('/api/decks', deckRoutes);
router.use('/api/power-signs', powerSignRoutes);
router.use('/api/games', gameRoutes);

export default router;
