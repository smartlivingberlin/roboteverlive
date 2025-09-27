#!/usr/bin/env bash
set -euo pipefail
ID="$1"; TITLE="$2"
jq --arg i "$ID" --arg t "$TITLE" '. += [{"id":$i,"title":$t,"tags":["Neu"]}]' data/videos.json > data/.tmp && mv data/.tmp data/videos.json
echo "✅ Video hinzugefügt: $ID"
