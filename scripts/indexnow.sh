#!/usr/bin/env bash
# Zgłasza zmienione adresy lam-english.com do IndexNow (Bing, a przez niego ChatGPT Search i Copilot;
# także Yandex, Seznam, Naver). Uruchamiaj PO wdrożeniu zmian na produkcję.
#
#   scripts/indexnow.sh                      # wszystkie adresy z sitemap.xml
#   scripts/indexnow.sh /courses.html /      # tylko wybrane ścieżki
#
# Klucz leży w pliku <klucz>.txt w katalogu głównym strony — musi być dostępny pod
# https://lam-english.com/<klucz>.txt, zanim wyślesz zgłoszenie.
set -euo pipefail

HOST="lam-english.com"
KEY="6d6ef3e9f66d05c34dbad7ef2b131ac0"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ "$#" -gt 0 ]; then
  URLS=()
  for p in "$@"; do URLS+=("https://${HOST}/${p#/}"); done
else
  URLS=()
  while IFS= read -r u; do URLS+=("$u"); done < <(sed -n 's:.*<loc>\(.*\)</loc>.*:\1:p' "$ROOT/sitemap.xml")
fi

JSON_URLS=$(printf '"%s",' "${URLS[@]}")
BODY=$(printf '{"host":"%s","key":"%s","keyLocation":"https://%s/%s.txt","urlList":[%s]}' \
  "$HOST" "$KEY" "$HOST" "$KEY" "${JSON_URLS%,}")

echo "Zgłaszam ${#URLS[@]} adres(y) do IndexNow…"
STATUS=$(curl -s -o /dev/stderr -w '%{http_code}' -X POST "https://api.indexnow.org/indexnow" \
  -H 'Content-Type: application/json; charset=utf-8' --data "$BODY")
echo
case "$STATUS" in
  200|202) echo "OK ($STATUS) — adresy przyjęte." ;;
  *) echo "Błąd HTTP $STATUS (403 = plik klucza niedostępny, 422 = adresy spoza domeny)."; exit 1 ;;
esac
