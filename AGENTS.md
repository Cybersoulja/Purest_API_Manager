# AGENTS.md

This file provides context and instructions for AI agents working on this codebase.

## Project Overview

*   **Framework:** React + Vite
*   **Language:** TypeScript
*   **Key Libraries:** `@google/genai` (Gemini API integration), `react`, `react-dom`
*   **Main Entry Point:** `index.tsx`
*   **Main Component:** `App.tsx`

## Directory Structure

*   `components/`: Reusable React components.
*   `services/`: Service logic (likely API interactions).
*   `App.tsx`: Main application component.
*   `index.tsx`: Application entry point.

## Setup Instructions

1.  **Install Dependencies:** Run `npm install` to install project dependencies.
2.  **Environment Variables:** Create a `.env.local` file and add your Gemini API key:
    `GEMINI_API_KEY=your_api_key_here`

## Running the Application

*   **Development Server:** Run `npm run dev` to start the local development server.
*   **Build:** Run `npm run build` to build the application for production.
*   **Preview:** Run `npm run preview` to preview the production build locally.

## Development Guidelines

*   **TypeScript:** Use TypeScript for type safety. Ensure all new components and functions are properly typed.
*   **Components:** Place new components in the `components/` directory.
*   **State Management:** Use React hooks (useState, useEffect, useContext) for state management.
*   **Styling:** Follow the existing styling conventions.
*   **Code Quality:** Ensure code is clean, readable, and well-documented.
