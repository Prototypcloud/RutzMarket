# Overview

RÜTZ is a premium botanical extracts e-commerce platform with the brand essence "From Nature's Roots to Your Well-Being." The application merges the science of nature with heritage craftsmanship to deliver pure, potent botanical innovations. Built with the new RÜTZ brand identity featuring earth-green primary colors, botanical gold accents, and Inter typography that emphasizes trustworthy & scientific, premium & minimalist, and natural & authentic brand personality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing without the overhead of React Router
- **State Management**: Zustand for cart state with persistence to localStorage
- **UI Components**: Radix UI primitives with shadcn/ui for consistent, accessible component library
- **Styling**: Tailwind CSS with custom color variables for brand theming (forest green, sage, cream colors)
- **Animations**: Framer Motion for smooth page transitions and micro-interactions
- **Data Fetching**: TanStack Query (React Query) for server state management with optimistic updates

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints for products, supply chain data, and impact metrics
- **Data Layer**: In-memory storage implementation with interface for future database integration
- **Session Management**: Express sessions with PostgreSQL store configuration ready
- **Error Handling**: Centralized error middleware with structured error responses

## Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Comprehensive product catalog with supply chain tracking, impact metrics, and cart functionality
- **Tables**: Products, supply chain steps, impact metrics, and cart items with proper relationships
- **Migrations**: Drizzle Kit for schema migrations and database management

## Development Setup
- **Build Tool**: Vite for fast development and optimized production builds
- **Package Manager**: npm with lockfile for dependency consistency
- **TypeScript**: Strict configuration with path mapping for clean imports
- **Code Quality**: ESM modules throughout for modern JavaScript standards

## UI/UX Design Patterns
- **Design System**: shadcn/ui components with custom RÜTZ branding
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Color Scheme**: Earth-tone palette reflecting botanical/natural theme
- **Typography**: Inter font family for clean, readable interface
- **Component Structure**: Modular components with clear separation of concerns

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM for frontend rendering
- **Express.js**: Backend web framework with middleware support
- **TypeScript**: Full-stack type safety and development experience

## Database & ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM with schema validation
- **Drizzle Kit**: Database migration and introspection tools
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI Component Library
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe variant API for component styling

## State Management & Data Fetching
- **Zustand**: Lightweight state management with persistence
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation

## Animation & Interaction
- **Framer Motion**: Animation library for smooth transitions and gestures
- **Embla Carousel**: Touch-friendly carousel component

## Development Tools
- **Vite**: Fast build tool and development server
- **PostCSS**: CSS processing with Tailwind CSS integration
- **ESBuild**: Fast JavaScript bundler for production builds

## Utility Libraries
- **clsx**: Conditional className utility
- **date-fns**: Modern date utility library
- **nanoid**: URL-safe unique ID generator
- **zod**: TypeScript-first schema validation

## Third-Party Integrations
- **Wouter**: Minimalist routing library for React
- **Replit Development**: Integrated development environment with runtime error overlay