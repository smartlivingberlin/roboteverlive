#!/usr/bin/env bash
set -euo pipefail
mkdir -p backup
TS=$(date +'%Y%m%d-%H%M%S')
zip -rq "backup/backup-${TS}.zip" . -x "backup/*" ".git/*" "node_modules/*"
echo "✅ Lokales Backup: backup/backup-${TS}.zip"
