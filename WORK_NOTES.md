# Work Notes

## Repository migration notes

- Current canonical manuscript format: Quarto book.
- Current canonical entry point: `_quarto.yml`.
- Latest DOCX source archived at
  `archive/source-docx/Prioriza_Documento_Maestro_V0_3_azar_reactividad_ilustraciones.docx`.
- Legacy Markdown chapters and the old Pandoc PDF build files were moved to
  `archive/legacy-docs/`.
- Existing `examples/`, `octave/`, `scripts/plots/`, and `images/` content is
  retained as supporting historical/example material, not as canonical
  manuscript source.

## Validation notes

- Quarto is not installed in the local PATH in this environment, so local
  `quarto render` commands cannot be executed here yet.
- `quarto --version` was attempted and failed because the executable is not
  available in PATH.
- Render commands to run after installing Quarto:
  `quarto render`, `quarto render --to html`, and `quarto render --to pdf`.

## DOCX conversion notes

- The archived DOCX was converted with Pandoc 3.9.0.2 into
  `tmp/prioriza_raw.md` and split into the Quarto chapter files under
  `chapters/`.
- The generated `tmp/` Markdown and Pandoc-extracted `figures/imported/` media
  are temporary conversion artifacts and are ignored by Git.
- The conceptual figures are being recreated as versionable SVG files in the
  canonical `figures/` directory instead of committing DOCX-extracted bitmaps.

## Terminology pass notes

- Internal Prioriza terminology now uses `nivel de prioridad`,
  `nivel de prioridad del elemento`, `nivel de prioridad del aspecto`,
  `nivel de prioridad resultante`, `estructura de prioridad`,
  `función de nivelación`, `nivelación`, `tabla Prioriza`, and
  `ejecución Prioriza`.
- JSON/YAML examples use `aspect_priority_level`, not `weight`.
- The remaining `peso`, `ponderación`, and `suma ponderada` matches are
  intentionally kept only in terminology notes, MCDA comparisons, or
  state-of-the-art/critique passages where external vocabulary is being
  discussed.
