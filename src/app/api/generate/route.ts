import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { ProductSpecSchema } from "@/lib/spec";

export const runtime = "nodejs";
export const maxDuration = 60;

const RequestSchema=z.object({
  prompt:z.string().trim().min(12).max(6000),
  mode:z.enum(["generate","edit"]).default("generate"),
  currentSpec:ProductSpecSchema.optional(),
});

const SYSTEM_INSTRUCTIONS=`You are Nexus, an expert website art director, UX strategist, conversion copywriter and frontend design-system planner.
Your job is to create a genuinely bespoke website specification from the user's exact brief. Do not select or imitate a fixed template. Make deliberate design decisions based on the business, audience, content, desired mood and conversion goal.
Return ONLY valid JSON matching the requested schema. Do not include markdown fences or commentary.
Design rules:
- Create a distinct visual direction, not generic SaaS gradients or the same hero/cards layout every time.
- Choose section count, order, types, layouts and content to suit this exact brief. Use 4-9 sections and meaningful section-specific copy.
- Respect requested brand name, palette, typography mood, pages, features and audience. If no brand name is supplied, invent a plausible one and do not use "Your Brand".
- Write real, specific, coherent copy. Never use lorem ipsum, filler, generic claims, fabricated reviews, fabricated statistics, or fake addresses.
- Use data arrays only when appropriate. Prices must be plausible and consistent with the requested region/currency. If the brief does not request testimonials, don't invent them.
- Use section cards to supply specific content for features, services, process, collections, team, FAQs, etc. The custom section type supports original content arrangements.
- Choose a palette with readable contrast and all colors as six-digit hex values.
- Keep interactions preview-safe; do not claim payments, booking, authentication, or external integrations are live.
- For edit mode, preserve the existing brand identity and all unrelated content. Apply the user's requested changes and do not remove unrelated sections. You may reorder or add sections only if asked or necessary.
Schema:
{
 "schemaVersion":"1.0.0",
 "meta":{"name":"string","category":"string","tagline":"string","description":"string"},
 "design":{"theme":"light|dark","palette":{"bg":"#RRGGBB","surface":"#RRGGBB","text":"#RRGGBB","muted":"#RRGGBB","primary":"#RRGGBB","accent":"#RRGGBB","border":"#RRGGBB"},"spacing":"compact|standard|spacious","radius":number 0-32},
 "pages":[{"id":"string","label":"string","sections":[{"id":"string","type":"hero|about|features|menu|products|pricing|testimonials|locations|contact|stats|chart|table|cta|custom","title":"optional string","subtitle":"optional string","eyebrow":"optional string","description":"optional string","layout":"split|grid|stack|editorial|banner|metrics","cards":[{"label":"optional string","title":"string","description":"string","value":"optional string"}]}]}],
 "data":{"items":[{"id":"string","name":"string","description":"string","price":"string","category":"string","badge":"optional string","details":"optional string"}],"stats":[{"label":"string","value":"string","change":"optional string"}],"testimonials":[{"quote":"string","author":"string","role":"optional string"}],"activities":[{"id":"string","title":"string","detail":"string","status":"string","amount":"optional string"}]}
}
Include data keys even when arrays are empty. At least one page, 3-12 sections per page. Keep the result coherent and tailored.`;

function getText(result: { text?: string | (()=>string) }) {
  return typeof result.text==="function" ? result.text() : result.text ?? "";
}

export async function POST(request:Request) {
  try {
    const apiKey=process.env.GEMINI_API_KEY;
    if(!apiKey) return NextResponse.json({error:"Gemini is not configured. Add GEMINI_API_KEY to .env.local and your Vercel environment variables."},{status:503});
    const body=RequestSchema.parse(await request.json());
    const ai=new GoogleGenAI({apiKey});
    const model=process.env.GEMINI_MODEL||"gemini-2.5-flash";
    const task=body.mode==="edit"
      ? `EDIT REQUEST: ${body.prompt}\nCURRENT VALID WEBSITE SPECIFICATION:\n${JSON.stringify(body.currentSpec)}\nReturn the complete updated specification. Preserve unrelated parts.`
      : `NEW WEBSITE BRIEF:\n${body.prompt}\nCreate a complete bespoke specification.`;
    let lastError="The model returned invalid JSON.";
    for(let attempt=0;attempt<2;attempt++){
      const result=await ai.models.generateContent({
        model,
        contents:attempt===0?task:`${task}\n\nYour previous response failed validation: ${lastError}. Correct the issues and return valid complete JSON only.`,
        config:{systemInstruction:SYSTEM_INSTRUCTIONS,responseMimeType:"application/json",temperature:attempt===0?0.85:0.35},
      });
      const raw=getText(result).trim();
      try {
        const parsed=ProductSpecSchema.parse(JSON.parse(raw));
        return NextResponse.json({spec:parsed,model});
      } catch(error) {
        lastError=error instanceof z.ZodError?error.issues.map(i=>i.path.join(".")+": "+i.message).slice(0,8).join("; "):"Malformed JSON";
      }
    }
    return NextResponse.json({error:"The AI could not produce a valid website specification. Please try refining your prompt.",details:lastError},{status:502});
  } catch(error) {
    if(error instanceof z.ZodError) return NextResponse.json({error:"Invalid generation request.",details:error.issues},{status:400});
    console.error("Nexus Gemini generation error:",error);
    return NextResponse.json({error:"Website generation failed. Check the Gemini API key, model access and quota, then try again."},{status:502});
  }
}
