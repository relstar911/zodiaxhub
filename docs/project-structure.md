# ZodiaxHub Project Structure Documentation

This document provides a detailed overview of the project's directory structure and the purpose of each file and folder.

## Root Directory Structure

```
zodiaxhub/
├── .git/                   # Git version control directory
├── .gitignore             # Git ignore rules
├── README.md              # Project overview and setup instructions
├── backend/               # Backend application code
├── docs/                  # Project documentation
├── frontend/              # Frontend application code
└── package-lock.json      # Root level dependencies lock file
```

## Frontend Structure (`/frontend`)

```
frontend/
├── .env                   # Environment variables for frontend
├── node_modules/          # Frontend dependencies
├── package.json          # Frontend package configuration
├── package-lock.json     # Frontend dependencies lock file
├── public/               # Public assets and index.html
├── src/                  # Source code
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

### Frontend Source (`/frontend/src`)

```
src/
├── App.tsx               # Main application component
├── index.tsx            # Application entry point
├── index.css            # Global styles
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # React components
│   ├── artwork/         # Artwork management components
│   ├── cards/           # Card-related components
│   ├── layout/          # Layout components
│   └── ui/              # Reusable UI components
├── contexts/            # React context providers
│   ├── AuthContext.tsx  # Authentication context
│   └── GameContext.tsx  # Game state context
├── hooks/               # Custom React hooks
│   ├── useArtwork.ts    # Artwork management hook
│   └── useAuth.ts       # Authentication hook
├── services/            # API and external services
│   ├── aiService.ts     # AI integration service
│   ├── artworkService.ts # Artwork management service
│   └── socketService.ts  # WebSocket service
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared type definitions
└── utils/               # Utility functions and helpers
```

## Backend Structure (`/backend`)

```
backend/
├── .env                 # Environment variables for backend
├── dist/                # Compiled TypeScript output
├── node_modules/        # Backend dependencies
├── package.json        # Backend package configuration
├── package-lock.json   # Backend dependencies lock file
├── src/                # Source code
└── tsconfig.json       # TypeScript configuration
```

### Backend Source (`/backend/src`)

```
src/
├── app.ts              # Express application setup
├── index.ts            # Server entry point
├── config/             # Configuration files
│   └── database.ts     # Database configuration
├── controllers/        # Request handlers
│   ├── authController.ts
│   ├── cardController.ts
│   └── userController.ts
├── middleware/         # Express middleware
│   ├── auth.ts         # Authentication middleware
│   └── validation.ts   # Request validation middleware
├── models/             # Database models
│   ├── Card.ts
│   ├── Deck.ts
│   └── User.ts
├── routes/             # API routes
│   ├── auth.ts
│   ├── cards.ts
│   └── users.ts
├── services/          # Business logic
│   └── gameService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   └── helpers.ts
└── validators/        # Request validators
    └── schemas.ts
```

## Documentation (`/docs`)

```
docs/
├── development-log.md          # Development progress and updates
├── project-structure.md        # This file
├── BetaTestingHub_Instructions.md  # Testing guidelines
└── characterstructure.md       # Card character specifications
```

## Key Files Description

### Frontend

- `App.tsx`: Main application component that handles routing and layout
- `AuthContext.tsx`: Manages authentication state and user sessions
- `GameContext.tsx`: Manages game state and real-time updates
- `artworkService.ts`: Handles artwork manipulation and management
- `aiService.ts`: Integrates AI features for card generation and analysis
- `socketService.ts`: Manages WebSocket connections for real-time features

### Backend

- `app.ts`: Express application configuration and middleware setup
- `index.ts`: Server initialization and WebSocket setup
- `authController.ts`: Handles user authentication and authorization
- `cardController.ts`: Manages card creation and manipulation
- `gameService.ts`: Implements game logic and mechanics
- `Card.ts`: Defines card data structure and methods
- `User.ts`: Defines user data structure and methods

### Configuration Files

- `frontend/.env`: Frontend environment variables
  ```
  REACT_APP_API_URL=http://localhost:3001
  REACT_APP_WS_URL=ws://localhost:3001
  ```

- `backend/.env`: Backend environment variables
  ```
  PORT=3001
  MONGODB_URI=mongodb://localhost:27017/zodiaxhub
  JWT_SECRET=your_jwt_secret
  ```

## File Naming Conventions

- React Components: PascalCase (e.g., `CardEditor.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useArtwork.ts`)
- Services: camelCase with 'Service' suffix (e.g., `artworkService.ts`)
- Contexts: PascalCase with 'Context' suffix (e.g., `AuthContext.tsx`)
- Utilities: camelCase (e.g., `helpers.ts`)

## Best Practices

1. **Component Organization**
   - Keep components focused and single-responsibility
   - Use proper file structure for component variations
   - Maintain consistent naming conventions

2. **Code Style**
   - Follow TypeScript best practices
   - Use proper type definitions
   - Maintain consistent formatting

3. **State Management**
   - Use contexts for global state
   - Keep component state local when possible
   - Implement proper data flow patterns

4. **Documentation**
   - Keep this document updated with new additions
   - Document complex functions and components
   - Update development log with significant changes

## Version Control

- Use meaningful commit messages
- Follow conventional commits format
- Keep feature branches focused and small
- Regular pushes to maintain history

## Build and Deployment

- Frontend builds with `npm run build`
- Backend builds with `npm run build`
- Development servers started with `npm start`
- Environment variables properly configured for each environment
