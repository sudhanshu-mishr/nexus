import { z } from "zod";

export const SectionType = z.enum(["hero","about","features","menu","products","pricing","testimonials","locations","contact","stats","chart","table","cta"]);
const PaletteSchema = z.object({ bg:z.string(), surface:z.string(), text:z.string(), muted:z.string(), primary:z.string(), accent:z.string(), border:z.string() });

export const ProductSpecSchema = z.object({
  schemaVersion:z.literal("1.0.0"),
  meta:z.object({ name:z.string().min(1).max(60), category:z.string(), tagline:z.string(), description:z.string() }),
  design:z.object({ theme:z.enum(["light","dark"]), palette:PaletteSchema, spacing:z.enum(["compact","standard","spacious"]), radius:z.number().int().min(0).max(32) }),
  pages:z.array(z.object({ id:z.string(), label:z.string(), sections:z.array(z.object({ id:z.string(), type:SectionType, title:z.string().optional(), subtitle:z.string().optional() })) })).min(1),
  data:z.object({
    items:z.array(z.object({ id:z.string(), name:z.string(), description:z.string(), price:z.string(), category:z.string(), badge:z.string().optional(), details:z.string().optional() })).default([]),
    stats:z.array(z.object({ label:z.string(), value:z.string(), change:z.string().optional() })).default([]),
    testimonials:z.array(z.object({ quote:z.string(), author:z.string(), role:z.string().optional() })).default([]),
    activities:z.array(z.object({ id:z.string(), title:z.string(), detail:z.string(), status:z.string(), amount:z.string().optional() })).default([]),
  }),
});
export type ProductSpec = z.infer<typeof ProductSpecSchema>;
export type Section = ProductSpec["pages"][number]["sections"][number];
