# Day 1 Student Setup

Use this checklist the first time you set up `squelchapp` on your machine.

## Before You Start

- have Git installed
- have a GitHub account with access to the repository
- have your own Vercel account
- have been invited to the shared Vercel team that owns the project

## What These Tools Are For

- `Git`: downloads the repo, lets you pull updates, create branches, and push your work
- `GitHub`: hosts the shared repository, pull requests, and team code review
- `Vercel`: hosts the shared live app, creates preview deployments, and manages production deploys
- `Vercel CLI`: connects your local repo to the shared Vercel project and lets you deploy from your machine or through this assistant
- `Node.js`: runs the JavaScript tooling used to build and serve the app locally
- `npm`: installs project dependencies and runs the repo scripts like `npm run dev` and `npm run build`
- `Volta`: keeps the Node.js and npm versions consistent across Mac and Windows machines so everyone uses the same toolchain

## Create Your Vercel Account

1. Go to [vercel.com/signup](https://vercel.com/signup).
2. Create your own account.
3. You can sign up with a Git provider or with email.
4. Finish any required email or phone verification.

Do not sign into a shared class account. Each student should use their own login.

## Get Access To The Shared Project

1. Accept the Vercel team invitation sent by the instructor.
2. Open Vercel and switch to the shared class team.
3. Confirm you can see the shared `squelchapp` project in that team.

If you cannot see the project, ask the instructor to verify your team membership and project access.

## Install The Tooling

Recommended:

- install [Volta](https://volta.sh/)

Alternative:

- install a Node version manager that supports `.nvmrc`
- use Node `22.14.0`

## Clone And Install

```bash
git clone https://github.com/ewlamy42/squelchapp.git
cd squelchapp
npm ci
```

## Link To The Shared Vercel Project

Run:

```bash
npm run vercel:whoami
npm run vercel:link
npm run vercel:pull:preview
```

When `npm run vercel:whoami` runs, confirm it shows your own Vercel account.

When `npm run vercel:link` runs, choose the shared class team and then choose the shared `squelchapp` project.

This only needs to be done once per machine unless the Vercel project changes.

## Start Working

1. Pull the latest `main`.
2. Create a branch for your work.
3. Start the app:

```bash
npm run dev
```

4. Open the local URL shown by Vite.
5. Make your changes.

## View Squelch Locally

For normal coding, run:

```bash
npm run dev
```

This starts the development server. Vite usually shows a local URL like `http://localhost:5173`.

If you want to preview the production build locally before deploying, run:

```bash
npm run local
```

This opens the built app locally on `http://localhost:4173`.

## Before You Push

Run:

```bash
npm run build
```

Then:

1. commit your changes
2. push your branch
3. open a pull request
4. review the Vercel preview deployment

## Deploying With This Assistant

After your local checkout has been linked to Vercel, you can ask this assistant to deploy from this repo for you.

The assistant will use the same local scripts that you can run yourself:

```bash
npm run deploy:preview
npm run deploy:prod
```

If you want to deploy manually instead of asking the assistant, run those same commands yourself from the repo root.

Use preview deploys for normal iteration. Only use production deploys when your instructor or release owner wants a live update.

In this class, production deploys are allowed for students. That means you should still be deliberate:

- make sure your branch is in a good state
- run `npm run build`
- prefer preview deploys first when you are testing a risky change

## Daily Routine

Each work session:

1. `git checkout main`
2. `git pull`
3. create a new branch
4. `npm run dev`

## If Something Feels Off

Try:

```bash
git pull
npm ci
npm run build
```

If Vercel settings changed, rerun:

```bash
npm run vercel:pull:preview
```
