# SkillSetu - Cooperative Marketplace Prototype

## Overview

This is a **proof-of-concept prototype** for **SkillSetu**, a cooperative-owned digital marketplace for verified household and community services. The application demonstrates core features for customers, workers, and cooperative administrators.

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **UI Components**: Lucide React Icons, Recharts for charts
- **Routing**: React Router
- **State Management**: Custom Redux-like context with localStorage persistence
- **Styling**: Custom CSS with responsive design

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd /home/chandru/Documents/programming/python/hackathon/SIH26089
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## How to Use

### Role Switching

- Use the **role switcher** in the sidebar to navigate between:
  - **Customer**: Find and book services
  - **Worker**: Manage job assignments and earnings
  - **Cooperative Admin**: Monitor workers, bookings, and analytics

### Key Features

- **Customer Experience**: Service search, worker profiles, booking flow
- **Worker Dashboard**: Job management, earnings tracking
- **Cooperative Admin**: Worker verification, booking analytics
- **AI Demand Intelligence**: Simulated service demand forecasting
- **Local Storage Persistence**: All state (bookings, workers, notifications) saved

## Project Structure

```
src/                  # Source code
├── components/        # Reusable UI components
├── data/              # Mock data
├── pages/             # Role-specific pages
├── store/              # State management
├── App.tsx            # Main application
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Running the Application

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Notes

This is a **non-production prototype** designed for hackathon demonstration. Features include:
- LocalStorage persistence for demo continuity
- Responsive UI with clean design
- Interactive workflows for all roles

For a production system, additional infrastructure would be required (database, payment gateway, etc.).
>>>>>>> de4f977 (Initial commit)
