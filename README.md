# Prioriza Method

Prioriza is a decision-making and prioritization method based on ordinal
priority levels. It converts heterogeneous values into priority levels,
combines them with aspect priority levels, preserves ties, and produces a
traceable priority structure that can be reviewed, reused, and explained.

This repository contains the theory manuscript, not a software implementation.
The current manuscript status is `v0.4-draft`.

## Manuscript Source

The editable manuscript is the Quarto book configured by `_quarto.yml`
(shared base) with profile-specific overrides in `_quarto-es.yml` (Spanish)
and `_quarto-en.yml` (English).

- Spanish manuscript (canonical source): `book/es/index.qmd` and
  `book/es/chapters/*.qmd`.
- English manuscript (translation scaffold): `book/en/index.qmd` and
  `book/en/chapters/*.qmd`.
- Store conceptual figures in `figures/`.
- Store bibliography work in `references.bib` and
  `bibliography/bibliography-todo.md`.
- Treat `_output/` as generated output. It is ignored by Git.

The original conversion input is retained under `archive/source-docx/` for
traceability only. The public book should not contain repository, conversion,
or build-process notes.

## Local Rendering

Install Quarto (≥1.6) before rendering locally:

```powershell
quarto --version
```

Render commands:

```powershell
quarto render                    # renders Spanish (default profile)
quarto render --profile es       # explicit Spanish render
quarto render --profile en       # English render (placeholder scaffold)
quarto render --to html
quarto render --to pdf
```

HTML and PDF output is generated under `_output/`.

Preview the static website locally:

```powershell
python -m http.server 8000 -d docs
```

The deployment workflow copies `docs/` into `public/` and then adds the
generated book and PDF outputs. The generated `public/` folder is ignored by
Git.

## Website

The public website lives under `docs/` and is **English-only**, written in
standard HTML, CSS, and JavaScript. Quarto is not used to generate the
landing page or sub-pages.

- `docs/index.html` is the English landing page.
- `docs/downloads/index.html` is the downloads / releases guide page.
- `docs/tool/index.html` is the browser-only Prioriza tool page.
- `docs/assets/css/styles.css` contains the site styling.
- `docs/assets/js/main.js` contains light progressive enhancement.

There is no `/en/` subdirectory — the website is English at the root.

The deployed site exposes:

- the downloads page under `/downloads/`;
- the static tool under `/tool/`;
- links to GitHub Releases for PDF downloads;
- links to the GitHub repository, examples, and public roadmap;
- the HTML book under `/book/` only when a Pages workflow renders it.

## GitHub Workflows

- `ci.yml` checks the static site source (`docs/`), renders the HTML book and
  PDF book on pushes and pull requests, then uploads build artifacts.
- `pages.yml` deploys the static site to GitHub Pages after changes reach
  `master` or `main`; it copies `docs/` into `public/`, then adds the generated
  book under `/book/` and the generated PDF under `/downloads/` when available.
- `release.yml` is manual. It reads `manifest.yml`, renders the PDF, and
  creates a GitHub release only when the manifest version does not already
  exist as a tag.

## Bilingual Book Architecture

The book is **bilingual**: Spanish is the canonical source of truth, and
English is a controlled translation. The website remains **English-only**
(see [Website](#website)).

### Principles

1. **Spanish is canonical.** All substantive edits happen in the Spanish
   manuscript (`book/es/`). The English manuscript (`book/en/`) is a
   controlled translation derived from the Spanish source.
2. **No automated translation.** English chapters are human-translated and
   reviewed. Each English chapter carries a "translation pending" notice
   until translated.
3. **Languages do not mix in one output.** Each Quarto profile produces a
   monolingual book. There is no single bilingual output.
4. **Website is separate.** The website (`docs/`) is English-only and
   independent of the book's bilingual structure.

### Directory layout

```text
_quarto.yml           Shared project config + profile definitions
_quarto-es.yml        Spanish profile (lang, title, chapters)
_quarto-en.yml        English profile (lang, title, chapters)
book/
  es/
    index.qmd         Spanish preface (canonical)
    chapters/
      00-proposito-tesis-posicionamiento.qmd
      ...
  en/
    index.qmd         English preface (translation scaffold)
    chapters/
      00-proposito-tesis-posicionamiento.qmd
      ...
```

### How Spanish changes flow into English

1. Edit the Spanish file under `book/es/`.
2. When the content is stable, translate the corresponding English file
   under `book/en/` (keeping the same base filename).
3. Render both profiles to verify:
   ```powershell
   quarto render --profile es
   quarto render --profile en
   ```

### Render with Quarto profiles

```powershell
quarto render              # renders Spanish (default profile)
quarto render --profile es # explicit Spanish
quarto render --profile en # English
quarto render --profile en --to pdf  # English PDF
```

## Chapter Structure

The Spanish manuscript source files (canonical) live under `book/es/`:

- `book/es/index.qmd`
- `book/es/chapters/00-proposito-tesis-posicionamiento.qmd`
- `book/es/chapters/01-introduccion.qmd`
- `book/es/chapters/02-problema-general-de-decision.qmd`
- `book/es/chapters/03-forma-discreta.qmd`
- `book/es/chapters/04-justificacion-del-procedimiento.qmd`
- `book/es/chapters/05-empates-contradicciones-decisiones-no-unicas.qmd`
- `book/es/chapters/06-reutilizacion-tablas.qmd`
- `book/es/chapters/07-recursividad.qmd`
- `book/es/chapters/08-ingenieria-inversa.qmd`
- `book/es/chapters/09-forma-continua.qmd`
- `book/es/chapters/10-formas-generales-de-uso.qmd`
- `book/es/chapters/11-aplicaciones-del-metodo.qmd`
- `book/es/chapters/12-aplicacion-historica-ancora-goh.qmd`
- `book/es/chapters/13-aplicaciones-dinamicas-y-asignacion-recursos.qmd`
- `book/es/chapters/14-estado-del-arte.qmd`
- `book/es/chapters/15-aporte-real-de-prioriza.qmd`
- `book/es/chapters/16-limites-y-criticas.qmd`
- `book/es/chapters/17-arquitectura-gobernanza-ia.qmd`
- `book/es/chapters/18-especificacion-futura.qmd`
- `book/es/chapters/19-conclusiones.qmd`

The English scaffold mirrors the same filenames under `book/en/`.

## Contributor Docs

- `docs/editorial-notes.md` defines the boundary between public manuscript and
  contributor notes.
- `docs/illustration-plan.md` tracks conceptual figure work.
- `docs/release-process.md` documents rendering, artifacts, and release
  naming.
- `docs/custom-domain.md` documents the planned `prioriza.rafageist.com`
  GitHub Pages setup.

## Bibliography Policy

Do not invent references. Add entries to `references.bib` only after verifying
metadata against reliable sources. Use `bibliography/bibliography-todo.md` and
citation notes outside rendered chapters to mark where sources are needed.

## Archive And Legacy Material

- `archive/source-docx/` keeps the DOCX conversion input.
- `archive/legacy-docs/` keeps the previous Markdown/Pandoc manuscript and
  PDF build files.
- Existing `examples/`, `octave/`, `scripts/plots/`, and `images/` content is
  retained as supporting historical/example material.

## Continuing With Codex

When continuing work with Codex, point it at this repository and treat
`_quarto.yml` (with its profile overrides `_quarto-es.yml` and
`_quarto-en.yml`) as the manuscript entry point. Ask it to preserve the
Quarto structure, avoid fabricated bibliography, keep public-book text free of
repository process notes, and document render failures or local tooling gaps in
`WORK_NOTES.md`.

## License

All documents are released under the Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 International license.
