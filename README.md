# ZodiaxHub - Company TCG Digital Platform

## Overview
ZodiaxHub is a digital platform for Company TCG, a unique trading card game featuring rich lore, strategic gameplay, and innovative mechanics. The platform provides a comprehensive environment for players to build decks, duel opponents, and participate in the evolving world of Company TCG.

## Features

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
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/zodiaxhub.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Set up environment variables:
- Create `.env` in backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3001
```
- Create `.env` in frontend directory:
```
PORT=3001
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```

5. Start the development servers:
- Backend: `npm run dev`
- Frontend: `npm start`

## Documentation
- Game rules and structure: `/docs/Company TCG Spielregeln & Aufbau.md`
- Character lore: `/docs/characterstructure.md`
- Development log: `/docs/development-log.md`

## Contributing
Please read our contributing guidelines before submitting pull requests.

## License
This project is proprietary and confidential.
