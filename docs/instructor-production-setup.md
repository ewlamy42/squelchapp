# Instructor Production Setup

Use this checklist to create and manage the shared class environment.

## Goal

Set up one shared production deployment and one shared preview workflow so students can work independently without blocking each other.

## What The Tools Are For

- `GitHub`: the source of truth for the repo, pull requests, review flow, and branch protection
- `Vercel`: the shared hosting platform for preview and production deployments
- `Vercel CLI`: the local command-line bridge between a student checkout and the shared Vercel project
- `Node.js` and `npm`: the runtime and package manager used to install dependencies, build the app, and run local scripts
- `Volta`: the cross-platform version manager used to keep Node.js and npm consistent for the class on both Mac and Windows

## 1. Prepare GitHub

- confirm the repository is the class source of truth
- make sure all students have the right GitHub access
- protect the `main` branch
- require pull requests before merging
- require the `CI` check to pass before merging
- optionally require at least one approval

## 2. Create The Shared Vercel Project

1. Sign in to Vercel.
2. Create or select the shared team.
3. Import the GitHub repository.
4. Confirm these project settings:

- Framework Preset: `Vite`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Production Branch: `main`

5. Finish the first deployment.

Important:

- the project should live under the shared team, not under a personal account
- students should authenticate with their own Vercel accounts

## 3. Confirm Production Behavior

- open the production URL
- verify the app loads
- verify direct navigation to a non-root route also works

This repo includes `vercel.json` to support SPA route rewrites for React Router.

## 4. Prepare Students

Ask each student to run:

```bash
npm ci
npm run vercel:whoami
npm run vercel:link
npm run vercel:pull:preview
```

Before that, make sure each student has:

- created their own Vercel account
- accepted the team invite
- been granted access to the shared project

Vercel’s current team management flow is to invite members from the team settings and assign their role there.

If students need local access to production variables later, they can also run:

```bash
npm run vercel:pull:production
```

## 5. Working Model For The Class

- students develop locally in their own branches
- every branch or pull request gets a Vercel preview deployment
- `main` remains the only branch that updates the shared production site

## 6. Review Model

Recommended review loop:

1. student opens a pull request
2. CI passes
3. Vercel preview is reviewed
4. instructor or reviewer approves
5. pull request is merged to `main`
6. Vercel deploys the new production version

## 7. Good Defaults For A Fast-Moving Class

- keep `main` always deployable
- ask students to work in small branches
- use preview URLs for feedback instead of asking students to share local screenshots
- prefer merge-after-review over direct pushes to production

## 8. Assistant-Driven Deploys

Because the Vercel CLI is installed in the repo, students can also ask this assistant to deploy directly from their local checkout after linking the repo to the shared Vercel project.

That means the assistant can run:

- `npm run deploy:preview`
- `npm run deploy:prod`

Preview deploys are great for iteration. In this class, you want students to be able to trigger production deploys too, so make sure their Vercel role includes production deployment permission for this project.

Vercel’s access-role documentation explicitly includes a production deployment permission for appropriately privileged members. Grant that only to the students who should be able to push live updates.
