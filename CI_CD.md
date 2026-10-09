# CI/CD

How code is checked, built and deployed for this project. Everything runs on GitHub Actions; deployments go to a Linux server (VPS) running Nginx, over SSH.

- [Overview](#overview)
- [Branches and workflows](#branches-and-workflows)
- [What each pipeline does](#what-each-pipeline-does)
- [Releasing](#releasing)
- [One-time setup](#one-time-setup)
- [Rollback](#rollback)
- [Running a deploy manually](#running-a-deploy-manually)
- [Troubleshooting](#troubleshooting)
- [Customizing the pipeline](#customizing-the-pipeline)

## Overview

```
feature branch ──PR──▶ main ──merge──▶ staging-deploy ──merge──▶ production-deploy
       │                 │                    │                          │
       ▼                 ▼                    ▼                          ▼
      CI                CI            CI → deploy (staging)    CI → deploy (production)
```

- **CI** (format, lint, typecheck, build) runs on every pull request and every push to `main`.
- **Deploying** means pushing to a deploy branch. `staging-deploy` deploys to staging, `production-deploy` to production.
- A deploy always runs CI first. If CI fails, nothing is deployed.

## Branches and workflows

| Branch              | Purpose                        | Workflow file                                                      |
| ------------------- | ------------------------------ | ------------------------------------------------------------------ |
| feature branches    | Day-to-day work, opened as PRs | [`ci.yml`](.github/workflows/ci.yml) (on the pull request)         |
| `main`              | Integrated, reviewed code      | [`ci.yml`](.github/workflows/ci.yml)                               |
| `staging-deploy`    | What is running on staging     | [`deploy-staging.yml`](.github/workflows/deploy-staging.yml)       |
| `production-deploy` | What is running on production  | [`deploy-production.yml`](.github/workflows/deploy-production.yml) |

Both deploy workflows are thin wrappers. They call [`ci.yml`](.github/workflows/ci.yml) for the checks and [`deploy.yml`](.github/workflows/deploy.yml), a reusable workflow, for the deploy itself, passing the environment name (`staging` or `production`). Any change to the deploy steps therefore applies to both environments.

## What each pipeline does

### CI (`ci.yml`)

Runs on `ubuntu-latest` with the Node version from [`.nvmrc`](.nvmrc), with npm caching. Timeout: 15 minutes.

1. `npm ci`: clean install from `package-lock.json`
2. `npm run format:check`: Prettier (fails if any file isn't formatted; run `npm run format` locally to fix)
3. `npm run lint`: ESLint
4. `npm run build`: TypeScript typecheck (`tsc -b`) and the production build

Run the same checks locally before pushing:

```bash
npm run format:check && npm run lint && npm run build
```

### Deploy (`deploy.yml`)

Runs in the GitHub Environment named `staging` or `production`, so it uses that environment's secrets, variables and protection rules. Timeout: 20 minutes.

1. **Check settings.** If any required secret is missing, the job ends with a _"Deployment skipped"_ warning instead of failing. A fresh project from this template therefore stays green until a server is configured.
2. **Build** with the environment's `VITE_API_URL` and `VITE_APP_NAME` variables.
3. **Configure SSH** with the deploy key. The server's host key comes from `SSH_KNOWN_HOSTS`, or from `ssh-keyscan` if that secret isn't set (with a warning).
4. **Upload**: `rsync` copies `dist/` into a new folder `DEPLOY_PATH/releases/<UTC timestamp>-<short sha>/`.
5. **Activate**: the `DEPLOY_PATH/current` symlink is switched to the new release with an atomic rename, so visitors never see a half-uploaded site. Only the newest **5** releases are kept.
6. **Health check** (only if `APP_URL` is set): `curl` must get a successful response (5 retries).
7. **Summary**: the release id, commit and URL are added to the run summary.

**Concurrency:** only one deploy per environment runs at a time. A newer push waits for the running deploy to finish instead of cancelling it.

#### Server layout

```
DEPLOY_PATH/                        e.g. /var/www/admin
├── current -> releases/20261009143012-231c7ea    ← Nginx serves this
└── releases/
    ├── 20261009143012-231c7ea/     newest (active)
    ├── 20261008101544-2113892/
    └── …                           up to 5 kept
```

## Releasing

**Normal release:** merge `main` into staging, check it there, then promote the same code to production.

```bash
# 1. Deploy to staging
git checkout staging-deploy && git pull
git merge main
git push                        # triggers "Deploy Staging"

# 2. After checking staging, deploy to production
git checkout production-deploy && git pull
git merge staging-deploy
git push                        # triggers "Deploy Production"

git checkout main
```

The same can be done through pull requests on GitHub (`main` → `staging-deploy`, then `staging-deploy` → `production-deploy`) if you want a review step or a record of every release.

**Hotfix:** fix on a branch from `main`, merge it into `main` through a PR, then promote it as above. Avoid committing directly to the deploy branches, or they will drift from `main`.

**Rules of thumb**

- Only merge into `production-deploy` from `staging-deploy`, so production only ever receives code that ran on staging.
- Keep the deploy branches free of their own commits; they should only move forward by merges.

## One-time setup

Do this once per environment (staging and production). They can share a server, as long as each has its own `DEPLOY_PATH` and Nginx site.

### 1. Prepare the server (Ubuntu/Debian)

```bash
# Packages: Nginx serves the site, rsync receives the uploads
sudo apt update && sudo apt install -y nginx rsync

# A dedicated user for deployments (no password login)
sudo adduser --disabled-password --gecos "" deploy

# Deploy directory owned by that user (use a different path per environment)
sudo mkdir -p /var/www/admin
sudo chown deploy:deploy /var/www/admin
```

The deploy user needs no `sudo`. Switching the `current` symlink is enough; Nginx does not need to be reloaded.

### 2. Configure Nginx

Use the examples in [`deploy/`](deploy):

```bash
sudo cp deploy/security-headers.conf /etc/nginx/snippets/admin-security-headers.conf
sudo cp deploy/nginx.conf /etc/nginx/sites-available/admin
sudoedit /etc/nginx/sites-available/admin   # set server_name and root (= DEPLOY_PATH/current)
sudo ln -s /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# HTTPS (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d admin.example.com
```

The config already handles:

- **SPA routing**: unknown paths fall back to `index.html`, so links like `/users` work after a refresh.
- **Caching**: fingerprinted files in `/assets/` are cached for a year, and `index.html` is always revalidated, so a new release shows up immediately.
- **gzip and security headers.**

### 3. Create the deploy SSH key

On your own machine:

```bash
ssh-keygen -t ed25519 -f deploy_key -N "" -C "github-actions-deploy"
```

- Append `deploy_key.pub` to `/home/deploy/.ssh/authorized_keys` on the server (directory `700`, file `600`, owned by `deploy`).
- The contents of `deploy_key` (the private key) go into the `SSH_PRIVATE_KEY` secret.
- Get the host key line for `SSH_KNOWN_HOSTS` with `ssh-keyscan -H <server-ip-or-host>`. Verify the fingerprint against the server if you can.
- Then delete both key files from your machine. Use a separate key per project; never reuse personal keys.

### 4. Configure GitHub environments

In the repository go to **Settings → Environments**. Open `staging`, or create it if it doesn't exist (the first pipeline run creates both environments automatically). Add the values below, then repeat for `production`.

| Name              | Type     | Required    | Example                         | Notes                                                  |
| ----------------- | -------- | ----------- | ------------------------------- | ------------------------------------------------------ |
| `SSH_HOST`        | Secret   | Yes         | `203.0.113.10`                  | IP or hostname                                         |
| `SSH_USER`        | Secret   | Yes         | `deploy`                        |                                                        |
| `SSH_PRIVATE_KEY` | Secret   | Yes         | contents of `deploy_key`        | Include the BEGIN/END lines                            |
| `DEPLOY_PATH`     | Secret   | Yes         | `/var/www/admin`                | Different per environment on a shared server           |
| `SSH_PORT`        | Secret   | No          | `22`                            | Defaults to 22                                         |
| `SSH_KNOWN_HOSTS` | Secret   | Recommended | output of `ssh-keyscan -H host` | Prevents trusting an unknown host key                  |
| `VITE_API_URL`    | Variable | No          | `https://api.example.com`       | Empty = the app runs on mock data                      |
| `VITE_APP_NAME`   | Variable | No          | `Acme Admin`                    | Overrides the name in `app.config.ts`                  |
| `APP_URL`         | Variable | No          | `https://admin.example.com`     | Enables the health check and the link shown on the run |

`VITE_*` values are compiled into the JavaScript bundle and are visible to anyone using the app. Never put secrets (API keys, passwords) in them.

### 5. Protect production (recommended)

In **Settings → Environments → production**:

- **Required reviewers**: production deploys wait for approval from the listed people.
- **Deployment branches and tags**: limit to `production-deploy` so no other branch can use production secrets. Limit `staging` to `staging-deploy` the same way.

In **Settings → Branches**, consider protection rules for `main` (require PRs and passing CI) and for the deploy branches (restrict who can push).

## Rollback

**Fastest (on the server):** point `current` back to an earlier release.

```bash
cd /var/www/admin
ls -1t releases/                                  # newest first; pick the previous one
ln -sfn releases/<release-id> current.tmp && mv -Tf current.tmp current
```

This takes effect immediately, with no reload needed. The next deploy will switch `current` to its new release as usual.

**Through Git:** revert the bad commit on `main`, then promote it as a normal release. Use this to make the fix permanent.

## Running a deploy manually

Each deploy workflow can be started without a new commit, for example to redeploy after changing a secret or variable:

- GitHub: **Actions → Deploy Staging / Deploy Production → Run workflow** (choose the matching branch).
- CLI:

  ```bash
  gh workflow run deploy-staging.yml --ref staging-deploy
  gh workflow run deploy-production.yml --ref production-deploy
  gh run watch
  ```

## Troubleshooting

| Symptom                                                  | Cause and fix                                                                                                           |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Deploy job green, but the warning _"Deployment skipped"_ | Required secrets are missing in that environment. Add them (step 4).                                                    |
| `Prettier` step fails                                    | Run `npm run format` locally and commit.                                                                                |
| `Host key verification failed`                           | `SSH_KNOWN_HOSTS` doesn't match the server (for example after a rebuild). Regenerate it with `ssh-keyscan -H host`.     |
| `Permission denied (publickey)`                          | The public key isn't in the deploy user's `authorized_keys`, the file permissions are wrong, or `SSH_USER` is wrong.    |
| `rsync: command not found`                               | Install `rsync` on the server.                                                                                          |
| `mkdir: cannot create directory … Permission denied`     | `DEPLOY_PATH` isn't owned by the deploy user (`sudo chown -R deploy:deploy <path>`).                                    |
| Health check fails                                       | `APP_URL` is wrong, DNS/HTTPS isn't set up yet, or Nginx `root` doesn't point to `DEPLOY_PATH/current`.                 |
| Pages 404 after a browser refresh                        | The Nginx site is missing `try_files $uri $uri/ /index.html;`.                                                          |
| Old version still showing                                | The browser cached `index.html`. Make sure the `location = /index.html` block with `no-cache` is in your config.        |
| App calls the mock API in production                     | `VITE_API_URL` isn't set as a **variable** in that environment. It is read at build time, so redeploy after setting it. |

## Customizing the pipeline

| To change…                         | Edit                                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Node version                       | [`.nvmrc`](.nvmrc), used by every workflow                                                                                |
| Checks that run in CI              | [`ci.yml`](.github/workflows/ci.yml); add steps such as `npm test` here                                                   |
| Number of releases kept            | `KEEP_RELEASES` in [`deploy.yml`](.github/workflows/deploy.yml)                                                           |
| Extra build-time variables         | Add them under the **Build** step's `env` in `deploy.yml` and as environment variables in GitHub                          |
| A new environment (e.g. `qa`)      | Copy `deploy-staging.yml`, change the branch name, `environment` and concurrency group, and create the GitHub environment |
| Another host (Vercel, Netlify, S3) | Replace the SSH/rsync steps in `deploy.yml`; `dist/` is a static SPA that needs unknown paths rewritten to `/index.html`  |

Validate workflow changes before pushing with [actionlint](https://github.com/rhysd/actionlint): `actionlint` from the repository root.
