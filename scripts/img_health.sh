#!/usr/bin/env bash
set -e
BASE="https://smartlivingberlin.github.io/roboteverlive"
echo "🔎 Live-Check:"
for p in "" "katalog.html" "news.html" "trends.html"; do
  url="$BASE/${p}"; code=$(curl -o /dev/null -s -w "%{http_code}" "$url")
  echo "  $url → HTTP $code"
done
echo "🔎 Dateien lokal:"
for f in data/highlights.json assets/img-effects.css assets/highlights.js assets/news-hero.js assets/trends-img.js; do
  [ -s "$f" ] && echo "  ✅ $f ok" || echo "  ❌ fehlt: $f"
done
