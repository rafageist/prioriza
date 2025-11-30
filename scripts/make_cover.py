from pathlib import Path
import sys


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("Usage: make_cover.py <output> <version> <date>")

    cover_path = Path(sys.argv[1])
    version = sys.argv[2]
    date = sys.argv[3]

    cover_text = f"""\\begin{{titlepage}}
\\centering
\\vspace*{{4cm}}
{{\\Huge Prioriza Method}}\\\\[1.5cm]
{{\\Large 2025 Edition}}\\\\[0.5cm]
{{\\large Version {version}}}\\\\[0.5cm]
{{\\large Compiled on {date}}}\\\\[3cm]
{{\\large Documentation-first corpus for decision-making and prioritization}}\\\\
\\end{{titlepage}}
\\clearpage
"""

    cover_path.write_text(cover_text, encoding="utf-8")


if __name__ == "__main__":
    main()
