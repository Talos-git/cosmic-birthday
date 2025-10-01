# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a birthday age calculator built with Vite, React, TypeScript, and shadcn-ui. It calculates detailed age statistics from a birth date, including years/months/days, countdown to next birthday, and next milestone birthday.

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm build

# Build for development
npm run build:dev

# Lint code
npm lint

# Preview production build
npm preview
```

## Architecture

### Component Structure

- **Pages** (`src/pages/`): Route-level components
  - `Index.tsx`: Main page with date input and age display
  - `NotFound.tsx`: 404 page

- **Components** (`src/components/`):
  - `DateInput.tsx`: Date picker for birthday input
  - `AgeDisplay.tsx`: Displays calculated age statistics
  - `StatCard.tsx`: Reusable card for displaying individual stats
  - `ui/`: shadcn-ui components library (50+ components)

### Core Logic

- **Age Calculations** (`src/utils/ageCalculations.ts`):
  - `calculateAge()`: Main function that computes all age-related statistics using date-fns
  - Returns `AgeStats` interface with years, months, days, hours, minutes, seconds, total days, day of week born, next birthday countdown, and next milestone
  - Milestones: [18, 21, 25, 30, 40, 50, 60, 70, 80, 90, 100]

### Routing & State

- React Router v6 for routing (configured in `App.tsx`)
- TanStack Query (React Query) for state management
- All routes must be added above the catch-all "*" route in `App.tsx:19`

### Styling

- Tailwind CSS with custom animations
- Glass morphism effects (`.glass` class)
- Gradient backgrounds and floating particle animations
- Path alias: `@/` maps to `src/`

### TypeScript Configuration

- Relaxed type checking: `noImplicitAny: false`, `strictNullChecks: false`
- Import alias `@/*` resolves to `./src/*`
