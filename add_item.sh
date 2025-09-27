#!/usr/bin/env bash
# Nutzung: ./add_item.sh "Titel" "YYYY-MM-DD" "https://link" "Kurztext"
set -e
FILE="data/news.json"
TITLE="$1"; DATE="$2"; LINK="$3"; SUMMARY="$4"
[ -z "$TITLE" ] && { echo "Titel fehlt"; exit 1; }
[ -z "$DATE" ] && DATE=$(date +%F)
[ -z "$LINK" ] && LINK="https://example.com"
[ -z "$SUMMARY" ] && SUMMARY=""

TMP=".news.tmp"
jq . "$FILE" >/dev/null 2>&1 || echo "[]" > "$FILE"
jq --arg t "$TITLE" --arg d "$DATE" --arg l "$LINK" --arg s "$SUMMARY" \
  '. = [{"title":$t,"date":$d,"link":$l,"summary":$s}] + .' "$FILE" > "$TMP" && mv "$TMP" "$FILE"
echo "✓ hinzugefügt: $TITLE ($DATE)"
