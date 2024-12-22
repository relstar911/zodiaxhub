import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { createServer } from 'http';
import config from './config';
import { connectDatabase } from './utils/database';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import SocketService from './services/socketService';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const socketService = new SocketService(httpServer);

// Make socket service available to Express app
app.set('socketService', socketService);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(helmet());

// Connect to database
connectDatabase();

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Handle unhandled routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Start server
const port = config.port;
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
