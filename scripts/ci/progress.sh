#!/usr/bin/env bash
set -euo pipefail
TITLE="${1:-Working}"
TICKS="${2:-20}"
SLEEP="${CI_PROGRESS_INTERVAL:-0.5}"

detect_unicode() {
  case "${CI_PROGRESS_UNICODE:-auto}" in
    true|TRUE|True)  echo "1"; return ;;
    false|FALSE|False) echo "0"; return ;;
  esac
  CHARMAP="$(locale charmap 2>/dev/null || echo ANSI_X3.4-1968)"
  [ "$CHARMAP" = "UTF-8" ] || [ "$CHARMAP" = "UTF8" ] && echo "1" || echo "0"
}
UNICODE_OK="$(detect_unicode)"

if [ "$UNICODE_OK" = "1" ]; then
  SPIN=( '⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏' )
  FILLED='█'; EMPTY='░'; CHECK='✓'
else
  SPIN=( '-' '\' '|' '/' )
  FILLED='#'; EMPTY='.'; CHECK='OK'
fi

trap 'tput cnorm 2>/dev/null || true' EXIT
tput civis 2>/dev/null || true

for ((i=0;i<${TICKS};i++)); do
  s=${SPIN[$((i % ${#SPIN[@]}))]}
  pct=$(( (i+1)*100/TICKS ))
  filled=$(( pct/10 ))
  bar_filled=$(printf '%*s' "$filled" '' | tr ' ' "$FILLED")
  bar_empty=$(printf '%*s' "$((10-filled))" '' | tr ' ' "$EMPTY")
  printf "\r%s %s [%s%s] %3d%%" "$s" "$TITLE" "$bar_filled" "$bar_empty" "$pct"
  sleep "$SLEEP"
done
printf "\r%s %s [%s] 100%%\n" "$CHECK" "$TITLE" "$(printf '%*s' 10 '' | tr ' ' "$FILLED")"