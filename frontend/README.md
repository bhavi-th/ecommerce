# E-Commerce Frontend

A modern e-commerce frontend built with React, Vite, and TailwindCSS.

## Features

- Product browsing with category filtering
- Shopping cart with add/remove/update quantity
- Responsive design (mobile-friendly)
- Modern UI with shadcn/ui-inspired components
- Local storage for cart persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (usually http://localhost:5173)

### Build for Production

```bash
npm run build
```

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Context API** - State management

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/         # React context providers
├── data/           # Mock data
├── utils/          # Utility functions
├── App.jsx         # Main application component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
