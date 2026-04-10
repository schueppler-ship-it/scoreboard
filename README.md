# Wasserball Scoreboard

A simple web application for tracking scores and time in water polo games, built with React, TypeScript, and Vite.

## Features

- Real-time timer with start/stop/reset functionality
- Score tracking for two teams
- Simple and intuitive interface
- Responsive design

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

- Click "Start" to begin the timer
- Click "Stop" to pause the timer
- Click "Reset" to reset the timer and scores
- Use the + and - buttons to adjust team scores

## Technologies Used

- React
- TypeScript
- Vite
- CSS
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
