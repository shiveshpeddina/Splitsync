# SplitSync Tech Stack

This document outlines the core technologies, frameworks, and third-party services used in the development of the SplitSync application.

## Frontend (Client-side)

* **Framework:** **React (v19)**
* **Build Tool:** **Vite** (for fast development and optimized production builds)
* **Routing:** **React Router (v7)** (for client-side navigation)
* **Styling & UI:**
  * Vanilla CSS (using CSS variables, modern typography, and curated color palettes for premium tech aesthetics)
  * **Framer Motion** (for dynamic micro-animations, page transitions, and interactive components)
  * **Lucide React** (for clean, consistent, and SVG-based iconography)
* **Data Visualization:** **Recharts** (for rendering spending analytics and expense charts)
* **API Communication:** **Axios** (for making HTTP requests to the backend)
* **Authentication Validation:** **Firebase Auth** (client-side SDK)
* **Utilities:** `libphonenumber-js` (for international phone number formatting and validation)

## Backend (Server-side)

* **Runtime Environment:** **Node.js**
* **Framework:** **Express.js** (for handling RESTful API routing and middleware)
* **Security & Middleware:** `cors`, `express-rate-limit` (for API endpoint protection)
* **Authentication & Verification:** **Firebase Admin SDK** (for verifying client auth tokens securely)
* **File Uploads:** **Multer** (for handling multipart/form-data when uploading receipt images)
* **Task Scheduling:** **node-cron** (for automating background tasks like recurring expenses)

## Database Layer

* **Database:** **PostgreSQL** (relational database for storing users, groups, expenses, and transaction logs)
* **ORM (Object-Relational Mapper):** **Prisma** (for type-safe database queries, migrations, and schema management)

## Third-Party Services & Integrations

* **Authentication:** **Firebase Authentication** (supplying Email/Password and Google Sign-in capabilities)
* **AI Integration:** **Gemini 2.5 Flash API** (powering reliable, multimodal smart receipt scanning and itemized extraction)
* **SMS Notifications:** **Twilio** (used for sending SMS reminders and automated nudge notifications)

## Hosting & Deployment 

To ensure the application is accessible on both mobile and desktop browsers with minimal overhead during development, the following free-tier friendly hosting stack is used:

* **Frontend Hosting:** **Vercel** (Automated CI/CD for Vite/React applications)
* **Backend API Hosting:** **Render** (Node.js web service deployment)
* **Database Hosting:** **Neon** (Serverless PostgreSQL)
