# Prioriza Method

Prioriza is a decision-making and prioritization method based on ordinal
priority levels. It converts heterogeneous values into priority levels,
combines them with aspect priority levels, preserves ties, and produces a
traceable priority structure that can be reviewed, reused, and explained.

This repository contains the theory manuscript, not a software implementation.
The current manuscript status is `v0.4-draft`.

## Canonical Source

The canonical editable source is now the Quarto book configured by
`_quarto.yml`.

- Edit manuscript text in `index.qmd` and `chapters/*.qmd`.
- Store conceptual figures in `figures/`.
- Store bibliography work in `references.bib` and
  `bibliography/bibliography-todo.md`.
- Treat `_output/` as generated output. It is ignored by Git.

The latest DOCX used for conversion is archived at
`archive/source-docx/Prioriza_Documento_Maestro_V0_3_azar_reactividad_ilustraciones.docx`.
It is source material for traceability, not the canonical editable format.

## Quarto

Install Quarto before rendering locally:

```powershell
quarto --version
```

Render commands:

```powershell
quarto render
quarto render --to html
quarto render --to pdf
```

HTML and PDF output should be generated under `_output/`.

On GitHub, the release workflow runs after changes are merged to `master` or
`main`, or when triggered manually. It reads `manifest.yml`, renders the Quarto
book, and creates a GitHub release with `prioriza-method-<version>.pdf`.

## Chapter Structure

The book is split into one Quarto file per major section:

- `index.qmd`
- `chapters/00-proposito-tesis-posicionamiento.qmd`
- `chapters/01-introduccion.qmd`
- `chapters/02-problema-general-de-decision.qmd`
- `chapters/03-forma-discreta.qmd`
- `chapters/04-justificacion-del-procedimiento.qmd`
- `chapters/05-empates-contradicciones-decisiones-no-unicas.qmd`
- `chapters/06-reutilizacion-tablas.qmd`
- `chapters/07-recursividad.qmd`
- `chapters/08-ingenieria-inversa.qmd`
- `chapters/09-forma-continua.qmd`
- `chapters/10-formas-generales-de-uso.qmd`
- `chapters/11-aplicaciones-del-metodo.qmd`
- `chapters/12-aplicacion-historica-ancora-goh.qmd`
- `chapters/13-aplicaciones-dinamicas-y-asignacion-recursos.qmd`
- `chapters/14-estado-del-arte.qmd`
- `chapters/15-aporte-real-de-prioriza.qmd`
- `chapters/16-limites-y-criticas.qmd`
- `chapters/17-arquitectura-gobernanza-ia.qmd`
- `chapters/18-especificacion-futura.qmd`
- `chapters/19-conclusiones.qmd`

## Bibliography Policy

Do not invent references. Add entries to `references.bib` only after verifying
metadata against reliable sources. Use `bibliography/bibliography-todo.md` and
HTML comments in chapters to mark where citations are needed.

## Archive And Legacy Material

- `archive/source-docx/` keeps the DOCX conversion input.
- `archive/legacy-docs/` keeps the previous Markdown/Pandoc manuscript and
  PDF build files.
- Existing `examples/`, `octave/`, `scripts/plots/`, and `images/` content is
  retained as supporting historical/example material.

## Continuing With Codex

When continuing work with Codex, point it at this repository and treat
`_quarto.yml` as the manuscript entry point. Ask it to preserve the Quarto
structure, avoid fabricated bibliography, and document render failures or local
tooling gaps in `WORK_NOTES.md`.

## License

All documents are released under the Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 International license.
