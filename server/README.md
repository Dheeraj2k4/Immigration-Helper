# Immigration Helper Backend API

Backend API for the Immigration Helper application built with Node.js, Express, and TypeScript.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── controllers/     # Route controllers (business logic)
│   ├── middleware/      # Custom middleware functions
│   ├── models/          # Database models/schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and helpers
│   └── server.ts        # Application entry point
├── tests/               # Test files
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Set your MongoDB URI
   - Set JWT secret
   - Configure other environment variables

### Running the Server

Development mode with hot reload:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

### Testing

```bash
npm test
```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### Health Check
- `GET /health` - Check API status

### API Routes
- `GET /api` - API information

*More endpoints will be added as features are implemented*

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🔒 Environment Variables

See `.env.example` for all available environment variables.

## 📝 Development Guidelines

### Folder Purposes

- **controllers/**: Handle HTTP requests/responses, call services
- **services/**: Business logic, interact with models
- **models/**: Database schemas and models
- **routes/**: Define API endpoints and link to controllers
- **middleware/**: Request processing (auth, validation, etc.)
- **config/**: Configuration and initialization
- **utils/**: Reusable helper functions
- **types/**: TypeScript interfaces and types

### Code Style

- Follow TypeScript best practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Write meaningful comments
- Keep functions small and focused

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

ISC
