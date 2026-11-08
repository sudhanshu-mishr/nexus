# Nexus — Interactive Preview Studio

Nexus is an early-stage prompt-to-preview product. A user describes a website or app, sees an interactive frontend concept, and refines it through short natural-language edits.

## Current milestone: M3 — Gemini dynamic website generation

The prompt workspace now calls the Gemini API through a server-side route. Gemini creates a structured website specification from each brief; Zod validates the response before the React preview renderer uses it. The legacy local engine remains in the repository for regression/fallback work, but the main generate and refine actions use Gemini.

### Included
- shadcn-style component primitives (Button, Badge, Card, Dialog, Input, Textarea, Separator) with Radix UI accessibility foundations
- Brand-token bridge: generated preview palettes theme the shared component primitives per customer, including product detail dialogs and dashboard cards
- Sonner toast provider for platform feedback
- Next.js 14 App Router, TypeScript and Tailwind CSS
- Expanded prompt classification for cafes/restaurants, fashion, SaaS dashboards, portfolios, agencies, education, fitness, real estate and general business concepts
- Quoted and multi-word brand-name extraction, explicit currency parsing, and prompt-derived color/theme/spacing choices
- Zod-validated `ProductSpec` as the boundary between generation and rendering
- Gemini-authored page composition, section order, copy, design palette, and custom content blocks
- Responsive desktop, tablet and mobile preview widths
- Product/menu category filters and product-detail modal
- Simulated product bag and form interactions
- SaaS stat cards, sample activity chart and activity table
- Natural-language AI refinement that submits the current specification and preserves unrelated content
- Browser-local version history, capped at 30 snapshots
- Generator quality diagnostics, regression tests across business categories, and GitHub Actions CI workflow

### Run locally

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The generation API uses `GEMINI_MODEL` (default `gemini-2.5-flash`). Configure the same environment variables in Vercel before deploying.

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

See [docs/GENERATOR_EVAL.md](docs/GENERATOR_EVAL.md) for the prompt regression set and human review rubric. Gemini is an API-powered design agent, not a fine-tuned model. Its output is validated against the website specification and retried once if invalid.\n\n## Honest limitations

This is a frontend concept generator, not a production website deployment service yet. Sample metrics, products, testimonials, locations and prices are illustrative. Cart, checkout, forms, maps and analytics are not connected to real services. Projects are stored in the current browser only; Supabase persistence and authentication are future milestones.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the data flow and safety boundaries, and [docs/ROADMAP.md](docs/ROADMAP.md) for planned milestones.
