# Overview

RÜTZ is a premium botanical extracts e-commerce platform with the brand essence "Rooted in Wisdom. Perfected by Science." The application unites indigenous heritage and German scientific precision to create trusted botanical extracts, featuring ethical sourcing through respectful partnerships with local communities and Fraunhofer research validation. Built with expanded brand identity featuring earth-green colors, botanical gold accents, indigenous partnership seals, and scientific credibility elements that emphasize heritage, scientific excellence, sustainability, fairness, and integrity.

## Recent Updates (August 2025)
- Enhanced typography system with WCAG AAA compliance (7:1 contrast ratios)
- Improved color accessibility with high-contrast design
- Added "Indigenous Wild Harvest" section to About page with comprehensive principles and product pathways
- Added Strategic Overview section to front page showcasing company's Indigenous wild harvest strategy
- Created interactive tabbed interface highlighting principles, products, and quality standards
- Applied color psychology principles for better user engagement
- Database fully operational with complete 71-plant dataset from global Indigenous communities
- **COMPLETED: Comprehensive Product Image Branding (August 16, 2025)**
  - All 18+ products now feature custom RÜTZ branded packaging with professional photography
  - Premium amber bottles for extracts and capsules with botanical gold labels
  - Sustainable kraft paper pouches for powders and teas with traditional designs
  - Elegant premium tin containers for specialty tea blends
  - Complete brand cohesion achieved across entire product catalog
  - All placeholder images replaced with authentic branded packaging photography
- **COMPLETED: Unified Product Portfolio & Universal RÜTZ Logo Navigation (August 17, 2025)**
  - Successfully merged Products page content into Chaga Portfolio creating "Premium Botanical Portfolio"
  - Removed separate Products navigation card and route, consolidating product showcase
  - Updated navigation to point "Products" to unified portfolio page
  - Added RÜTZ Logo with homepage hyperlink to all pages across the platform for quick navigation
  - All subpages now feature clickable RÜTZ Logo enabling instant return to homepage
  - Fixed DOM nesting warnings by enhancing Logo component structure
- **COMPLETED: Indigenous Healer Connection Service (August 17, 2025)**
  - Renamed "Your Journey" navigation card to "Ask Healer" for clarity
  - Completely transformed Journey page into comprehensive Indigenous healer connection platform
  - Added 8 distinct healer categories: Indigenous Healer, Shaman, Ceremony Leader, Ritual Specialist, Meditation Guide, Medicine Person, Listener, Elder Wisdom
  - Each category features specialized healing practices, practitioner counts, and availability status
  - Interactive healer cards with detailed specialties and connection options
  - Modal system for detailed healer information and direct connection capabilities
  - **INTEGRATED**: YouTube video successfully added to Ceremony card using provided link
- **COMPLETED: AI-Driven Multi-Language Localization System (August 17, 2025)**
  - Implemented comprehensive i18n support for German, French, and Spanish languages
  - Added language selector component with flag icons in navigation menu for seamless language switching
  - Created extensive translation database with 100+ keys covering all major UI elements
  - Enhanced Header component with internationalization support and responsive language selection
  - All navigation items, healer categories, and user interface elements now fully localized
  - Language preference persisted in localStorage for consistent user experience
- **COMPLETED: Dynamic Content Management System for Plant Explorer (November 11, 2025)**
  - Implemented JSON-based content loading system for Plant Explorer page
  - Created plant_explorer_content.json with structured content (hero, intro, features, microcopy)
  - Added TypeScript interfaces with full optional chaining for resilient content access
  - Hero section, intro section, search placeholders, and empty states now load dynamically
  - All content sections gracefully fallback to defaults when JSON is missing or incomplete
  - System supports easy content updates without code changes
  - Maintains all existing filtering and plant grid functionality (175 plants across Canadian Indigenous communities)

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