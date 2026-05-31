#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

: "${BOOK_VERSION:?BOOK_VERSION environment variable is required}"
: "${BOOK_DATE:?BOOK_DATE environment variable is required}"

rm -f md-order.txt md-list.txt md-list-with-cover.txt combined.md cover.md

ORDER_FILE="pdf-order.txt"

if [ -f "$ORDER_FILE" ]; then
  sed -e 's/\r$//' "$ORDER_FILE" | sed '/^[[:space:]]*$/d' | sed '/^[[:space:]]*#/d' > md-order.txt
else
  echo "Order file not found; discovering markdown files under docs/, examples/, thesis/"
  find docs -name '*.md' -print | sort > md-order.txt
  if [ -d examples ]; then
    find examples -name '*.md' -print | sort >> md-order.txt
  fi
  if [ -d thesis ]; then
    find thesis -name '*.md' -print | sort >> md-order.txt
  fi
fi

grep -v '^.*/.github/' md-order.txt > md-list.txt || cp md-order.txt md-list.txt

COVER_FILE="cover.md"
python scripts/make_cover.py "$COVER_FILE" "$BOOK_VERSION" "$BOOK_DATE"

printf '%s\n' "$COVER_FILE" > md-list-with-cover.txt
cat md-list.txt >> md-list-with-cover.txt

COMBINED="combined.md"
: > "$COMBINED"

while IFS= read -r f; do
  if [ -f "$f" ]; then
    printf '\n\n<!-- Source: %s -->\n\n' "$f" >> "$COMBINED"
    python scripts/strip_markdown.py "$f" >> "$COMBINED"
  else
    echo "Warning: listed file '$f' not found" >&2
  fi
done < md-list-with-cover.txt

OUTPUT="prioriza-method-${BOOK_VERSION}.pdf"

pandoc "$COMBINED" -o "$OUTPUT" \
  --pdf-engine=xelatex \
  -V mainfont="DejaVu Sans" \
  -V geometry:a4paper \
  -V geometry:margin=2.5cm \
  --toc --number-sections

rm -f md-order.txt md-list.txt md-list-with-cover.txt combined.md cover.md
