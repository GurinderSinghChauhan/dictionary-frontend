# GrabVocab

GrabVocab is a Next.js 15 vocabulary-learning app with dictionary lookup, word-of-the-day, quizzes, MongoDB-backed content, optional social auth, and PWA support.

## Prerequisites

- Node.js 20+
- npm
- MongoDB connection string

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

## Automated Vercel Deployment

This repo includes a GitHub Actions workflow at [`.github/workflows/vercel-deploy.yml`](/Users/anurag/gschauhan/dictionary-frontend/.github/workflows/vercel-deploy.yml).

Behavior:

- pull requests into `main` create a Vercel preview deployment
- pushes to `main` create a Vercel production deployment
- `workflow_dispatch` lets you run it manually from GitHub

Required GitHub repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Get the Vercel values by linking the project locally once:

```bash
npm install --global vercel
vercel login
vercel link
cat .vercel/project.json
```

Also make sure your Vercel project has these runtime environment variables configured in the Vercel dashboard:

- `MONGODB_URI`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- optional Google/Facebook auth variables if you want social login enabled
