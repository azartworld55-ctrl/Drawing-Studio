/* Drawing Studio 2.0 — dependency-free raster brush engine.
 * All strokes are painted into ordinary Canvas 2D layers; no SVG or remote services.
 */
(function (root) {
  'use strict';
  const TAU = Math.PI * 2;
  function random(seed) {
    let s = (seed >>> 0) || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  function hexRgb(hex) {
    const v = parseInt(String(hex).replace('#',''), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }
  function stamp(ctx, x, y, radius, color, alpha, shape, rng) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    if (shape === 'square') ctx.fillRect(x-radius, y-radius, radius*2, radius*2);
    else {
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * (shape === 'flat' ? .42 : 1), rng()*TAU, 0, TAU);
      ctx.fill();
    }
  }
  function paintStroke(ctx, points, options) {
    const o = Object.assign({type:'round', color:'#20202a', size:12, opacity:1, seed:17, pressure:true}, options || {});
    if (!points || !points.length) return;
    const rnd = random(o.seed), size = Math.max(.35, Number(o.size)||1);
    const rgb = hexRgb(o.color), hex = o.color;
    ctx.save(); ctx.globalAlpha = 1; ctx.lineCap='round'; ctx.lineJoin='round';
    if (points.length === 1) points = [points[0], points[0]];
    const spacing = Math.max(1, size * (o.type === 'airbrush' ? .13 : .16));
    let distance = 0, previous = points[0];
    const total = points.reduce((sum,p,i)=> i ? sum+Math.hypot(p.x-points[i-1].x,p.y-points[i-1].y) : 0, 0);
    const steps = Math.max(1, Math.ceil(total/spacing));
    let segment=1, segmentStart=points[0], segmentEnd=points[1] || points[0], segmentLength=Math.hypot(segmentEnd.x-segmentStart.x,segmentEnd.y-segmentStart.y);
    let walked=0;
    for(let i=0;i<=steps;i++){
      const target=total*i/steps;
      while(segment<points.length-1 && walked+segmentLength<target){walked+=segmentLength;segment++;segmentStart=points[segment-1];segmentEnd=points[segment];segmentLength=Math.hypot(segmentEnd.x-segmentStart.x,segmentEnd.y-segmentStart.y)||1;}
      const t=Math.max(0,Math.min(1,(target-walked)/(segmentLength||1)));
      const p={x:segmentStart.x+(segmentEnd.x-segmentStart.x)*t,y:segmentStart.y+(segmentEnd.y-segmentStart.y)*t,pressure:(segmentStart.pressure??.7)+((segmentEnd.pressure??.7)-(segmentStart.pressure??.7))*t};
      const pressure=o.pressure ? (.22 + .78*Math.max(.05,p.pressure)) : 1;
      const r=size*pressure/2;
      if(o.type==='airbrush'){
        const count=Math.max(5,Math.round(size*.9));
        for(let k=0;k<count;k++){const a=rnd()*TAU,rad=Math.sqrt(rnd())*r*1.8;stamp(ctx,p.x+Math.cos(a)*rad,p.y+Math.sin(a)*rad,Math.max(.35,size*.055),hex,(o.opacity||1)*.055,'round',rnd);}
      } else if(o.type==='watercolor'){
        for(let k=0;k<7;k++){const a=rnd()*TAU,rad=Math.sqrt(rnd())*r*.9;stamp(ctx,p.x+Math.cos(a)*rad,p.y+Math.sin(a)*rad,Math.max(.5,r*(.18+rnd()*.28)),hex,(o.opacity||1)*.055,'round',rnd);}
        stamp(ctx,p.x,p.y,r*.78,hex,(o.opacity||1)*.035,'round',rnd);
      } else if(o.type==='pencil'){
        for(let k=0;k<3;k++){const ox=(rnd()-.5)*r*.9,oy=(rnd()-.5)*r*.9;stamp(ctx,p.x+ox,p.y+oy,Math.max(.35,r*.22),hex,(o.opacity||1)*.28,'flat',rnd);}
      } else if(o.type==='marker'){
        stamp(ctx,p.x,p.y,r,hex,(o.opacity||1)*.28,'flat',rnd);
      } else if(o.type==='oil'){
        stamp(ctx,p.x+(rnd()-.5)*r*.22,p.y+(rnd()-.5)*r*.22,r*(.72+rnd()*.35),hex,(o.opacity||1)*.78,'flat',rnd);
        if(r>3 && rnd()>.35) stamp(ctx,p.x-r*.12,p.y-r*.12,r*.22,'#ffffff',(o.opacity||1)*.12,'flat',rnd);
      } else {
        stamp(ctx,p.x,p.y,r,hex,o.opacity,'round',rnd);
      }
      previous=p;
    }
    ctx.restore(); ctx.globalAlpha=1;
  }
  function softGlow(ctx,x,y,r,color,alpha) {
    ctx.save(); const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,color); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.globalAlpha=alpha==null?1:alpha;ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();
  }
  function paperTexture(ctx,w,h,amount,seed) {
    const rnd=random(seed||91);ctx.save();
    for(let i=0;i<(amount||1800);i++){ctx.globalAlpha=.018+rnd()*.035;ctx.fillStyle=rnd()>.5?'#fff':'#302b38';ctx.fillRect(rnd()*w,rnd()*h,1+rnd()*1.5,1+rnd()*1.5);}
    ctx.restore();
  }
  root.DrawingStudioBrushes={paintStroke,softGlow,paperTexture,random};
})(window);
