"use client";
import {useEffect,useState} from "react";
import {ArrowUpRight,Check,Monitor,RotateCcw,Smartphone,Sparkles,Tablet,WandSparkles,LoaderCircle} from "lucide-react";
import {ProductSpecSchema,type ProductSpec} from "@/lib/spec";
import {Preview} from "@/components/Preview";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {toast as sonnerToast} from "sonner";

type Version={label:string;spec:ProductSpec;createdAt:number};
const KEY="nexus-project";
const examples=[
 {label:"Immersive restaurant",prompt:"Create an immersive website for KAI, a contemporary Japanese restaurant in Mumbai. Use a dark ink background, warm ivory typography and restrained vermilion accents. Editorial art direction, oversized Japanese-inspired typography, a dramatic split hero, chef's philosophy, signature tasting menu, private dining and reservation enquiry. Make it feel like a high-end independent restaurant, not a generic template."},
 {label:"Independent fashion label",prompt:"Design a distinctive editorial storefront for FORM/01, an independent sustainable fashion label. Warm off-white canvas, charcoal typography and acid-lime accents. Asymmetric magazine layout, oversized campaign headline, collection stories, product grid, material and sustainability section, and newsletter sign-up. Minimal but expressive."},
 {label:"Creative technology studio",prompt:"Build a bold portfolio for a creative technology studio called MONOCHROME. Experimental grid, cobalt and near-black palette, oversized typography, selected case studies, capabilities, process, studio point of view and contact. The composition should feel like an award-winning design studio."}
];
type Device="desktop"|"tablet"|"mobile";
export default function Home(){
 const [prompt,setPrompt]=useState(examples[0].prompt),[versions,setVersions]=useState<Version[]>([]),[active,setActive]=useState(0),[edit,setEdit]=useState(""),[device,setDevice]=useState<Device>("desktop"),[loaded,setLoaded]=useState(false),[busy,setBusy]=useState(false);
 const current=versions[active];
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const parsed=JSON.parse(raw) as Version[];if(Array.isArray(parsed)){const compatible=parsed.flatMap(v=>{const result=ProductSpecSchema.safeParse(v?.spec);return result.success?[{...v,spec:result.data}]:[];});setVersions(compatible);setActive(Math.max(0,compatible.length-1));}}}catch{localStorage.removeItem(KEY);}finally{setLoaded(true);}},[]);
 useEffect(()=>{if(!loaded)return;if(versions.length)localStorage.setItem(KEY,JSON.stringify(versions));else localStorage.removeItem(KEY);},[versions,loaded]);
 function save(label:string,spec:ProductSpec){const next=[...versions.slice(0,active+1),{label,spec,createdAt:Date.now()}].slice(-30);setVersions(next);setActive(next.length-1);}
 async function runAgent(mode:"generate"|"edit"){
  const instruction=(mode==="generate"?prompt:edit).trim();
  if(!instruction||busy)return;
  if(mode==="edit"&&!current)return;
  setBusy(true);
  sonnerToast(mode==="generate"?"Nexus is designing your website…":"Nexus is refining your design…");
  try{
   const response=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:instruction,mode,...(mode==="edit"?{currentSpec:current?.spec}:{})})});
   const payload=await response.json();
   if(!response.ok)throw new Error(payload.error||"Generation failed");
   if(!payload.spec)throw new Error("The design agent returned an empty result.");
   save(mode==="generate"?"AI-generated concept":instruction.slice(0,48),payload.spec as ProductSpec);
   if(mode==="edit")setEdit("");
   sonnerToast("Your custom website preview is ready.");
  }catch(error){
   console.error(error);
   sonnerToast(error instanceof Error?error.message:"Could not generate the preview. Your previous version is safe.");
  }finally{setBusy(false);}
 }
 function reset(){setVersions([]);setActive(0);setEdit("");setPrompt("");}
 if(!loaded)return <main className="ambient min-h-screen"/>;
 return <main className="ambient min-h-screen">
 {!current?<div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
  <header className="mb-16 flex items-center justify-between"><div className="text-lg font-semibold">nexus<span className="text-amber-400">.</span></div><div className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-400">Gemini design agent · Dynamic generation</div></header>
  <div className="max-w-4xl rise"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs text-amber-200"><Sparkles size={14}/> From brief to original design</div>
   <h1 className="font-display text-5xl leading-[1.02] md:text-7xl">Imagine it.<br/><span className="text-amber-300">Nexus creates it.</span></h1>
   <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">Describe the business, audience, visual direction and features. Gemini plans a fresh website composition and generates the content for your live preview.</p>
   <div className="glass mt-10 rounded-3xl p-4 md:p-6"><Textarea value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter")void runAgent("generate");}} className="min-h-40 w-full resize-y border-0 bg-transparent p-2 text-base leading-7 text-white shadow-none focus-visible:ring-0" placeholder="Describe the website you want Nexus to create…"/><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"><span className="text-xs text-zinc-500">Gemini creates a new design from your brief · Ctrl / ⌘ + Enter</span><Button onClick={()=>void runAgent("generate")} disabled={!prompt.trim()||busy} size="lg">{busy?<><LoaderCircle className="animate-spin" size={16}/> Designing…</>:<>Generate with AI <ArrowUpRight size={16}/></>}</Button></div></div>
   <div className="mt-7 grid gap-3 md:grid-cols-3">{examples.map(x=><button key={x.label} onClick={()=>setPrompt(x.prompt)} className="rounded-2xl border border-white/10 p-4 text-left hover:border-amber-300/40"><span className="text-[10px] uppercase tracking-wider text-amber-200/70">{x.label}</span><p className="mt-2 line-clamp-4 text-xs leading-5 text-zinc-400">{x.prompt}</p></button>)}</div>
  </div><footer className="mt-20 text-xs text-zinc-600">Nexus Preview Studio · AI-generated concepts · Preview interactions are simulations</footer>
 </div>:<div className="min-h-screen">
  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6"><div className="flex items-center gap-3"><button onClick={reset} className="font-semibold">nexus<span className="text-amber-400">.</span></button><span className="hidden text-xs text-zinc-500 sm:inline">{current.spec.meta.name} · v{active+1}</span></div><div className="flex items-center gap-1">{([[ "desktop",Monitor],["tablet",Tablet],["mobile",Smartphone]] as const).map(([key,Icon])=><button key={key} aria-label={key+" preview"} onClick={()=>setDevice(key)} className={`rounded-lg p-2 ${device===key?"bg-amber-300 text-zinc-950":"text-zinc-400 hover:bg-white/10"}`}><Icon size={17}/></button>)}<button onClick={()=>setActive(Math.max(0,active-1))} disabled={active===0} aria-label="Previous version" className="ml-2 rounded-lg p-2 text-zinc-400 disabled:opacity-25"><RotateCcw size={17}/></button><button onClick={()=>setActive(versions.length-1)} disabled={active===versions.length-1} aria-label="Latest version" className="rounded-lg p-2 text-zinc-400 disabled:opacity-25"><Check size={17}/></button></div></header>
  <div className="grid min-h-[calc(100vh-57px)] lg:grid-cols-[minmax(0,1fr)_320px]"><div className="overflow-auto bg-[#07080b] p-3 md:p-5"><div className="mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300" style={{width:device==="mobile"?390:device==="tablet"?768:"100%",maxWidth:"100%",minHeight:"calc(100vh - 100px)"}}><Preview spec={current.spec}/></div></div>
   <aside className="border-t border-white/10 p-5 lg:border-l lg:border-t-0"><div className="flex items-center gap-2 text-xs uppercase tracking-[.2em] text-zinc-500"><WandSparkles size={14}/> AI design agent</div><p className="mt-2 text-sm leading-6 text-zinc-400">Ask Gemini to change the composition, visual style, content or sections. It will preserve unrelated parts of your current design.</p><textarea value={edit} onChange={e=>setEdit(e.target.value)} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter")void runAgent("edit");}} placeholder={"Make the hero cinematic and more visual…\nMove the menu above the story section…\nUse a warmer palette and add a private dining section…"} className="mt-5 min-h-36 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-6 outline-none focus:border-amber-300/50"/><button onClick={()=>void runAgent("edit")} disabled={!edit.trim()||busy} className="mt-2 w-full rounded-xl bg-amber-300 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-40">{busy?<><LoaderCircle className="mr-2 inline animate-spin" size={14}/>Working…</>:<>Apply AI edit <ArrowUpRight size={14} className="ml-1 inline"/></>}</button>
    <div className="mt-8 flex justify-between text-xs uppercase tracking-[.2em] text-zinc-500"><span>Version history</span><span>{versions.length}/30</span></div><div className="mt-3 space-y-2">{versions.map((v,i)=><button key={v.createdAt+"-"+i} onClick={()=>setActive(i)} className={`w-full rounded-xl border p-3 text-left text-xs ${i===active?"border-amber-300/40 bg-amber-300/5 text-amber-100":"border-white/10 text-zinc-400"}`}><div className="flex justify-between"><span>Version {i+1}</span>{i===active&&<Check size={13}/>}</div><div className="mt-1 truncate opacity-60">{v.label}</div></button>)}</div>
    <p className="mt-8 text-xs leading-5 text-zinc-600">Forms, checkout, bookings and integrations are preview simulations. No real orders or messages are sent.</p><button onClick={reset} className="mt-5 w-full rounded-xl border border-white/10 py-3 text-xs text-zinc-400 hover:bg-white/5">Start a new project</button>
   </aside></div>
 </div>}
 </main>;
}
