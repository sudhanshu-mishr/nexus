import { ProductSpecSchema, type ProductSpec, type Section } from "./spec";

type Category = "cafe" | "fashion" | "saas" | "portfolio" | "agency" | "education" | "fitness" | "realestate" | "generic";
type Palette = ProductSpec["design"]["palette"];

const palettes: Record<Category, Palette> = {
  cafe: { bg: "#f8f1e7", surface: "#fffaf2", text: "#2d2118", muted: "#78685b", primary: "#b85d2a", accent: "#7b452b", border: "#e7d8c5" },
  fashion: { bg: "#f3f0eb", surface: "#fffdfa", text: "#201d1a", muted: "#77716a", primary: "#272522", accent: "#a78a63", border: "#e4dfd7" },
  saas: { bg: "#f4f7fb", surface: "#ffffff", text: "#172337", muted: "#64748b", primary: "#315fbd", accent: "#13a68a", border: "#dce4ef" },
  portfolio: { bg: "#111318", surface: "#1b1e25", text: "#f4f1eb", muted: "#aaa7a0", primary: "#d4a96a", accent: "#725c9c", border: "#343741" },
  agency: { bg: "#f4f2ed", surface: "#fffefa", text: "#20201e", muted: "#73716b", primary: "#ed5b38", accent: "#252a35", border: "#e3dfd6" },
  education: { bg: "#f3f6f1", surface: "#ffffff", text: "#1c3028", muted: "#68776e", primary: "#267451", accent: "#e1a64c", border: "#dce6dd" },
  fitness: { bg: "#111512", surface: "#1b211d", text: "#f4f7f2", muted: "#a3afa5", primary: "#a5df43", accent: "#477a3b", border: "#354238" },
  realestate: { bg: "#f4f3ef", surface: "#fffefa", text: "#202521", muted: "#747b73", primary: "#526b5a", accent: "#b99a70", border: "#e1e3dc" },
  generic: { bg: "#f6f5f2", surface: "#ffffff", text: "#242424", muted: "#737373", primary: "#5650a8", accent: "#b28a55", border: "#e7e5e4" },
};

const patterns: Array<[Category, RegExp]> = [
  ["saas", /\b(saas|dashboard|analytics|crm|admin panel|metrics|portal|project management|workflow|b2b software)\b/i],
  ["portfolio", /\b(portfolio|personal website|freelancer|photographer|designer portfolio|artist|creative developer|resume site)\b/i],
  ["fashion", /\b(fashion|clothing|apparel|boutique|outfit|streetwear|fashion store|jewellery|jewelry|sneakers)\b/i],
  ["agency", /\b(agency|studio|consultancy|consulting|marketing firm|creative firm|design firm)\b/i],
  ["education", /\b(education|school|college|university|course|academy|learning platform|tutoring|edtech)\b/i],
  ["fitness", /\b(fitness|gym|workout|yoga|wellness|personal trainer|sports club)\b/i],
  ["realestate", /\b(real estate|property|properties|realtor|estate agency|apartments|homes for sale)\b/i],
  ["fashion", /\b(fashion|clothing|apparel|boutique|outfit|streetwear|fashion store|jewellery|jewelry|sneakers)\b/i],
  ["cafe", /\b(chai|cafe|café|coffee|restaurant|bakery|menu|food|pizza|burger|diner|bistro)\b/i],
];

function classify(prompt: string): Category {
  return patterns.find(([, pattern]) => pattern.test(prompt))?.[0] ?? "generic";
}

function extractBrand(prompt: string): string {
  const quoted = prompt.match(/\b(?:called|named|brand(?:\s+name)?\s*(?:is|:)?|for)\s+["“']([^"”']{1,60})["”']/i);
  if (quoted?.[1]) return quoted[1].trim().slice(0, 60);
  const named = prompt.match(/\b(?:called|named)\s+([A-Z0-9][A-Za-z0-9&.'-]*(?:\s+[A-Z0-9][A-Za-z0-9&.'-]*){0,3})/);
  if (named?.[1]) return named[1].trim().replace(/[.,!?]+$/, "").slice(0, 60);
  return "Your Brand";
}

function currencyFor(prompt: string, category: Category): string {
  if (/\b(inr|rupees?|india|indian)\b|₹/i.test(prompt)) return "₹";
  if (/\b(usd|dollars?|usa|united states)\b|\$/i.test(prompt)) return "$";
  if (/\b(gbp|pounds?|uk|united kingdom)\b|£/i.test(prompt)) return "£";
  if (/\b(eur|euros?|europe)\b|€/i.test(prompt)) return "€";
  return ["cafe", "fashion", "fitness", "realestate"].includes(category) ? "₹" : "$";
}

function paletteFor(prompt: string, category: Category): Palette {
  const palette = { ...palettes[category] };
  const colors: Array<[RegExp, string]> = [
    [/\b(orange|terracotta|rust)\b/i, "#bd642f"],
    [/\b(green|sage|forest|emerald)\b/i, "#32734d"],
    [/\b(blue|navy|cobalt)\b/i, "#315fbd"],
    [/\b(pink|rose)\b/i, "#bd6489"],
    [/\b(purple|violet|lavender)\b/i, "#7652a8"],
    [/\b(red|crimson)\b/i, "#b83c46"],
    [/\b(yellow|mustard|gold)\b/i, "#b58a24"],
    [/\b(teal|turquoise)\b/i, "#168b87"],
    [/\b(black|monochrome)\b/i, "#252525"],
  ];
  for (const [pattern, color] of colors) if (pattern.test(prompt)) palette.primary = color;
  return palette;
}

function sectionsFor(category: Category, prompt: string): Section[] {
  const defaults: Record<Category, Section["type"][]> = {
    cafe: ["hero", "features", "menu", "about", "testimonials", "locations", "contact"],
    fashion: ["hero", "features", "products", "about", "testimonials", "cta"],
    saas: ["hero", "stats", "chart", "features", "table", "pricing", "cta"],
    portfolio: ["hero", "features", "products", "about", "testimonials", "contact"],
    agency: ["hero", "stats", "features", "products", "testimonials", "about", "contact", "cta"],
    education: ["hero", "stats", "features", "products", "testimonials", "pricing", "contact"],
    fitness: ["hero", "stats", "features", "products", "testimonials", "pricing", "contact"],
    realestate: ["hero", "products", "stats", "features", "testimonials", "locations", "contact"],
    generic: ["hero", "features", "about", "products", "testimonials", "contact"],
  };
  const titles: Record<Section["type"], string> = {
    hero: category === "portfolio" ? "Selected work, thoughtful ideas" : category === "saas" ? "A clearer way to move work forward" : "A better experience starts here",
    about: category === "agency" ? "Good work starts with good thinking" : "A little about us",
    features: category === "saas" ? "Everything in one clear view" : category === "education" ? "Learning that moves you forward" : "Made with intention",
    menu: "A few favourites",
    products: category === "realestate" ? "Featured properties" : category === "portfolio" ? "Selected work" : "Explore the collection",
    pricing: category === "fitness" ? "Memberships that move with you" : "Simple plans that scale",
    testimonials: "Kind words from our community",
    locations: "Find your place",
    contact: "Let's start a conversation",
    stats: category === "education" ? "Learning at a glance" : category === "fitness" ? "Progress worth celebrating" : "Your business at a glance",
    chart: "Performance over time",
    table: "Recent activity",
    cta: "Ready to take the next step?",
    custom: "A closer look",
  };
  const requested = new Set<Section["type"]>();
  if (/\b(testimonials?|reviews?|client stories)\b/i.test(prompt)) requested.add("testimonials");
  if (/\b(pricing|plans|membership|packages)\b/i.test(prompt)) requested.add("pricing");
  if (/\b(contact|enquiry|inquiry|book a call)\b/i.test(prompt)) requested.add("contact");
  if (/\b(location|address|find us|branches)\b/i.test(prompt)) requested.add("locations");
  if (/\b(stats|metrics|analytics|performance)\b/i.test(prompt) && category !== "saas") requested.add("stats");
  const types = [...defaults[category]];
  for (const type of requested) if (!types.includes(type)) types.splice(Math.max(1, types.length - 1), 0, type);
  return types.map((type, index) => ({ id: type + "-" + index, type, title: titles[type], cards: [] }));
}

function sampleItems(category: Category, currency: string): Array<[string, string, string, string, string]> {
  const rows: Record<Category, Array<[string, string, string, string, string]>> = {
    cafe: [
      ["Masala Chai", "Slow-brewed with ginger, cardamom and a little warmth.", "45", "Chai", "Bestseller"],
      ["Kulhad Chai", "A familiar favourite served in an earthen cup.", "60", "Chai", "House favourite"],
      ["Saffron Latte", "Aromatic, smooth and gently sweet.", "85", "Specials", "New"],
      ["Paneer Puff", "Flaky pastry with a savoury, spiced filling.", "55", "Bites", ""],
      ["Cold Coffee", "Chilled, creamy and made for long afternoons.", "95", "Specials", ""],
      ["Bun Maska", "Soft bun, toasted golden with a rich buttery centre.", "50", "Bites", ""],
    ],
    fashion: [
      ["Everyday Shirt", "An easy layer with a considered fit and soft finish.", "1490", "Clothing", "Bestseller"],
      ["Structured Tote", "A clean silhouette with room for the everyday.", "2250", "Accessories", "New"],
      ["Relaxed Trousers", "An effortless shape designed for movement.", "1890", "Clothing", ""],
      ["Classic Jacket", "A versatile outer layer with timeless details.", "3490", "Outerwear", "Limited"],
      ["Essential Tee", "A refined everyday staple.", "890", "Clothing", ""],
      ["Canvas Carryall", "A practical companion for wherever the day goes.", "1290", "Accessories", ""],
    ],
    saas: [
      ["Starter", "The essentials for a focused team.", "19", "Plans", "For individuals"],
      ["Growth", "More visibility and control as you scale.", "49", "Plans", "Most popular"],
      ["Scale", "Advanced workflows for ambitious teams.", "99", "Plans", "For teams"],
    ],
    portfolio: [
      ["Brand identity", "A cohesive visual system built around a clear idea.", "01", "Selected work", "Featured"],
      ["Digital experience", "A considered interface for a growing product.", "02", "Selected work", "Recent"],
      ["Art direction", "A visual story with a distinct point of view.", "03", "Selected work", ""],
    ],
    agency: [
      ["Brand strategy", "Positioning and direction that make your brand distinct.", "01", "Services", "Core"],
      ["Digital experiences", "Useful, memorable websites built around people.", "02", "Services", "Popular"],
      ["Creative campaigns", "Ideas that connect your story with your audience.", "03", "Services", ""],
    ],
    education: [
      ["Foundations", "Build confidence with a clear, guided learning path.", "999", "Courses", "Beginner"],
      ["Career track", "Project-led learning for your next professional step.", "2499", "Courses", "Popular"],
      ["Masterclass", "Go deeper with focused lessons and expert guidance.", "1499", "Courses", "Advanced"],
    ],
    fitness: [
      ["Strength programme", "A progressive plan built around your goals.", "1499", "Training", "Popular"],
      ["Personal coaching", "Individual guidance and a plan made for you.", "3999", "Coaching", "1:1"],
      ["Mobility sessions", "Move better with focused recovery and mobility.", "799", "Classes", "New"],
    ],
    realestate: [
      ["The Garden Residence", "A light-filled home with generous living spaces.", "12500000", "Residential", "Featured"],
      ["Parkside Apartment", "A modern apartment close to everyday essentials.", "8400000", "Residential", "New"],
      ["The Courtyard Villa", "Private outdoor space and timeless architecture.", "21800000", "Premium", "Premium"],
    ],
    generic: [
      ["The Essentials", "A thoughtful starting point for your next step.", "29", "Featured", "Popular"],
      ["The Signature", "A little more room for the details that matter.", "59", "Featured", "Recommended"],
      ["The Complete", "A complete experience with more flexibility.", "89", "Featured", ""],
    ],
  };
  return rows[category].map(([name, description, amount, group, badge]) => [name, description, amount, group, badge]);
}

function sampleStats(category: Category, currency: string) {
  if (category === "saas") return [
    { label: "Active users", value: "12,840", change: "+12.8%" },
    { label: "Monthly revenue", value: currency + "48.2k", change: "+8.4%" },
    { label: "Conversion rate", value: "4.82%", change: "+1.2%" },
    { label: "Retention", value: "94.2%", change: "+2.1%" },
  ];
  if (category === "fitness") return [
    { label: "Active members", value: "1,284", change: "+8.2%" },
    { label: "Weekly sessions", value: "326", change: "+12%" },
    { label: "Programmes", value: "18", change: "4 new" },
  ];
  if (category === "education") return [
    { label: "Learners", value: "8,420", change: "+16%" },
    { label: "Courses", value: "42", change: "6 new" },
    { label: "Completion", value: "91%", change: "+4.2%" },
  ];
  if (category === "agency") return [
    { label: "Projects delivered", value: "128", change: "+18%" },
    { label: "Client partners", value: "36", change: "+6%" },
    { label: "Years of craft", value: "9", change: "" },
  ];
  if (category === "realestate") return [
    { label: "Properties", value: "84", change: "12 new" },
    { label: "Happy clients", value: "320+", change: "+14%" },
    { label: "Years of trust", value: "12", change: "" },
  ];
  return [];
}

export function generateSpec(prompt: string): ProductSpec {
  const cleanPrompt = prompt.trim().replace(/\s+/g, " ");
  if (!cleanPrompt) throw new Error("Describe the website or app you want to create.");
  const category = classify(cleanPrompt);
  const name = extractBrand(cleanPrompt);
  const currency = currencyFor(cleanPrompt, category);
  const palette = paletteFor(cleanPrompt, category);
  const dark = /\b(dark|black|night mode|dark mode)\b/i.test(cleanPrompt) || category === "portfolio" || category === "fitness";
  const spacing = /\b(compact|minimal|dense|tight)\b/i.test(cleanPrompt) ? "compact" : /\b(premium|spacious|luxury|editorial|airy)\b/i.test(cleanPrompt) ? "spacious" : "standard";
  const radius = /\b(sharp|square|brutalist)\b/i.test(cleanPrompt) ? 8 : spacing === "spacious" ? 24 : 18;
  const rawItems = sampleItems(category, currency);
  const items = rawItems.map(([itemName, description, amount, itemCategory, badge], index) => ({
    id: "item-" + index,
    name: itemName,
    description,
    details: description + " Replace this sample content with your real details before launch.",
    price: currency + amount,
    category: itemCategory,
    ...(badge ? { badge } : {}),
  }));
  const testimonials = [
    { quote: "The details feel thoughtful, and the whole experience is effortless.", author: "A happy customer", role: "Returning customer" },
    { quote: "Exactly the kind of quality and care we were looking for.", author: "A returning customer", role: "Verified customer" },
  ];
  const activities = category === "saas" ? [
    { id: "a1", title: "New workspace created", detail: "Northstar Studio · 8 min ago", status: "Completed", amount: currency + "49.00" },
    { id: "a2", title: "Subscription renewed", detail: "Morrow Labs · 32 min ago", status: "Completed", amount: currency + "99.00" },
    { id: "a3", title: "Payment needs review", detail: "Atelier Co. · 1 hr ago", status: "Pending", amount: currency + "19.00" },
    { id: "a4", title: "New team member", detail: "Orbit Design · 2 hrs ago", status: "Completed", amount: "" },
  ] : [];
  const tagline = category === "cafe" ? "A slower cup. A warmer welcome."
    : category === "fashion" ? "Considered essentials, made to be lived in."
    : category === "saas" ? "Clarity for the work that moves you forward."
    : category === "portfolio" ? "A collection of ideas, craft and considered work."
    : category === "agency" ? "Good thinking. Distinctive work. Measurable impact."
    : category === "education" ? "Build skills. Find your next possibility."
    : category === "fitness" ? "Stronger every day, at your own pace."
    : category === "realestate" ? "Find a place that feels like yours."
    : "A thoughtful digital experience, made around you.";

  return ProductSpecSchema.parse({
    schemaVersion: "1.0.0",
    meta: { name, category, tagline, description: cleanPrompt },
    design: { theme: dark ? "dark" : "light", palette, spacing, radius },
    pages: [{ id: "home", label: category === "fashion" || category === "realestate" ? "Explore" : "Home", sections: sectionsFor(category, cleanPrompt) }],
    data: { items, stats: sampleStats(category, currency), testimonials, activities },
  });
}

export function applyEdit(spec: ProductSpec, request: string): ProductSpec | null {
  const next = structuredClone(spec);
  const raw = request.trim();
  const t = raw.toLowerCase();
  if (!t) return null;
  let changed = false;

  if (/\b(dark|black|night mode|dark mode)\b/.test(t) && next.design.theme !== "dark") { next.design.theme = "dark"; changed = true; }
  if (/\b(light|bright mode|light mode)\b/.test(t) && next.design.theme !== "light") { next.design.theme = "light"; changed = true; }
  if (/\b(premium|spacious|elegant|luxury|editorial|airy)\b/.test(t)) { next.design.spacing = "spacious"; next.design.radius = 24; changed = true; }
  if (/\b(minimal|compact|sharp|dense)\b/.test(t)) { next.design.spacing = "compact"; next.design.radius = 10; changed = true; }
  const colors: Array<[RegExp, string]> = [
    [/\b(green|sage|forest|emerald)\b/, "#32734d"], [/\b(orange|terracotta|rust)\b/, "#bd642f"],
    [/\b(blue|navy|cobalt)\b/, "#315fbd"], [/\b(pink|rose)\b/, "#bd6489"],
    [/\b(purple|violet|lavender)\b/, "#7652a8"], [/\b(red|crimson)\b/, "#b83c46"],
    [/\b(yellow|mustard|gold)\b/, "#b58a24"], [/\b(teal|turquoise)\b/, "#168b87"],
  ];
  for (const [pattern, color] of colors) if (pattern.test(t)) { next.design.palette.primary = color; changed = true; break; }

  const rename = raw.match(/(?:change\s+(?:the\s+)?name\s+to|rename\s+(?:it\s+to)?|call\s+it)\s*["“']?(.+?)["”']?$/i);
  if (rename?.[1]) { next.meta.name = rename[1].trim().replace(/["”']$/, "").slice(0, 60); changed = true; }
  const tagline = raw.match(/(?:change\s+(?:the\s+)?tagline\s+to|set\s+(?:the\s+)?tagline\s+to)\s*["“']?(.+?)["”']?$/i);
  if (tagline?.[1]) { next.meta.tagline = tagline[1].trim().replace(/["”']$/, "").slice(0, 120); changed = true; }

  const addSection = (type: Section["type"], title: string) => {
    if (next.pages[0].sections.some(section => section.type === type)) return;
    next.pages[0].sections.push({ id: type + "-" + (next.pages[0].sections.length + 1), type, title, cards: [] });
    changed = true;
  };
  if (/\b(add|include|show)\b.*\b(testimonials?|reviews?)\b/i.test(raw)) addSection("testimonials", "What people are saying");
  if (/\b(add|include|show)\b.*\b(contact|contact form)\b/i.test(raw)) addSection("contact", "Get in touch");
  if (/\b(add|include|show)\b.*\b(pricing|plans|packages)\b/i.test(raw)) addSection("pricing", "Plans and pricing");
  if (/\b(add|include|show)\b.*\b(locations?|address|map)\b/i.test(raw)) addSection("locations", "Find us");
  if (/\b(add|include|show)\b.*\b(stats|metrics)\b/i.test(raw)) addSection("stats", "At a glance");
  if (/\b(add|include|show)\b.*\b(product|item|service|course)\b/i.test(raw)) {
    next.data.items.push({
      id: "item-" + next.data.items.length,
      name: "New item " + (next.data.items.length + 1),
      description: "Add your own description for this item.",
      details: "This is sample content. Replace its details and price with your own.",
      price: currencyFor(next.meta.description, classify(next.meta.description)) + "0",
      category: "New",
      badge: "Just added",
    });
    changed = true;
  }
  return changed ? ProductSpecSchema.parse(next) : null;
}

/** Lightweight deterministic quality checks used by the prompt evaluation suite. */
export function evaluateSpec(spec: ProductSpec): { score: number; issues: string[] } {
  const issues: string[] = [];
  if (!spec.meta.name || spec.meta.name === "Your Brand") issues.push("brand-name-missing");
  if (spec.meta.description.length < 12) issues.push("prompt-context-too-short");
  if (!spec.pages[0]?.sections.some(section => section.type === "hero")) issues.push("hero-section-missing");
  if (spec.pages[0]?.sections.length < 4) issues.push("page-too-sparse");
  if (["cafe", "fashion", "education", "fitness", "realestate"].includes(spec.meta.category) && spec.data.items.length < 3) issues.push("catalog-too-small");
  if (spec.meta.category === "saas" && (spec.data.stats.length < 3 || !spec.pages[0].sections.some(section => section.type === "chart"))) issues.push("dashboard-incomplete");
  return { score: Math.max(0, 100 - issues.length * 15), issues };
}
