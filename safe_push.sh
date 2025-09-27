#!/usr/bin/env bash
set -euo pipefail

# Abbrechen, wenn kein Git-Repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "❌ Nicht in einem Git-Repository."; exit 1; }

# Aktuellen Branch ermitteln
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "🔎 Status prüfen…"
if ! git diff --quiet || ! git diff --cached --quiet; then
  MSG="chore: autosave $(date +'%Y-%m-%d %H:%M:%S')"
  echo "💾 Es gibt uncommitted Änderungen → auto-commit: '$MSG'"
  git add -A
  git commit -m "$MSG" || true
else
  echo "✅ Keine uncommitted Änderungen."
fi

echo "⬇️  Pull (rebase) von origin/${BRANCH}…"
git fetch origin
git pull --rebase origin "${BRANCH}"

echo "⬆️  Push nach origin/${BRANCH}…"
git push origin "${BRANCH}"

echo "🎉 Fertig."
