# Architecture

## Core flow
Prompt -> local intent classification -> category recipe + prompt-derived design tokens -> Zod-validated ProductSpec -> trusted React preview -> browser-local version history -> structured edit patch -> validation -> append a new version.

The renderer consumes a validated ProductSpec, never raw model output. Local generation is the M0/M1 provider; a future AI provider should implement the same contract.

## M1 preview capabilities
- Category recipes for cafes/restaurants, fashion storefronts, SaaS dashboards and generic business concepts.
- Product/menu category filters and an item detail dialog.
- Dashboard stat cards, a sample activity visualization and an activity table.
- Structured edits for theme, palette, spacing, brand name, tagline, and adding supported sections/items.
- Browser-local version history is capped at 30 snapshots.

## Security boundaries
- Do not use dangerouslySetInnerHTML for generated content.
- Do not execute generated JavaScript.
- Keep future private API keys server-side.
- Validate generated specs before saving or rendering.
- Keep failed candidates separate from the last valid version.

## Persistence
M0/M1 uses localStorage for a frictionless guest prototype. M3 is intended to add Supabase Auth, Postgres and Row Level Security while preserving guest mode.

## Preview honesty
Sample metrics, activity, products, testimonials, locations and prices are illustrative. Cart, checkout, forms, maps and analytics are not connected to real services.
