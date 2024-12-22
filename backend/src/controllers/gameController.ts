import { Request, Response, NextFunction } from 'express';
import { Game } from '../models/Game';
import { AppError } from '../middleware/errorHandler';
import { GamePhase, CardLocation, ICardInstance, IPlayerState, IGameState } from '../types/game';
import mongoose from 'mongoose';

export const gameController = {
  // Create a new game
  async createGame(req: Request, res: Response, next: NextFunction) {
    try {
      const game = await Game.create({
        players: new Map()
      });

      const gameObj = game.toObject();
      req.app.get('socketService').emitGameState(game._id.toString(), gameObj);

      res.status(201).json({
        status: 'success',
        data: { game: gameObj }
      });
    } catch (error) {
      next(error);
    }
  },

  // Join a game
  async joinGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const { deckId } = req.body;
      const userId = req.user.id;

      const game = await Game.findById(gameId);
      if (!game) {
        throw new AppError('Game not found', 404);
      }

      await game.addPlayer(userId, deckId);

      res.status(200).json({
        status: 'success',
        data: { game }
      });
    } catch (error) {
      next(error);
    }
  },

  // Start game
  async startGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const userId = req.user.id;

      const game = await Game.findById(gameId);
      if (!game) {
        throw new AppError('Game not found', 404);
      }

      const gameObj = game.toObject() as IGameState;
      if (!gameObj.players[userId]) {
        throw new AppError('You are not part of this game', 403);
      }

      await game.startGame();
      const updatedGameObj = game.toObject();
      
      req.app.get('socketService').emitGameState(gameId, updatedGameObj);

      res.status(200).json({
        status: 'success',
        data: { game: updatedGameObj }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get game state
  async getGameState(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const userId = req.user.id;

      const game = await Game.findById(gameId)
        .populate('players.userId', 'username')
        .populate('players.deck.cardId')
        .populate('players.hand.cardId')
        .populate('players.field.cardId')
        .populate('players.graveyard.cardId');

      if (!game) {
        throw new AppError('Game not found', 404);
      }

      const gameObj = game.toObject() as IGameState;
      if (!gameObj.players[userId]) {
        throw new AppError('You are not part of this game', 403);
      }

      // Hide opponent's hand
      for (const [playerId, playerState] of Object.entries(gameObj.players)) {
        if (playerId !== userId) {
          const hiddenHand: ICardInstance[] = playerState.hand.map(card => ({
            ...card,
            cardId: 'hidden',
            instanceId: card.instanceId,
            location: card.location,
            state: card.state,
            powerSignModifier: card.powerSignModifier,
            counters: card.counters
          }));
          playerState.hand = hiddenHand;
        }
      }

      res.status(200).json({
        status: 'success',
        data: { game: gameObj }
      });
    } catch (error) {
      next(error);
    }
  },

  // Play card
  async playCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const { cardInstanceId, target } = req.body;
      const userId = req.user.id;

      const game = await Game.findById(gameId);
      if (!game) {
        throw new AppError('Game not found', 404);
      }

      await game.playCard(userId, cardInstanceId, target);

      res.status(200).json({
        status: 'success',
        data: { game }
      });
    } catch (error) {
      next(error);
    }
  },

  // Use card ability
  async useAbility(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const { cardInstanceId, abilityIndex, target } = req.body;
      const userId = req.user.id;

      const game = await Game.findById(gameId);
      if (!game) {
        throw new AppError('Game not found', 404);
      }

      await game.useAbility(userId, cardInstanceId, abilityIndex, target);

      res.status(200).json({
        status: 'success',
        data: { game }
      });
    } catch (error) {
      next(error);
    }
  },

  // Declare attack
  async declareAttack(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const { attackerId, targetId } = req.body;
      const userId = req.user.id;

      const game = await Game.findById(gameId);
      if (!game) {
        throw new AppError('Game not found', 404);
      }

      await game.declareAttack(userId, attackerId, targetId);

      res.status(200).json({
        status: 'success',
        data: { game }
      });
    } catch (error) {
      next(error);
    }
  },

  // End turn
  async endTurn(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const userId = req.user.id;

      const game = await Game.findById(gameId);
      if (!game) {
        throw new AppError('Game not found', 404);
      }

      const gameObj = game.toObject() as IGameState;
      if (gameObj.activePlayer !== userId) {
        throw new AppError('Not your turn', 403);
      }

      await game.endTurn();

      res.status(200).json({
        status: 'success',
        data: { game }
      });
    } catch (error) {
      next(error);
    }
  }
};
