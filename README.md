
# Squelchapp

This repository contains the `squelchapp` class project, a Vite + React single-page app that the team can develop locally and deploy to one shared production environment.

## Standard Local Setup

This repo is prepared for a consistent Mac and Windows setup.

Each student should use their own Vercel account. Do not share a single class login.

Use:

- Node.js `22.x` or `24.x`
- npm `10.x` or `11.x`

If you already use a version manager like `nvm`, `.nvmrc` is included as an optional convenience file, but it is not required for this workflow.

Then run:

```bash
npm ci
npm run dev
```

## View Squelch Locally

There are two useful local ways to view the app:

1. Development mode for day-to-day coding:

```bash
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

2. Production-style preview before deployment:

```bash
npm run local
```

This serves the built app locally on `http://localhost:4173`.

Use `npm run dev` while building features. Use `npm run local` when you want to see what the production bundle will look like on your machine before deploying.

## Useful Scripts

- `npm run dev`: start the app locally
- `npm run dev:host`: start the app on your local network
- `npm run build`: create a production build
- `npm run local`: build and preview the production app locally
- `npm run preview`: preview the production build locally
- `npm run check`: run the baseline verification step
- `npm run vercel:whoami`: confirm which Vercel account the local CLI will use
- `npm run vercel:link`: link the local repo to the shared Vercel project
- `npm run vercel:pull:preview`: pull preview environment settings from Vercel
- `npm run vercel:pull:production`: pull production environment settings from Vercel
- `npm run deploy:preview`: create a preview deployment from the CLI
- `npm run deploy:prod`: create a production deployment from the CLI

## Shared Production Model

Recommended class workflow:

- GitHub is the source of truth
- Vercel hosts the shared production environment
- each branch or pull request gets a preview deployment
- `main` deploys to the shared production URL

This lets each person work independently in their own branch without waiting for others to finish before sharing changes.

## Deployment Note

This repo includes `vercel.json` with an SPA rewrite so React Router deep links work in production.

The Vercel CLI is installed as a project dependency, so this assistant can run the same deployment commands directly from the repo when asked.

The recommended model is:

- each student signs into their own Vercel account
- the shared `squelchapp` project lives under one shared Vercel team
- each student is invited to that team and links their local checkout to the shared project

## Deploy Squelch

After your repo is linked to the shared Vercel project, you can deploy in two ways:

Preview deploy:

```bash
npm run deploy:preview
```

Production deploy:

```bash
npm run deploy:prod
```

You can also ask this assistant to run those deploy commands directly from the repo.

## Classroom Documentation

See [`docs/classroom-workflow.md`](./docs/classroom-workflow.md) for the recommended GitHub, Vercel, and collaboration setup for the class.

See [`docs/vercel-setup.md`](./docs/vercel-setup.md) for the first-time Vercel linking and production setup flow.

For class handouts:

- [`docs/day-1-student-setup.md`](./docs/day-1-student-setup.md)
- [`docs/instructor-production-setup.md`](./docs/instructor-production-setup.md)
  
