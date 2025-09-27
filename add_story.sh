#!/usr/bin/env bash
set -euo pipefail
SLUG="$1"; TITLE="$2"
jq --arg s "$SLUG" --arg t "$TITLE" '. += [{"slug":$s,"title":$t,"author":"SmartAssist Team","date":(now|strftime("%Y-%m-%d")),"image":"https://picsum.photos/seed/" + $s + "/1600/900","excerpt":"Kurzbeschreibung…","body":["Absatz 1","Absatz 2"],"links":[],"tags":["Story"]}]' data/stories.json > data/.tmp && mv data/.tmp data/stories.json
echo "✅ Story hinzugefügt: $SLUG"
