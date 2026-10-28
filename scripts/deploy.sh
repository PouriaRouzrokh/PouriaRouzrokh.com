#!/usr/bin/env bash
# deploy.sh: ship main to production from the Mac.
#
# Vercel builds and deploys every push to main (GitHub integration), so
# "deploying" means pushing a checked main. This script:
#   1. refuses a dirty tree or a branch other than main;
#   2. pulls first: the VPS cron commits research.json every Sunday;
#   3. runs lint, typecheck and a production build on the Mac;
#   4. pushes, which starts the Vercel production deploy.
#
# Usage: scripts/deploy.sh

set -euo pipefail
cd "$(dirname "$0")/.."

# Vercel builds with Node 22; use the same here when Homebrew's node@22 exists.
[[ -d /opt/homebrew/opt/node@22/bin ]] && export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "main" ]]; then
    echo "Refusing: on branch '$branch', not main." >&2
    exit 1
fi
if [[ -n "$(git status --porcelain)" ]]; then
    echo "Refusing: the working tree is dirty. Commit or stash first." >&2
    git status --short >&2
    exit 1
fi

echo "Pulling origin/main (the server's research commits)..."
git pull --rebase --quiet origin main

ahead=$(git rev-list --count origin/main..HEAD)
if [[ "$ahead" -eq 0 ]]; then
    echo "Nothing to deploy: main already matches origin/main."
    exit 0
fi

echo "Checking $ahead commit(s): lint, typecheck, build..."
npm run lint
npm run typecheck
npm run build

git push origin main
sha=$(git rev-parse --short HEAD)
echo "Pushed $sha. Vercel is deploying it to production:"
echo "  https://vercel.com/pouria-rouzrokhs-projects/pouriarouzrokh.com"
