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
