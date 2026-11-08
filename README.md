# Nexus — Interactive Preview Studio

Nexus is an early-stage prompt-to-preview product. A user describes a website or app, sees an interactive frontend concept, and refines it through short natural-language edits.

## Current milestone: M1 — richer local previews

The current implementation uses a deterministic local generation engine. It does not call Gemini or any external AI API.

### Included
- Next.js 14 App Router, TypeScript and Tailwind CSS
- Prompt classification for cafes/restaurants, fashion storefronts, SaaS dashboards and general business concepts
- Multi-word brand-name extraction and prompt-derived color/theme choices
- Zod-validated `ProductSpec` as the boundary between generation and rendering
- Category-aware interactive frontend sections
- Responsive desktop, tablet and mobile preview widths
- Product/menu category filters and product-detail modal
- Simulated product bag and form interactions
- SaaS stat cards, sample activity chart and activity table
- Structured edits for theme, palette, spacing, name, tagline, sections and items
- Browser-local version history, capped at 30 snapshots
- Unit tests with Vitest and GitHub Actions CI workflow

### Run locally

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Quality checks

```bash
npm run typecheck
npm test
npm run build
```

### Current edit examples
- `make it dark and premium`
- `change name to Chai House`
- `change tagline to A warmer cup, every day`
- `make it green`
- `add a contact section`
- `add pricing`
- `add a product`

## Honest limitations

This is a frontend concept generator, not a production website deployment service yet. Sample metrics, products, testimonials, locations and prices are illustrative. Cart, checkout, forms, maps and analytics are not connected to real services. Projects are stored in the current browser only; Supabase persistence and authentication are future milestones.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the data flow and safety boundaries, and [docs/ROADMAP.md](docs/ROADMAP.md) for planned milestones.
