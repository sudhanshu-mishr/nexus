# Generator quality and evaluation

## What the generator is today

The current generator is a deterministic prompt interpreter, not a trained machine-learning model. It converts a natural-language brief into a typed `ProductSpec` using explicit intent patterns, category recipes, design-token rules, and sample content. This is intentional for the first reliable generation layer: it is predictable, testable, works without an API key, and never executes generated code.

Do not describe this version as fine-tuned or trained. The evaluation suite measures rule coverage and output structure; it does not measure human design quality or model intelligence.

## Supported prompt dimensions

- Business intent: cafe/restaurant, fashion, SaaS/dashboard, portfolio, agency, education, fitness, real estate, generic.
- Brand: quoted names and names following `called` or `named`.
- Design direction: dark/light, premium/editorial/spacious, compact/minimal, and explicit color families.
- Requested content: menu/catalogue, features, reviews, pricing, contact, locations, statistics.
- Currency: INR, USD, GBP, EUR when explicit; category defaults otherwise.

## Regression prompt set

Use these representative briefs whenever the generator changes:

1. Cafe: "Create a warm chai cafe called ChaiSutta with a menu, location, reviews and an earthy orange palette."
2. Store: "Build a premium dark streetwear store called Form Studio with product categories and a black-and-lime palette."
3. SaaS: "Create a dark analytics SaaS dashboard called Northstar with KPIs, a chart, recent activity and pricing."
4. Portfolio: "Build an editorial portfolio for a photographer called Alex with selected work and contact."
5. Agency: "Create a creative agency website called North Studio with services, case studies, testimonials and contact."
6. Education: "Build an online learning academy called SkillSpring with courses, learner statistics and pricing."
7. Fitness: "Create a premium fitness studio website called Pulse with programmes, memberships and testimonials."
8. Real estate: "Build a property listing website called KeyStone with featured homes, statistics and contact."

## Automated acceptance checks

- Every non-empty prompt produces a Zod-valid `ProductSpec`.
- Category classification selects the matching category recipe.
- A hero section is present and the page has enough meaningful sections.
- Requested content sections are included when supported.
- Brand name, palette, theme, spacing and currency instructions are preserved.
- SaaS dashboards include metrics and chart structure.
- Edits are applied to a cloned candidate; the previous valid spec is not mutated.
- Unsupported operations return no candidate rather than silently pretending to connect a service.

Run:

```bash
npm run typecheck
npm test
npm run build
```

## Quality rubric for human review

Score each generated preview from 1 to 5:

| Dimension | What to inspect |
| --- | --- |
| Intent match | Does the page look like the business/product requested? |
| Visual hierarchy | Is the hero clear, distinctive and balanced? |
| Design consistency | Do palette, spacing, typography and components feel coherent? |
| Content relevance | Are section titles and sample content appropriate to the brief? |
| Completeness | Are the requested sections and expected calls to action present? |
| Responsiveness | Does the layout remain usable at desktop, tablet and mobile widths? |
| Interaction honesty | Are simulated actions clearly identified as previews? |

Do not ship a change based only on a higher automated score. Review the rendered page at all three device widths and compare it against the original prompt.

## Next model phase

A later Gemini integration should produce only a structured candidate spec through a server-side provider adapter. Validate it with Zod, run deterministic quality checks, retry only bounded validation failures, and keep the previous preview intact if generation fails. Use a curated prompt/expected-spec evaluation set and human ratings before considering fine-tuning. Do not train on unlicensed website templates or scrape proprietary designs.
