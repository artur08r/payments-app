#!/usr/bin/env bash
# Что изменилось с BASE (база PR или прошлый коммит main) → что собирать.
#   platform=true  — тесты libs/platform;
#   services=[...] — Java-сервисы: изменённые, а при правке libs/platform или CI — все;
#   frontend=true  — фронтенд.
# BASE пустой или «нулевой» (новая ветка, первый запуск) — собираем всё.
set -euo pipefail

BASE="${1:-}"
ALL_SERVICES=$(ls services)

if [[ -z "$BASE" || "$BASE" =~ ^0+$ ]] || ! git cat-file -e "$BASE^{commit}" 2>/dev/null; then
  FILES=$(git ls-files)
else
  # Три точки: только изменения этой ветки, без того, что за это время появилось в main
  FILES=$(git diff --name-only "$BASE"...HEAD)
fi

touched() { grep -q "^$1" <<<"$FILES"; }

everything=false
if touched libs/platform/ || touched .github/; then
  everything=true
fi

services=()
for s in $ALL_SERVICES; do
  if $everything || touched "services/$s/"; then
    services+=("$s")
  fi
done

platform=false
if touched libs/platform/ || touched .github/; then platform=true; fi
frontend=false
if touched frontend/ || touched .github/; then frontend=true; fi

json=$(printf '%s\n' "${services[@]}" | jq -R . | jq -sc 'map(select(. != ""))')
{
  echo "services=$json"
  echo "platform=$platform"
  echo "frontend=$frontend"
} >> "${GITHUB_OUTPUT:-/dev/stdout}"
echo "Изменено: сервисы $json, платформа $platform, фронтенд $frontend"
