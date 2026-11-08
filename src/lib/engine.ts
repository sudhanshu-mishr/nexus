import { ProductSpecSchema, type ProductSpec, type Section } from "./spec";

type Category = "cafe" | "fashion" | "saas" | "generic";
const palettes:Record<Category,ProductSpec["design"]["palette"]> = {
  cafe:{bg:"#f8f1e7",surface:"#fffaf2",text:"#2d2118",muted:"#78685b",primary:"#b85d2a",accent:"#7b452b",border:"#e7d8c5"},
  fashion:{bg:"#f3f0eb",surface:"#fffdfa",text:"#201d1a",muted:"#77716a",primary:"#272522",accent:"#a78a63",border:"#e4dfd7"},
  saas:{bg:"#f4f7fb",surface:"#ffffff",text:"#172337",muted:"#64748b",primary:"#315fbd",accent:"#13a68a",border:"#dce4ef"},
  generic:{bg:"#f6f5f2",surface:"#ffffff",text:"#242424",muted:"#737373",primary:"#5650a8",accent:"#b28a55",border:"#e7e5e4"},
};

function classify(prompt:string):Category {
  const t=prompt.toLowerCase();
  if (/\b(dashboard|analytics|saas|crm|admin panel|metrics|portal|project management)\b/.test(t)) return "saas";
  if (/\b(fashion|clothing|apparel|boutique|outfit|streetwear)\b/.test(t)) return "fashion";
  if (/\b(chai|cafe|café|coffee|restaurant|bakery|menu|food|pizza|burger)\b/.test(t)) return "cafe";
  return "generic";
}
function extractBrand(prompt:string):string {
  const match=prompt.match(/(?:called|named)\s+["']?([A-Z][A-Za-z0-9&'-]*(?:\s+[A-Z][A-Za-z0-9&'-]*){0,2})/);
  if (match?.[1]) return match[1].trim().replace(/["']$/,"").slice(0,60);
  const forMatch=prompt.match(/\bfor\s+["']?([A-Z][A-Za-z0-9&'-]{1,24})/);
  if (forMatch?.[1] && !/^(a|an|the)$/i.test(forMatch[1])) return forMatch[1];
  return "Your Brand";
}
function currencyFor(prompt:string,category:Category):string {
  if (/($|\binr\b|₹|rupee|india|indian)/i.test(prompt)) return /($|\binr\b|₹|rupee|india|indian)/i.test(prompt) ? "₹" : "$";
  return category==="cafe"||category==="fashion" ? "₹" : "$";
}
function sectionsFor(category:Category):Section[] {
  const types:Section["type"][]=category==="cafe"
    ? ["hero","features","menu","about","testimonials","locations","contact"]
    : category==="fashion"
      ? ["hero","features","products","about","testimonials","cta"]
      : category==="saas"
        ? ["hero","stats","chart","features","table","pricing","cta"]
        : ["hero","features","about","products","testimonials","contact"];
  const titles:Record<Section["type"],string>={hero:"A better experience starts here",about:"A little about us",features:category==="saas"?"Everything in one clear view":"Made with intention",menu:"A few favourites",products:category==="fashion"?"The collection":"Explore the range",testimonials:"Kind words",locations:"Come find us",contact:"Let's talk",stats:"Your business at a glance",chart:"Performance over time",table:"Recent activity",pricing:"Simple plans that scale",cta:"Ready when you are"};
  return types.map((type,index)=>({id:type+"-"+index,type,title:titles[type]}));
}

export function generateSpec(prompt:string):ProductSpec {
  const t=prompt.toLowerCase(),category=classify(prompt),name=extractBrand(prompt),palette={...palettes[category]},currency=currencyFor(prompt,category);
  if (/\b(orange|terracotta)\b/.test(t)) palette.primary="#bd642f";
  if (/\b(green|sage|forest)\b/.test(t)) palette.primary="#32734d";
  if (/\b(blue|navy)\b/.test(t)) palette.primary="#315fbd";
  if (/\bpink\b/.test(t)) palette.primary="#bd6489";
  if (/\bpurple\b/.test(t)) palette.primary="#7652a8";

  const rawItems:Array<[string,string,string,string,string]>=category==="cafe"
    ? [["Masala Chai","Slow-brewed with ginger, cardamom and a little warmth.","45","Chai","Bestseller"],["Kulhad Chai","A familiar favourite served in an earthen cup.","60","Chai","House favourite"],["Saffron Latte","Aromatic, smooth and gently sweet.","85","Specials","New"],["Paneer Puff","Flaky pastry with a savoury, spiced filling.","55","Bites",""],["Cold Coffee","Chilled, creamy and made for long afternoons.","95","Specials",""],["Bun Maska","Soft bun, toasted golden with a rich buttery centre.","50","Bites",""]]
    : category==="fashion"
      ? [["Everyday Shirt","An easy layer with a considered fit and soft finish.","1490","Clothing","Bestseller"],["Structured Tote","A clean silhouette with room for the everyday.","2250","Accessories","New"],["Relaxed Trousers","An effortless shape designed for movement.","1890","Clothing",""],["Classic Jacket","A versatile outer layer with timeless details.","3490","Outerwear","Limited"],["Essential Tee","A refined everyday staple.","890","Clothing",""],["Canvas Carryall","A practical companion for wherever the day goes.","1290","Accessories",""]]
      : category==="saas"
        ? [["Starter","The essentials for a focused team.","19","Plans","For individuals"],["Growth","More visibility and control as you scale.","49","Plans","Most popular"],["Scale","Advanced workflows for ambitious teams.","99","Plans","For teams"]]
        : [["The Essentials","A thoughtful starting point for your next step.","29","Featured","Popular"],["The Signature","A little more room for the details that matter.","59","Featured","Recommended"],["The Complete","A complete experience with more flexibility.","89","Featured",""]];
  const stats=category==="saas"?[{label:"Active users",value:"12,840",change:"+12.8%"},{label:"Monthly revenue",value:"$48.2k",change:"+8.4%"},{label:"Conversion rate",value:"4.82%",change:"+1.2%"},{label:"Retention",value:"94.2%",change:"+2.1%"}]:[];
  const activities=category==="saas"?[{id:"a1",title:"New workspace created",detail:"Northstar Studio · 8 min ago",status:"Completed",amount:"$49.00"},{id:"a2",title:"Subscription renewed",detail:"Morrow Labs · 32 min ago",status:"Completed",amount:"$99.00"},{id:"a3",title:"Payment needs review",detail:"Atelier Co. · 1 hr ago",status:"Pending",amount:"$19.00"},{id:"a4",title:"New team member",detail:"Orbit Design · 2 hrs ago",status:"Completed",amount:""}]:[];

  return ProductSpecSchema.parse({
    schemaVersion:"1.0.0",
    meta:{name,category,tagline:category==="cafe"?"A slower cup. A warmer welcome.":category==="fashion"?"Considered essentials, made to be lived in.":category==="saas"?"Clarity for the work that moves you forward.":"A thoughtful digital experience, made around you.",description:prompt},
    design:{theme:/\b(dark|black|night)\b/.test(t)?"dark":"light",palette,spacing:/\b(premium|spacious|luxury|editorial)\b/.test(t)?"spacious":"standard",radius:/\b(minimal|sharp|square)\b/.test(t)?10:18},
    pages:[{id:"home",label:category==="fashion"?"Shop":"Home",sections:sectionsFor(category)}],
    data:{
      items:rawItems.map(([itemName,description,price,itemCategory,badge],index)=>({id:"item-"+index,name:itemName,description,details:description+" Thoughtfully selected and presented with care.",price:currency+price,category:itemCategory,...(badge?{badge}:{})})),
      stats,
      testimonials:[{quote:"The details feel thoughtful, and the whole experience is effortless.",author:"A happy customer",role:"Returning customer"},{quote:"Exactly the kind of quality and care we were looking for.",author:"A returning customer",role:"Verified customer"}],
      activities,
    },
  });
}

export function applyEdit(spec:ProductSpec,request:string):ProductSpec|null {
  const next=structuredClone(spec),t=request.trim().toLowerCase();
  if (!t) return null;
  let changed=false;

  if (/\b(dark|black|night mode)\b/.test(t)) {next.design.theme="dark";changed=true;}
  if (/\b(light|bright mode)\b/.test(t)) {next.design.theme="light";changed=true;}
  if (/\b(premium|spacious|elegant|luxury)\b/.test(t)) {next.design.spacing="spacious";next.design.radius=24;changed=true;}
  if (/\b(minimal|compact|sharp)\b/.test(t)) {next.design.spacing="compact";next.design.radius=10;changed=true;}
  if (/\b(green|sage)\b/.test(t)) {next.design.palette.primary="#32734d";changed=true;}
  if (/\b(orange|terracotta)\b/.test(t)) {next.design.palette.primary="#bd642f";changed=true;}
  if (/\b(blue|navy)\b/.test(t)) {next.design.palette.primary="#315fbd";changed=true;}
  if (/\bpink\b/.test(t)) {next.design.palette.primary="#bd6489";changed=true;}
  if (/\bpurple\b/.test(t)) {next.design.palette.primary="#7652a8";changed=true;}

  const rename=request.match(/(?:change (?:the )?name to|rename (?:it to)?)\s*["']?(.+?)["']?$/i);
  if (rename?.[1]) {next.meta.name=rename[1].trim().replace(/["']$/,"").slice(0,60);changed=true;}
  const tagline=request.match(/change (?:the )?tagline to\s*["']?(.+?)["']?$/i);
  if (tagline?.[1]) {next.meta.tagline=tagline[1].trim().replace(/["']$/,"").slice(0,120);changed=true;}

  const addSection=(type:Section["type"],title:string)=>{
    if(next.pages[0].sections.some(section=>section.type===type)) return;
    next.pages[0].sections.push({id:type+"-"+Date.now(),type,title});
    changed=true;
  };
  if (/add (?:a )?(?:testimonial|reviews?)/i.test(request)) addSection("testimonials","What people are saying");
  if (/add (?:a )?contact/i.test(request)) addSection("contact","Get in touch");
  if (/add (?:a )?pricing/i.test(request)) addSection("pricing","Plans and pricing");
  if (/add (?:a )?(?:product|item)/i.test(request)) {
    next.data.items.push({id:"item-"+Date.now(),name:"New item "+(next.data.items.length+1),description:"Add your own description for this item.",details:"This is a sample item. Replace its details and price with your own.",price:next.meta.category==="cafe"||next.meta.category==="fashion"?"₹0":"$0",category:"New",badge:"Just added"});
    changed=true;
  }
  return changed ? ProductSpecSchema.parse(next) : null;
}
