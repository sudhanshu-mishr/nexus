import { describe, expect, it } from "vitest";
import { applyEdit, evaluateSpec, generateSpec } from "./engine";

describe("generateSpec prompt understanding", () => {
  it("recognizes cafe prompts, extracts a quoted brand and keeps requested sections", () => {
    const spec = generateSpec('Create a modern chai cafe called "ChaiSutta" with menu, locations and customer reviews');
    expect(spec.meta.category).toBe("cafe");
    expect(spec.meta.name).toBe("ChaiSutta");
    expect(spec.pages[0].sections.some(section => section.type === "menu")).toBe(true);
    expect(spec.pages[0].sections.some(section => section.type === "locations")).toBe(true);
    expect(spec.pages[0].sections.some(section => section.type === "testimonials")).toBe(true);
    expect(spec.data.items.length).toBeGreaterThan(0);
  });

  it("creates a complete SaaS dashboard", () => {
    const spec = generateSpec("Build a SaaS analytics dashboard called Northstar with metrics and activity");
    expect(spec.meta.category).toBe("saas");
    expect(spec.meta.name).toBe("Northstar");
    expect(spec.data.stats.length).toBeGreaterThan(0);
    expect(spec.pages[0].sections.some(section => section.type === "chart")).toBe(true);
    expect(spec.pages[0].sections.some(section => section.type === "table")).toBe(true);
  });

  it.each([
    ["fashion", "Create a premium fashion store called Form Studio"],
    ["portfolio", "Build a dark designer portfolio called Alex"],
    ["agency", "Create a creative agency website called North Studio"],
    ["education", "Build an online learning academy called SkillSpring"],
    ["fitness", "Create a fitness gym website called Pulse"],
    ["realestate", "Build a real estate property listing website called KeyStone"],
  ])("recognizes the %s business type", (category, prompt) => {
    const spec = generateSpec(prompt);
    expect(spec.meta.category).toBe(category);
    expect(spec.pages[0].sections.length).toBeGreaterThanOrEqual(5);
    expect(spec.pages[0].sections[0].type).toBe("hero");
  });

  it("respects explicit colors, theme and spacing", () => {
    const spec = generateSpec("Create a premium dark green fitness website called Pulse");
    expect(spec.design.theme).toBe("dark");
    expect(spec.design.spacing).toBe("spacious");
    expect(spec.design.palette.primary).toBe("#32734d");
  });

  it("uses explicit currency instructions", () => {
    expect(generateSpec("Create a cafe called Chai House with INR prices").data.items[0].price).toMatch(/^₹/);
    expect(generateSpec("Create a cafe called Chai House with USD prices").data.items[0].price).toMatch(/^\$/);
  });

  it("produces a quality report for a well-formed generated spec", () => {
    const report = evaluateSpec(generateSpec("Create a modern cafe called Chai House with menu and contact"));
    expect(report.score).toBeGreaterThanOrEqual(70);
    expect(report.issues).not.toContain("hero-section-missing");
  });

  it("rejects empty prompts", () => {
    expect(() => generateSpec("   ")).toThrow();
  });
});

describe("applyEdit", () => {
  const base = generateSpec("Create a cafe called ChaiHouse");
  it("applies compound theme, spacing and palette edits without mutating original", () => {
    const edited = applyEdit(base, "make it dark, premium and green");
    expect(edited?.design.theme).toBe("dark");
    expect(edited?.design.spacing).toBe("spacious");
    expect(edited?.design.palette.primary).toBe("#32734d");
    expect(base.design.theme).toBe("light");
  });
  it("renames the project", () => {
    expect(applyEdit(base, "change name to Chai Corner")?.meta.name).toBe("Chai Corner");
  });
  it("updates tagline", () => {
    expect(applyEdit(base, "change tagline to A warmer cup every day")?.meta.tagline).toBe("A warmer cup every day");
  });
  it("adds sections and products", () => {
    const edited = applyEdit(base, "add a contact section and a product");
    expect(edited?.pages[0].sections.some(section => section.type === "contact")).toBe(true);
    expect(edited?.data.items.length).toBe(base.data.items.length + 1);
  });
  it("returns null for unsupported edits", () => {
    expect(applyEdit(base, "connect Stripe payments")).toBeNull();
  });
});
