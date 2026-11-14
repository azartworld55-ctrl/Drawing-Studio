/* Drawing Studio — expressive digital-paint workflow.
 * Converts gesture paths into dense, pressure-varied raster brush marks.
 * MyPaint/libmypaint is preferred; local procedural brushes are the free fallback.
 * This is deliberately a stroke-first API: no SVG paths or shape primitives.
 */
(() => {
'use strict';
const TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const dist=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
function smooth(points,steps=5){
 if(points.length<3)return points.map(p=>({...p}));
 const out=[];
 for(let i=0;i<points.length-1;i++){
  const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];
  for(let j=0;j<steps;j++){const t=j/steps,t2=t*t,t3=t2*t;
   out.push({x:.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),y:.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3),pressure:lerp(p1.pressure??.7,p2.pressure??.7,t)});}
 }
 out.push({...points[points.length-1]});return out;
}
function seeded(seed){let s=(seed>>>0)||1;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296);}
async function create(ctx,opts={}){
 const color=opts.color||'#282333',size=opts.size||12,opacity=opts.opacity??1;
 let painter=null,preset=null,engine='procedural';
 try{if(window.MyPaintEngine){const api=await MyPaintEngine.load();painter=await MyPaintEngine.createPainter();painter.setTarget(ctx);preset=api.presets.find(p=>/oil|dry|pencil|bristle/i.test(p.name))||api.presets[0];engine='MyPaint/libmypaint';}}catch(e){}
 const fallback=(points,o)=>{
  if(!window.DrawingStudioBrushes)return;
  const pts=points.map(p=>({x:p.x,y:p.y,pressure:p.pressure??.7}));
  DrawingStudioBrushes.paintStroke(ctx,pts,{type:o.fallback||'oil',color:o.color||color,size:o.size||size,opacity:o.opacity??opacity,seed:o.seed||73,pressure:true});
 };
 function stroke(points,o={}){
  if(!points||points.length<2)return;
  const opts={color:o.color||color,size:o.size||size,opacity:o.opacity??opacity,preset:o.preset||preset,pressure:true};
  const pts=smooth(points,o.smoothing??4);
  if(painter&&opts.preset){
   try{const t=performance.now();painter.begin({...pts[0],time:t},{...opts,pressure:true});let last=t;
    for(let i=1;i<pts.length;i++){const now=t+i*16;pts[i].time=now;painter.move([pts[i]],{...opts,pressure:true});last=now;}painter.end();return;
   }catch(e){try{painter.end();}catch(_){}}
  }
  fallback(pts,{...opts,fallback:o.fallback,seed:o.seed});
 }
 function hatch(points,o={}){
  const rnd=seeded(o.seed||19),count=o.count||8,spread=o.spread||18;
  for(let i=0;i<count;i++){const off=(rnd()-.5)*spread,len=.65+rnd()*.7;
   stroke(points.map((p,j)=>({x:p.x+off,y:p.y+(j/(points.length-1)-.5)*spread*.5,pressure:(p.pressure??.7)*len})),{...o,size:(o.size||size)*(.35+rnd()*.4),opacity:(o.opacity??opacity)*(.35+rnd()*.35),seed:(o.seed||19)+i,fallback:'pencil'});
  }
 }
 function wash(points,o={}){
  const passes=o.passes||5;
  for(let i=0;i<passes;i++)stroke(points,{...o,size:(o.size||size)*(1+i*.42),opacity:(o.opacity??opacity)*(.12+i*.035),fallback:'watercolor',seed:(o.seed||31)+i});
 }
 function dry(points,o={}){stroke(points,{...o,fallback:'pencil',size:o.size||size,opacity:o.opacity??opacity});}
 return {stroke,hatch,wash,dry,engine};
}
window.DrawingStudioPaintWorkflow={create,smooth};
})();
