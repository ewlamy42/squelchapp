# Vercel Setup

This guide prepares the shared production environment for the class and gives everyone the same local-to-preview-to-production workflow.

## One-Time Instructor Setup

1. Sign in to Vercel.
2. Create one shared team or choose the team the class will use.
3. Import the GitHub repository into Vercel.
4. Confirm these settings:

- Framework Preset: `Vite`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Production Branch: `main`

5. Complete the first production deployment.
6. Add the production domain when ready.

Keep the project under the shared team, not under a personal account.

## One-Time GitHub Setup

Turn on these repository settings:

- protect `main`
- require pull requests before merging
- require the `CI` GitHub Actions check to pass
- optionally require one approval before merge

## One-Time Local Setup Per Student

From the repo root:

```bash
npm ci
npm run vercel:whoami
npm run vercel:link
npm run vercel:pull:preview
```

What these do:

- `npm run vercel:link` connects the local checkout to the shared Vercel project
- `npm run vercel:pull:preview` downloads project settings and preview environment variables into `.vercel/`

Before students do that, they should:

1. create their own Vercel account at [vercel.com/signup](https://vercel.com/signup)
2. accept the invitation to the shared class team
3. confirm they can see the shared `squelchapp` project in the Vercel dashboard

When students run `npm run vercel:whoami`, it should show their own account, not a shared class login.

When students run `npm run vercel:link`, they should select the shared class team and the shared `squelchapp` project.

For production variables later:

```bash
npm run vercel:pull:production
```

## Daily Workflow

1. Pull the latest `main`.
2. Create a branch.
3. Run `npm run dev`.
4. Make changes.
5. Run `npm run build`.
6. Push the branch and open a pull request.
7. Review the Vercel preview deployment.
8. Merge to `main` when approved.
9. Let Vercel deploy `main` to production.

## Local Viewing Before Deploy

Students should know the difference between the two local run modes:

Development server:

```bash
npm run dev
```

This is the fastest loop for making changes and usually runs on `http://localhost:5173`.

Production-style local preview:

```bash
npm run local
```

This serves the built app locally on `http://localhost:4173` and is useful as a final check before deployment.

## Optional CLI Deploy Flow

If someone with access needs to deploy from the command line:

```bash
npm run deploy:preview
npm run deploy:prod
```

These commands rely on the repo already being linked to the shared Vercel project.

Because the Vercel CLI is installed locally in the repo, this assistant can also run those same commands directly when asked.

## Production Deployment Permissions

If students should be able to deploy to production directly, give them a Vercel role that includes production deployment permission for the shared project.

That is a deliberate policy choice. It speeds up iteration, but it also means students can push live changes without an instructor in the loop, so make sure the class understands the expectation.

## Why This Works Well For A Class

- every person gets the same local commands on Mac or Windows
- every branch can get an isolated preview URL
- the shared production site only changes when `main` changes
- students do not have to wait for each other to test ideas
