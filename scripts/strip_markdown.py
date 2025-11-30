from __future__ import annotations

import re
import sys
from pathlib import Path

MEDIA_PATTERN = re.compile(r"(audio|\\.mp3|\\.mp4|\\.wav|\\.ogg|\\.m4a)", re.IGNORECASE)
LINK_PATTERN = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
FRONTMATTER_PATTERN = re.compile(r"^---\r?\n.*?\r?\n---\r?\n?", re.S)


def clean_links(text: str) -> str:
    return LINK_PATTERN.sub(r"\1", text)


def strip_markdown(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    if text.startswith("---"):
        text = FRONTMATTER_PATTERN.sub("", text, count=1)
    text = clean_links(text)
    lines: list[str] = []
    for line in text.splitlines():
        if MEDIA_PATTERN.search(line):
            continue
        lines.append(line)
    return "\n".join(lines)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: strip_markdown.py <file>")
    path = Path(sys.argv[1])
    print(strip_markdown(path))


if __name__ == "__main__":
    main()
