# Architecture

## Core flow

Prompt -> local intent classification -> palette/layout/content recipe -> Zod-validated ProductSpec -> trusted React preview -> browser-local version history -> structured edit patch -> validation -> append new version.

The renderer consumes a validated ProductSpec, never raw model output. Local generation is the M0 provider; a future AI provider should implement the same contract.

## Security boundaries
- Do not use dangerouslySetInnerHTML for generated content.
- Do not execute generated JavaScript.
- Keep future private API keys server-side.
- Validate generated specs before saving or rendering.
- Keep failed candidates separate from the last valid version.

## Persistence
M0 uses localStorage for a frictionless demo. M3 is intended to add Supabase Auth, Postgres and Row Level Security while preserving guest mode.
