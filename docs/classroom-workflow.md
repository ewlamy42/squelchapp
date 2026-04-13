# Classroom Workflow

## Goal

This project is set up so each class member can:

- run the app locally on Mac or Windows with the same Node/npm versions
- work independently on a branch without blocking the rest of the class
- share changes through a preview deployment before merging
- deploy merged work to one shared production environment

## Recommended Platform Model

Use:

- GitHub for source control and pull requests
- Vercel for hosting, preview deployments, and production deployment

Identity model:

- each student uses their own Vercel account
- the project lives in one shared Vercel team
- local clones are linked to the shared team project

Why this fits the class well:

- every branch or pull request can get its own preview URL
- the `main` branch can be the shared production source of truth
- the app is a Vite single-page app, so deployment is simple and fast
- nobody has to wait for another student to stop using the environment

## Team Workflow

1. Clone the repository.
2. Install the pinned Node/npm toolchain with Volta or use the version in `.nvmrc`.
3. Create a branch for your work.
4. Run the app locally with `npm run dev`.
5. Push your branch to GitHub.
6. Open a pull request.
7. Review the preview deployment from Vercel.
8. Merge to `main` when ready.
9. Let Vercel deploy `main` to the shared production URL.

## GitHub Settings To Turn On

Recommended repository settings:

- protect `main`
- require pull requests before merging
- require the CI workflow to pass before merging
- optionally require one review from another class member or instructor

## Vercel Settings To Turn On

Recommended project settings:

- connect the GitHub repository to one shared Vercel project
- set `main` as the production branch
- allow preview deployments for pull requests and pushed branches
- add the shared production domain once the class is ready
- invite students to the shared team instead of sharing one login
- grant production deployment permission to students if you want them to be able to push live updates themselves

## Local Environment Standard

This repository pins Node and npm through Volta in `package.json` and also includes `.nvmrc`.

That gives the class two good setup paths:

- Volta for the easiest cross-platform setup on Windows and Mac
- `.nvmrc` for people already using `nvm`

Quick checklists:

- student setup: [`docs/day-1-student-setup.md`](./day-1-student-setup.md)
- instructor setup: [`docs/instructor-production-setup.md`](./instructor-production-setup.md)

## NPM Scripts

- `npm run dev`: start the dev server
- `npm run dev:host`: start the dev server on the local network
- `npm run build`: create the production build
- `npm run preview`: preview the production build locally
- `npm run check`: verify the app builds successfully

## Notes For This Project

- `vercel.json` includes an SPA rewrite so deep links handled by React Router work in production
- `package-lock.json` should be committed so everyone installs the same dependency graph
