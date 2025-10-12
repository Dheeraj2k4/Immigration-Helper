# RouteX Frontend

A modern React-based frontend application for RouteX visa assistance platform. Built with Vite, Tailwind CSS, and modern React patterns for a seamless visa application experience.

## 🌟 Features

- **Modern Tech Stack**: React 19, Vite, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first design that works on all devices
- **Component Library**: Built with shadcn/ui components for consistency
- **Smooth Animations**: Framer Motion for delightful user interactions
- **Internationalization**: Ready for multiple languages with react-i18next
- **Accessibility**: WCAG compliant with semantic HTML and ARIA attributes
- **State Management**: Zustand for efficient app state management
- **Type Safety**: Full TypeScript support for better development experience

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProjectStage1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── assets/          # Images, icons, and static assets
├── components/      # Reusable UI components
│   ├── ui/         # Base UI components (Button, Card, etc.)
│   └── Navbar.tsx  # Navigation component
├── layouts/         # Layout components
│   └── MainLayout.tsx
├── pages/           # Page components
│   ├── Home.tsx
│   ├── VisaGuide.tsx
│   ├── AIInterview.tsx
│   ├── Updates.tsx
│   ├── Plans.tsx
│   ├── About.tsx
│   ├── FAQ.tsx
│   └── Contact.tsx
├── hooks/           # Custom React hooks
├── store/           # Zustand stores
├── services/        # API services and mock data
├── i18n/            # Internationalization files
├── lib/             # Utility functions
└── styles/          # Global styles and Tailwind config
```

## 🎨 Design System

### Colors
- **Primary**: `#034833` (Dark Green)
- **Secondary**: `#83CD20` (Light Green)
- **Background**: White with subtle gray tones
- **Text**: Various shades based on hierarchy

### Typography
- **Font**: Plus Jakarta Sans
- **Sizes**: 
  - Logo: 32px
  - Navigation: 15px
  - Buttons: 14px
  - Hero: 80px

### Components
- **Rounded corners**: Consistent border radius
- **Shadows**: Subtle elevation for cards
- **Hover states**: Smooth transitions on interactive elements

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📱 Features Implemented

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