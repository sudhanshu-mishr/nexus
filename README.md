# Nexus — Interactive Preview Studio

Nexus is an early-stage prompt-to-preview product. A user describes a website or app, sees an interactive frontend concept, and refines it through short natural-language edits.

## Current milestone: M0 (local, API-free vertical slice)

This repository starts with a deterministic local generation engine. It does not call Gemini or any external AI API.

### Included in this baseline
- Next.js 14 App Router + TypeScript + Tailwind CSS
- Local intent classification for cafe, fashion, SaaS/dashboard and general concepts
- Zod-validated ProductSpec
- Interactive preview renderer with category-aware sections
- Responsive desktop / tablet / mobile preview widths
- Simulated product bag, category filters and form validation
- Small edit grammar (theme, spacing, primary color, testimonials)
- Append-only local version history in browser storage
- Failed/unsupported edits do not replace the current successful preview

### Honest limitations
- This is a prototype, not a production website generator.
- Generation is deterministic heuristics + curated recipes/content, not an LLM.
- Only supported categories and edit vocabulary are covered.
- Cart and form actions are simulated; no orders, payments, email or backend are connected.
- Projects are stored in the current browser's localStorage; there is no account sync yet.
- No real photography or image provider is connected.
- No Supabase or Gemini environment variables are needed for M0.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

These checks have not yet been run in this environment. Run them after installing dependencies before treating the baseline as production-ready.

## Product principles
1. Preview is the product's center of gravity; editing UI stays secondary.
2. Render validated structured data through trusted React components.
3. Never execute arbitrary AI-generated JavaScript or HTML.
4. Never let a failed generation/edit replace the last successful preview.
5. Label simulated interactions honestly.
6. Keep the generation provider replaceable; an AI provider can be added later without rewriting the renderer.
