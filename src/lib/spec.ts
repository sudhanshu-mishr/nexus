import { z } from "zod";

export const SectionType = z.enum(["hero","about","features","menu","products","pricing","testimonials","locations","contact","stats","chart","table","cta","custom"]);
const PaletteSchema = z.object({
  bg:z.string().regex(/^#[0-9a-fA-F]{6}$/),
  surface:z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text:z.string().regex(/^#[0-9a-fA-F]{6}$/),
  muted:z.string().regex(/^#[0-9a-fA-F]{6}$/),
  primary:z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent:z.string().regex(/^#[0-9a-fA-F]{6}$/),
  border:z.string().regex(/^#[0-9a-fA-F]{6}$/),
});
const ContentCardSchema=z.object({
  label:z.string().max(80).optional(),
  title:z.string().min(1).max(100),
  description:z.string().max(500),
  value:z.string().max(40).optional(),
});
export const SectionSchema=z.object({
  id:z.string().min(1).max(80),
  type:SectionType,
  title:z.string().max(120).optional(),
  subtitle:z.string().max(240).optional(),
  eyebrow:z.string().max(80).optional(),
  description:z.string().max(800).optional(),
  layout:z.enum(["split","grid","stack","editorial","banner","metrics"]).optional(),
  cards:z.array(ContentCardSchema).max(8).default([]),
});
export const ProductSpecSchema = z.object({
  schemaVersion:z.literal("1.0.0"),
  meta:z.object({ name:z.string().min(1).max(60), category:z.string().min(1).max(80), tagline:z.string().min(1).max(180), description:z.string().min(1).max(800) }),
  design:z.object({ theme:z.enum(["light","dark"]), palette:PaletteSchema, spacing:z.enum(["compact","standard","spacious"]), radius:z.number().int().min(0).max(32) }),
  pages:z.array(z.object({ id:z.string().min(1).max(80), label:z.string().min(1).max(60), sections:z.array(SectionSchema).min(3).max(12) })).min(1).max(3),
  data:z.object({
    items:z.array(z.object({ id:z.string(), name:z.string(), description:z.string(), price:z.string(), category:z.string(), badge:z.string().optional(), details:z.string().optional() })).max(16).default([]),
    stats:z.array(z.object({ label:z.string(), value:z.string(), change:z.string().optional() })).max(8).default([]),
    testimonials:z.array(z.object({ quote:z.string(), author:z.string(), role:z.string().optional() })).max(8).default([]),
    activities:z.array(z.object({ id:z.string(), title:z.string(), detail:z.string(), status:z.string(), amount:z.string().optional() })).max(12).default([]),
  }),
});
export type ProductSpec = z.infer<typeof ProductSpecSchema>;
export type Section = ProductSpec["pages"][number]["sections"][number];
