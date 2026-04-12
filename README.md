# SplitSync - Expense Splitter App

A full-stack expense splitting application designed for groups and friends. This project is divided into a React frontend and a Node.js backend.

## Project Structure

- `/client`: Frontend built with Vite, React, and Framer Motion.
- `/server`: Backend built with Express, Prisma, and PostgreSQL.
- `/docs`: Project documentation and development logs.

## Setup Instructions

### 1. Backend Setup
Go to the `server/` directory:
1. Copy `.env.example` to `.env` and fill in your credentials (Database, Firebase, OpenAI/Gemini).
2. Run `npm install` to install dependencies.
3. Run `npm run db:push` to sync the database schema.
4. Run `npm run dev` to start the development server.

### 2. Frontend Setup
Go to the `client/` directory:
1. Copy `.env.example` to `.env` and fill in your Firebase configuration.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the frontend.

## Features
- Group expense splitting with multiple split types (Equally, Percentage, Exact).
- AI Receipt Scanning (Gemini/OpenAI integration).
- Settlement tracking and balance management.
- Real-time updates and premium UI design.
