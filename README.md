# GrabVocab

GrabVocab is a Next.js 15 vocabulary-learning app with dictionary lookup, word-of-the-day, quizzes, MongoDB-backed content, optional social auth, and PWA support.

## Prerequisites

- Node.js 20+
- npm
- MongoDB connection string
- OpenAI API key

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and fill in the values:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

The app will run at `http://localhost:3000`.

## Environment Variables

Required:

- `MONGODB_URI`
- `OPENAI_API_KEY`

Recommended for NextAuth deployments:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Optional social login providers:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`

If the Google or Facebook variables are omitted, those providers are simply not registered.

## Scripts

- `npm run dev` starts the dev server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` runs ESLint

## Verification

Current repository status after the recent fixes:

- `npm run lint` passes
- `npx tsc --noEmit` passes
- `npm run build` passes
