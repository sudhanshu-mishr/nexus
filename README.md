# Nexus — Interactive Preview Studio

Nexus is an early-stage prompt-to-preview product. A user describes a website or app, sees an interactive frontend concept, and refines it through short natural-language edits.

## Current milestone: M2 — stronger generator core

The current implementation uses a deterministic local generation engine. It does not call Gemini or any external AI API.

### Included
- shadcn-style component primitives (Button, Badge, Card, Dialog, Input, Textarea, Separator) with Radix UI accessibility foundations
- Brand-token bridge: generated preview palettes theme the shared component primitives per customer, including product detail dialogs and dashboard cards
- Sonner toast provider for platform feedback
- Next.js 14 App Router, TypeScript and Tailwind CSS
- Expanded prompt classification for cafes/restaurants, fashion, SaaS dashboards, portfolios, agencies, education, fitness, real estate and general business concepts
- Quoted and multi-word brand-name extraction, explicit currency parsing, and prompt-derived color/theme/spacing choices
- Zod-validated `ProductSpec` as the boundary between generation and rendering
- Category-aware page recipes, requested-section detection, and category-specific sample catalogues/stats
- Responsive desktop, tablet and mobile preview widths
- Product/menu category filters and product-detail modal
- Simulated product bag and form interactions
- SaaS stat cards, sample activity chart and activity table
- Structured edits for theme, palette, spacing, name, tagline, sections and items
- Browser-local version history, capped at 30 snapshots
- Generator quality diagnostics, regression tests across business categories, and GitHub Actions CI workflow

### Run locally

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### UI component setup

The project remains on Tailwind CSS 3.4 to avoid a framework migration during this milestone. The shared UI primitives are configured in `components.json` and use the Tailwind 3-compatible shadcn token convention. After pulling this branch, run `npm install` to install Radix UI, CVA, Sonner and class utilities.

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

See [docs/GENERATOR_EVAL.md](docs/GENERATOR_EVAL.md) for the prompt regression set and human review rubric. The local generator is rule-based, not a trained model.\n\n## Honest limitations

This is a frontend concept generator, not a production website deployment service yet. Sample metrics, products, testimonials, locations and prices are illustrative. Cart, checkout, forms, maps and analytics are not connected to real services. Projects are stored in the current browser only; Supabase persistence and authentication are future milestones.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the data flow and safety boundaries, and [docs/ROADMAP.md](docs/ROADMAP.md) for planned milestones.
