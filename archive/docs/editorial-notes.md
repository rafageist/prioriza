# Editorial Notes

This file keeps contributor-facing notes out of the public book manuscript.

## Public Manuscript Boundary

- The book text in `index.qmd` and `chapters/*.qmd` should read as a
  reader-facing manuscript.
- Build, repository, release, conversion, and task-management details belong
  in repository documentation, not in the book.
- Do not leave `TODO`, placeholder language, issue references, or workflow
  instructions in rendered chapters.
- Citation gaps should be tracked in `bibliography/bibliography-todo.md`
  until references are verified and added to `references.bib`.

## Terminology

- Use "nivel de prioridad del aspecto" in Spanish prose.
- Use `aspect_priority_level` in machine-readable examples.
- Avoid legacy software identifiers that describe aspect priority levels as
  weights unless discussing deprecated names explicitly.

## Current Editorial Checks

Before publishing a public version, run a book-facing scan similar to:

```powershell
rg -n "Quarto|DOCX|archive/source-docx|_output|GitHub Actions|TODO|placeholder|issue" index.qmd chapters
```

Any meaningful hit should be moved into repository documentation or rewritten
for readers.
