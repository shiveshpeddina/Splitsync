# SplitSync Backend

The server component handles the API, database persistence with Prisma, and integration with external services like Firebase and AI models.

## Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Firebase Project (for Auth/Admin)

## Installation

```bash
cd server
npm install
```

## Database Migration

```bash
npx prisma db push
```

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Environment Variables

Make sure to set up your `.env` file based on `.env.example`.
- `DATABASE_URL`: Your PostgreSQL connection string.
- `FIREBASE_*`: Admin SDK credentials for user verification.
- `GEMINI_API_KEY`: For AI processing features.
