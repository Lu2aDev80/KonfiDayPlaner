# Chaos Ops

A modern web application for managing and displaying schedules for events and gatherings. Built with React, TypeScript, and Vite.

## Features

- 📅 **Event Planning**: Create and manage day plans with multiple events
- 🎯 **Schedule Display**: Visual schedule cards with real-time updates
- ⏰ **Live Clock**: Built-in clock with auto-centering on current events
- 🏢 **Multi-Organisation**: Support for multiple organizations
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Flipchart UI**: Unique flipchart-style background design

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Icons**: Lucide React
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6
- **Deployment**: Docker with Nginx

## Project Structure

```
Chaos Ops/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   │   ├── forms/      # Form components
│   │   ├── layout/     # Layout components
│   │   ├── planner/    # Planner-specific components
│   │   └── ui/         # UI components
│   ├── constants/      # Application constants
│   ├── data/          # Static data and mock data
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API services (future)
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Application entry point
├── docker-compose.yml  # Docker composition
├── Dockerfile         # Docker configuration
├── nginx.conf         # Nginx configuration
└── vite.config.ts     # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL 16+ (if running locally without Docker)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Lu2aDev80/KonfiDayPlaner.git
cd KonfiDayPlaner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# For development
cp .env.example .env.local

# For production
cp .env.production.template .env.production
# Edit .env.production with your actual values
```

4. Set up the database (see [DATABASE_SETUP.md](./DATABASE_SETUP.md) for details):
```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run migrations
npm run db:migrate:dev

# Seed initial data (optional)
npm run db:seed
```

5. Start the development server:
```bash
# Start both frontend and API
npm run dev:all

# Or start them separately
npm run dev      # Frontend only
npm run api:dev  # API only
```

6. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Docker Deployment

For production deployment, see [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for a complete guide.

```bash
# Quick start
docker-compose up -d

# Check health
./health-check.ps1  # Windows PowerShell
# or
./troubleshoot.sh   # Linux/Mac
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate:dev` - Create and run migrations (dev)
- `npm run db:migrate` - Run migrations (production)
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (database GUI)

For detailed database setup and management, see [DATABASE_SETUP.md](./DATABASE_SETUP.md).

## Code Organization

### Barrel Exports

The project uses barrel exports (index.ts files) for cleaner imports:

```typescript
// Instead of:
import { Clock } from './components/planner/Clock';
import { Planer } from './components/planner/Planer';

// You can use:
import { Clock, Planer } from './components/planner';
```

### Component Structure

- **forms/**: Form components for data input
- **layout/**: Layout and wrapper components
- **planner/**: Schedule and planner-specific components
- **ui/**: Reusable UI components
- **pages/**: Top-level page components

### Directory Purpose

- **constants/**: Application-wide configuration and constants
- **data/**: Static data, mock data, and data models
- **hooks/**: Custom React hooks for reusable logic
- **services/**: API services and business logic (for future backend integration)
- **types/**: TypeScript type definitions and interfaces
- **utils/**: Helper functions (date formatting, validation, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is private and proprietary.

## Authors

- Lu2aDev80

## Acknowledgments

Built for managing events and gatherings efficiently.
