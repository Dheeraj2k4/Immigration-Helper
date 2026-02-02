# Immigration Helper

A full-stack web application to help with immigration processes, visa guides, AI-powered interviews, and more.

## 🏗️ Project Structure

```
immigration-helper/
├── client/              # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/              # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── types/
│   │   └── server.ts
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── package.json         # Root (monorepo scripts)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB (local or Atlas)

### Installation

Install all dependencies for both client and server:

```bash
npm run install:all
```

Or install separately:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Setup

1. Create `.env` file in the `server/` folder:
```bash
cd server
cp .env.example .env
```

2. Update the `.env` file with your configuration:
   - MongoDB URI
   - JWT Secret
   - CORS origin
   - API keys

### Running the Application

#### Development Mode (Both client and server)

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

#### Run Separately

```bash
# Run only frontend
npm run dev:client

# Run only backend
npm run dev:server
```

### Building for Production

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run client tests only
npm run test:client

# Run server tests only
npm run test:server
```

## 📦 Tech Stack

### Frontend (Client)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Zustand** - State management
- **Axios** - HTTP client

### Backend (Server)
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Helmet** - Security
- **Morgan** - Logging

## 🎯 Features

- 🗺️ **Visa Guide** - Comprehensive visa information
- ✅ **Immigration Checklist** - Track your progress
- 🤖 **AI Interview Practice** - Prepare for interviews
- 📰 **Latest Updates** - Immigration news and updates
- 🔐 **Authentication** - Secure user accounts (Coming Soon)

## 📝 Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm run dev` - Run both client and server in development
- `npm run build` - Build both client and server
- `npm start` - Start both in production mode
- `npm test` - Run all tests
- `npm run lint` - Lint all code

### Client Scripts (in client/ folder)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint frontend code

### Server Scripts (in server/ folder)
- `npm run dev` - Start server with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm test` - Run backend tests
- `npm run lint` - Lint backend code

## 🔧 Development

### Adding New Features

1. **Frontend Feature**:
   - Add components in `client/src/components/`
   - Add pages in `client/src/pages/`
   - Update routes in `client/src/App.tsx`

2. **Backend Feature**:
   - Create model in `server/src/models/`
   - Add controller in `server/src/controllers/`
   - Define routes in `server/src/routes/`
   - Register routes in `server/src/server.ts`

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC

### ✅ Home Page
- Hero section with large call-to-action
- Quick action cards for main features
- Responsive footer with company links

### ✅ Navigation
- Responsive navbar with mobile hamburger menu
- Prominent "Visa Guide" button
- Login/Signup button with custom styling
- Floating mobile CTA for Visa Guide

### ✅ Routing
- React Router setup for all pages
- Clean URL structure
- 404 handling ready

### 🚧 Coming Soon
- AI Interview functionality
- Visa Guide content and search
- User authentication
- Plans and pricing
- Real API integration
- Internationalization setup

## 🌐 Pages

1. **Home** (`/`) - Landing page with hero and feature cards
2. **Visa Guide** (`/visa-guide`) - Comprehensive visa guidance (placeholder)
3. **AI Interview** (`/ai-interview`) - Interview practice tool (placeholder)
4. **Updates** (`/updates`) - Latest visa news (placeholder)
5. **Plans** (`/plans`) - Pricing information (placeholder)
6. **About Us** (`/about`) - Company information (placeholder)
7. **FAQ** (`/faq`) - Frequently asked questions (placeholder)
8. **Contact** (`/contact`) - Contact information (placeholder)

## 🎯 Next Steps

This is the frontend scaffold for RouteX. The following features will be added in subsequent phases:

1. **Backend Integration**
   - API endpoints for visa guidance
   - User authentication system
   - Database integration

2. **AI Features**
   - Interview simulation
   - Document analysis
   - Personalized recommendations

3. **Content Management**
   - Dynamic visa guides
   - Real-time updates
   - User dashboard

4. **Advanced Features**
   - Multi-language support
   - Progressive Web App capabilities
   - Offline functionality

## 🔨 Development

### Code Style
- ESLint + Prettier for consistent formatting
- TypeScript for type safety
- Conventional commits for git history

### Component Guidelines
- Use functional components with hooks
- Implement proper prop types
- Follow accessibility best practices
- Keep components small and focused

### Styling
- Utility-first approach with Tailwind CSS
- Consistent design tokens
- Responsive design patterns
- Custom component variants

## 📄 License

This project is proprietary software for RouteX.

---

**Note**: This is the frontend scaffold. Backend integration and AI features will be implemented in future phases.