# AI Resume Analyzer & Career Recommendation App

## Overview

This is a full-stack web application that provides AI-powered resume analysis and career recommendations. Users upload their resumes (PDF or DOCX format), which are then analyzed using OpenAI's GPT-5 model to generate comprehensive insights including resume scores, skills analysis, career path recommendations, and optimization suggestions.

The application features a modern landing page with conversion-focused design, a resume upload interface with drag-and-drop functionality, and an interactive dashboard displaying analysis results.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Single-page application (SPA) with view-based routing (landing → upload → dashboard)

**UI Component Strategy:**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design system
- Design approach inspired by Material Design and Linear's minimalist aesthetics
- Custom theme system supporting light/dark modes with CSS variables
- Typography: Inter font for UI, JetBrains Mono for technical content

**State Management:**
- React Query (@tanstack/react-query) for server state management
- Local React state (useState) for UI state and view navigation
- No global state management library (Redux/Zustand) - keeping it simple with component-level state

**Component Architecture:**
- Modular component structure with clear separation of concerns
- Page components (Landing, Dashboard) compose feature components
- Reusable UI components in `/components/ui` directory
- Feature components (ResumeUpload, ResumeScore, SkillsAnalysis, etc.) handle specific functionality

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js for HTTP server
- TypeScript for type safety across frontend and backend
- ES Modules (type: "module") for modern JavaScript syntax

**API Design:**
- RESTful API endpoints under `/api` namespace
- File upload handling via Multer middleware (10MB limit)
- In-memory storage implementation with interface for future database migration
- Shared schema definitions between client and server via `/shared` directory

**File Processing:**
- PDF parsing using pdf-parse library
- Basic DOCX text extraction (buffer to UTF-8 conversion)
- File type validation (PDF and DOCX only)
- Resume text extraction before AI analysis

**AI Integration:**
- OpenAI API integration for resume analysis
- Uses GPT-5 model (released August 7, 2025)
- Structured JSON responses for consistent data format
- Comprehensive prompt engineering for detailed analysis including scores, skills, recommendations, and suggestions

### Data Storage Solutions

**Current Implementation:**
- In-memory storage using Map data structure
- `IStorage` interface defines contract for storage operations
- `MemStorage` class implements interface with UUID-based IDs

**Future Migration Path:**
- Drizzle ORM configured for PostgreSQL
- Schema defined in `/shared/schema.ts` with proper types
- Neon serverless PostgreSQL support via `@neondatabase/serverless`
- Database configuration ready in `drizzle.config.ts`
- Migration scripts prepared in `/migrations` directory

**Data Model:**
- Resume analyses stored with metadata (fileName, fileSize, timestamps)
- Structured JSON fields for complex data (scores, skills, recommendations)
- Type-safe schema using Drizzle Zod integration

### Authentication and Authorization

**Current State:**
- No authentication implemented
- Public access to all features
- Session middleware configured (connect-pg-simple) but not actively used

**Design Consideration:**
- Express session infrastructure is in place for future user authentication
- Storage interface supports user-scoped data when authentication is added

### External Dependencies

**AI Services:**
- OpenAI API (GPT-5 model) for resume analysis
- Requires `OPENAI_API_KEY` environment variable

**Database:**
- PostgreSQL (via Neon serverless when configured)
- Requires `DATABASE_URL` environment variable (currently optional - app runs with in-memory storage)
- Drizzle ORM for database operations and migrations

**Cloud Infrastructure:**
- Designed for Replit deployment
- Vite plugins for Replit-specific features (@replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)
- Runtime error overlay for development

**Third-Party UI Libraries:**
- Radix UI primitives for accessible components
- Lucide React for icons
- date-fns for date formatting
- react-hook-form with Zod resolver for form validation

**Development Tools:**
- TypeScript compiler for type checking
- ESBuild for server bundling in production
- PostCSS with Tailwind and Autoprefixer
- tsx for TypeScript execution in development

**Styling Dependencies:**
- Tailwind CSS with custom configuration
- class-variance-authority for component variants
- clsx and tailwind-merge for conditional class handling