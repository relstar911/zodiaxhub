# ZodiaxHub - Trading Card Game Platform

## Project Overview
ZodiaxHub is a modern trading card game platform that combines traditional TCG mechanics with innovative digital features. The platform allows users to create, collect, and battle with unique cards based on zodiac-inspired themes and power signs.

## Core Features

### Core Game Features
- **Deck Building & Management**: Create and manage decks with 60-100 cards
- **Card Types**:
  - Compan Cards (Main characters)
  - Compagnon Cards (Support characters)
  - Synergie Cards (Special abilities)
  - Action Cards (Tactical plays)
  - Equipment Cards (Character enhancements)
  - Environment Cards (Field effects)
- **Power Signs System**: 13 unique power signs with intricate relationships
- **Evolution & Fusion**: Dynamic card evolution and fusion mechanics

### Platform Features
- **Secure Authentication**: JWT-based user authentication system
- **Profile Management**: Personal user profiles and statistics
- **Real-time Gameplay**: Interactive dueling system
- **AI Integration**: Advanced AI for practice and card evolution
- **Community Features**: Deck sharing and community interaction

## Technical Stack

### Frontend
- React.js with TypeScript
- Context API for state management
- Axios for API communication
- WebSocket for real-time features

### Backend
- Node.js with Express
- TypeScript for type safety
- MongoDB for data storage
- JWT for authentication
- WebSocket for real-time communication

## Getting Started

### Prerequisites
```bash
Node.js >= 14.x
npm >= 6.x
MongoDB >= 4.x
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/relstar911/zodiaxhub.git
cd zodiaxhub
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001

# Backend (.env)
PORT=3001
MONGODB_URI=mongodb://localhost:27017/zodiaxhub
JWT_SECRET=your_jwt_secret
```

5. Start development servers:
```bash
# Terminal 1 (Frontend)
cd frontend
npm start

# Terminal 2 (Backend)
cd backend
npm run dev
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks
- Implement proper error handling
- Write comprehensive documentation
- Use meaningful commit messages

### Component Structure
- Keep components modular and reusable
- Implement proper prop typing
- Use custom hooks for logic separation
- Follow atomic design principles

### State Management
- Use React Context for global state
- Implement proper data flow
- Handle loading and error states
- Maintain type safety

## Documentation
- [Development Log](docs/development-log.md): Detailed development progress
- [Beta Testing Instructions](docs/BetaTestingHub_Instructions.md): Testing guidelines
- [Character Structure](docs/characterstructure.md): Card character specifications

## Project Status
Currently in active development. See [development log](docs/development-log.md) for latest updates.

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
This project is proprietary and confidential.

## Contact
- Developer: Arda Harmanci
- GitHub: [@relstar911](https://github.com/relstar911)
