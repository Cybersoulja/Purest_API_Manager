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

## Verification

Run these from the project folder after `npm install`:

*   **Type check:** `npx tsc --noEmit` (should print nothing).
*   **Build:** `GEMINI_API_KEY=dummy npm run build` (should finish without errors). A dummy key is fine here because nothing calls Gemini during the build.

## Portable Drive Workspace (USB20FD)

When this project lives at `dev/projects/Purest_API_Manager` on the `USB20FD` drive, follow the drive's own `AGENTS.md` rules, except the "no secrets on the drive" rule, which is relaxed for this project:

*   **`.env.local` is allowed on the drive.** The owner chose to drop the "no secrets on the drive" rule for this project, so `GEMINI_API_KEY` may live in `.env.local` next to the project. `.gitignore` already ignores `*.local`, so it is not committed. Never commit it or paste the key into a file that is committed. Anyone who gets the drive can read the key, so keep the drive with you and revoke the key if the drive is lost.
*   **Do not keep `node_modules/` or `dist/` on the drive.** Copy the project to the Mac's internal disk (for example `~/Developer/Purest_API_Manager`) and run `npm install`, the verification commands and `npm run dev` from that copy, never from the drive folder, because they create `node_modules/` and `dist/` inside the project folder. Copy changes back to the drive (or commit and push) when you are done. `dist/` also contains the API key, because `vite.config.ts` bakes `GEMINI_API_KEY` into the built bundle, so never publish or share it.
*   **Saved data lives in the browser profile.** The app stores configs, secrets and templates in `localStorage` (keys starting with `purest_`). That data is written to the browser's profile folder. With secrets allowed on the drive, the profile may be kept on the drive too.
