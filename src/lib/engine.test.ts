import { describe, expect, it } from "vitest";
import { applyEdit, generateSpec } from "./engine";

describe("generateSpec", () => {
  it("recognizes cafe prompts and extracts the brand", () => {
    const spec = generateSpec("Create a chai cafe called ChaiSutta with menu and locations");
    expect(spec.meta.category).toBe("cafe");
    expect(spec.meta.name).toBe("ChaiSutta");
    expect(spec.pages[0].sections.some(section => section.type === "menu")).toBe(true);
    expect(spec.data.items.length).toBeGreaterThan(0);
  });
  it("creates a SaaS dashboard with metrics and activity", () => {
    const spec = generateSpec("Build a SaaS analytics dashboard called Northstar");
    expect(spec.meta.category).toBe("saas");
    expect(spec.meta.name).toBe("Northstar");
    expect(spec.data.stats.length).toBeGreaterThan(0);
    expect(spec.pages[0].sections.some(section => section.type === "chart")).toBe(true);
  });
  it("creates a fashion storefront", () => {
    const spec = generateSpec("Create a premium fashion store called FormStudio");
    expect(spec.meta.category).toBe("fashion");
    expect(spec.pages[0].sections.some(section => section.type === "products")).toBe(true);
  });
});

describe("applyEdit", () => {
  const base = generateSpec("Create a cafe called ChaiHouse");
  it("applies theme and palette edits without mutating the original", () => {
    const edited = applyEdit(base, "make it dark");
    expect(edited?.design.theme).toBe("dark");
    expect(base.design.theme).toBe("light");
  });
  it("renames the project", () => {
    expect(applyEdit(base, "change name to Chai Corner")?.meta.name).toBe("Chai Corner");
  });
  it("adds a new product", () => {
    expect(applyEdit(base, "add a product")?.data.items.length).toBe(base.data.items.length + 1);
  });
  it("returns null for unsupported edits", () => {
    expect(applyEdit(base, "connect Stripe payments")).toBeNull();
  });
});
