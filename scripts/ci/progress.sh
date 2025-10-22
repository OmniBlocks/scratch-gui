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

# Keep the original gif spinners for GitHub comments, but also provide terminal spinners
# The original gif spinners are:
# initial_spinner: https://lh5.googleusercontent.com/proxy/OUqG0HgVNVMNorlPCmI4VgJa-3h7uHLkkMy9vdJ0eRsQlvJBytFUS-HvuW-O9EJd-c9xB7KAqlwby4Fzp59g1705FzBuP-F8dC1ZaBQtmLeCu5i6FfSd6Mmzh8mjOwgrEYZwy5UStg
# checklist_spinner: https://github.com/user-attachments/assets/881cd049-000f-4b24-a868-9831c3ea9019

if [ "$UNICODE_OK" = "1" ]; then
  # Use the iconic ⠋ spinner that matches the original workflow personality
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