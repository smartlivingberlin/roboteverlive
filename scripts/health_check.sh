#!/usr/bin/env bash
set -e
BASE="https://smartlivingberlin.github.io/roboteverlive"
echo "🔎 Prüfe Live-Seiten…"
for p in "" "stories.html" "videos.html" "trends.html" "katalog.html"; do
  url="$BASE/${p}"
  code=$(curl -o /dev/null -s -w "%{http_code}" "$url")
  echo "  $url  → HTTP $code"
done
echo "🔎 Prüfe Dateien lokal…"
for f in stories.html assets/stories.js data/stories.json videos.html assets/videos.js data/videos.json; do
  [ -s "$f" ] && echo "  ✅ $f vorhanden" || echo "  ❌ $f fehlt/leer"
done
