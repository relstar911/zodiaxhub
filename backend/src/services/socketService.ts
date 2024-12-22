import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import { 
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  GameSocket
} from '../types/socket';
import { Game } from '../models/Game';
import { AppError } from '../middleware/errorHandler';
import { ICardInstance } from '../types/game';

export class SocketService {
  private io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authenticate socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication error');
        }

        const decoded = verifyToken(token);
        socket.data.userId = decoded.id;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: GameSocket) => {
      console.log(`User connected: ${socket.data.userId}`);

      // Join game room
      socket.on('game:join', async ({ gameId, token }) => {
        try {
          const game = await Game.findById(gameId);
          if (!game) {
            throw new AppError('Game not found', 404);
          }

          const gameObj = game.toObject();
          if (!gameObj.players[socket.data.userId]) {
            throw new AppError('Not a player in this game', 403);
          }

          socket.data.gameId = gameId;
          await socket.join(gameId);

          // Notify other players
          socket.to(gameId).emit('player:joined', {
            gameId,
            playerId: socket.data.userId
          });

          // Send current game state
          socket.emit('game:state', gameObj);
        } catch (error: any) {
          socket.emit('game:error', { message: error.message });
        }
      });

      // Leave game room
      socket.on('game:leave', async ({ gameId }) => {
        await socket.leave(gameId);
        socket.data.gameId = undefined;

        socket.to(gameId).emit('player:left', {
          gameId,
          playerId: socket.data.userId
        });
      });

      // Game actions
      socket.on('game:start', async ({ gameId }) => {
        try {
          const game = await Game.findById(gameId);
          if (!game) {
            throw new AppError('Game not found', 404);
          }

          await game.startGame();
          const gameState = game.toObject();

          this.io.to(gameId).emit('game:started', gameState);
        } catch (error: any) {
          socket.emit('game:error', { message: error.message });
        }
      });

      socket.on('game:endTurn', async ({ gameId }) => {
        try {
          const game = await Game.findById(gameId);
          if (!game) {
            throw new AppError('Game not found', 404);
          }

          await game.endTurn();
          const gameState = game.toObject();

          this.io.to(gameId).emit('game:state', gameState);
          this.io.to(gameId).emit('game:turnChanged', {
            gameId,
            activePlayer: gameState.activePlayer
          });
        } catch (error: any) {
          socket.emit('game:error', { message: error.message });
        }
      });

      // Card actions
      socket.on('card:play', async ({ gameId, cardInstanceId, target }) => {
        try {
          const game = await Game.findById(gameId);
          if (!game) {
            throw new AppError('Game not found', 404);
          }

          await game.playCard(socket.data.userId, cardInstanceId, target);
          const gameState = game.toObject();

          const playedCard = gameState.players[socket.data.userId].field
            .find(card => card.instanceId === cardInstanceId);

          if (playedCard) {
            this.io.to(gameId).emit('card:played', {
              gameId,
              playerId: socket.data.userId,
              card: playedCard
            });
          }

          this.io.to(gameId).emit('game:state', gameState);
        } catch (error: any) {
          socket.emit('game:error', { message: error.message });
        }
      });

      socket.on('card:attack', async ({ gameId, attackerId, targetId }) => {
        try {
          const game = await Game.findById(gameId);
          if (!game) {
            throw new AppError('Game not found', 404);
          }

          await game.declareAttack(socket.data.userId, attackerId, targetId);
          const gameState = game.toObject();

          const attackingCard = gameState.players[socket.data.userId].field
            .find(card => card.instanceId === attackerId);
            
          if (!attackingCard) {
            throw new AppError('Attacking card not found', 404);
          }

          let targetCard: ICardInstance | undefined;
          if (targetId) {
            for (const playerState of Object.values(gameState.players)) {
              targetCard = playerState.field.find(card => card.instanceId === targetId);
              if (targetCard) break;
            }
          }

          this.io.to(gameId).emit('card:attacked', {
            gameId,
            attackerId: socket.data.userId,
            attackingCard,
            targetId,
            targetCard: targetCard || undefined
          });

          this.io.to(gameId).emit('game:state', gameState);
        } catch (error: any) {
          socket.emit('game:error', { message: error.message });
        }
      });

      socket.on('card:useAbility', async ({ gameId, cardInstanceId, abilityIndex, target }) => {
        try {
          const game = await Game.findById(gameId);
          if (!game) {
            throw new AppError('Game not found', 404);
          }

          await game.useAbility(socket.data.userId, cardInstanceId, abilityIndex, target);
          const gameState = game.toObject();

          const card = gameState.players[socket.data.userId].field
            .find(card => card.instanceId === cardInstanceId);

          if (card) {
            this.io.to(gameId).emit('card:abilityUsed', {
              gameId,
              playerId: socket.data.userId,
              card,
              abilityIndex,
              target
            });
          }

          this.io.to(gameId).emit('game:state', gameState);
        } catch (error: any) {
          socket.emit('game:error', { message: error.message });
        }
      });

      // Disconnect handling
      socket.on('disconnect', () => {
        if (socket.data.gameId) {
          this.io.to(socket.data.gameId).emit('player:left', {
            gameId: socket.data.gameId,
            playerId: socket.data.userId
          });
        }
        console.log(`User disconnected: ${socket.data.userId}`);
      });
    });
  }

  // Utility method to emit game state updates
  public emitGameState(gameId: string, gameState: any) {
    this.io.to(gameId).emit('game:state', gameState);
  }
}

export default SocketService;
