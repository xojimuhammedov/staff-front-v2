#!/bin/bash
# Sync with GitHub (pull remote changes, then push)
set -e
cd "$(dirname "$0")"
echo "Pulling latest from origin/main..."
git pull --rebase origin main
echo "Pushing to origin/main..."
git push origin main
echo "Done."
