import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../../../backend/src/types/socket';

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private gameStateListeners: ((gameState: any) => void)[] = [];
  private errorListeners: ((error: { message: string }) => void)[] = [];

  constructor() {
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.notifyErrorListeners({ message: 'An unexpected error occurred' });
    });
  }

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to game server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from game server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.notifyErrorListeners({ message: 'Failed to connect to game server' });
    });

    // Game state updates
    this.socket.on('game:state', (gameState) => {
      this.notifyGameStateListeners(gameState);
    });

    // Error handling
    this.socket.on('game:error', (error) => {
      this.notifyErrorListeners(error);
    });
  }

  // Game actions
  joinGame(gameId: string, token: string) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to game server');
    }
    this.socket.emit('game:join', { gameId, token });
  }

  leaveGame(gameId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('game:leave', { gameId });
  }

  startGame(gameId: string) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to game server');
    }
    this.socket.emit('game:start', { gameId });
  }

  endTurn(gameId: string) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to game server');
    }
    this.socket.emit('game:endTurn', { gameId });
  }

  playCard(gameId: string, cardInstanceId: string, target?: any) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to game server');
    }
    this.socket.emit('card:play', { gameId, cardInstanceId, target });
  }

  attackWithCard(gameId: string, attackerId: string, targetId?: string) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to game server');
    }
    this.socket.emit('card:attack', { gameId, attackerId, targetId });
  }

  useCardAbility(gameId: string, cardInstanceId: string, abilityIndex: number, target?: any) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to game server');
    }
    this.socket.emit('card:useAbility', { gameId, cardInstanceId, abilityIndex, target });
  }

  // Event listeners
  onGameState(listener: (gameState: any) => void) {
    this.gameStateListeners.push(listener);
    return () => {
      this.gameStateListeners = this.gameStateListeners.filter(l => l !== listener);
    };
  }

  onError(listener: (error: { message: string }) => void) {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter(l => l !== listener);
    };
  }

  private notifyGameStateListeners(gameState: any) {
    this.gameStateListeners.forEach(listener => listener(gameState));
  }

  private notifyErrorListeners(error: { message: string }) {
    this.errorListeners.forEach(listener => listener(error));
  }
}

export const socketService = new SocketService();
export default socketService;
