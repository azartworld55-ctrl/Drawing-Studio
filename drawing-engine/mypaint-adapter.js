/* Drawing Studio 3.0 — MyPaint/libmypaint WebAssembly adapter.
 * Upstream: https://github.com/eliot-akira/brushlib-wasm
 * One WASM painter is rebound to the currently active raster layer.
 */
(function(root){
  'use strict';
  let readyPromise;
  function hex(value){const s=String(value||'#000000').replace('#','');return [parseInt(s.slice(0,2),16)||0,parseInt(s.slice(2,4),16)||0,parseInt(s.slice(4,6),16)||0];}
  async function load(){
    if(!readyPromise)readyPromise=(async()=>{
      if(!root.brushlib||typeof root.brushlib.create!=='function')throw new Error('MyPaint loader missing');
      const surface=document.createElement('canvas');surface.width=8;surface.height=8;
      const painter=await root.brushlib.create(surface);
      if(!Array.isArray(root.brushlib.brushes)||!root.brushlib.brushes.length)throw new Error('MyPaint presets missing');
      return {painter,presets:root.brushlib.brushes};
    })();
    return readyPromise;
  }
  async function createPainter(canvas){
    const api=await load(),painter=api.painter;
    return {
      presets:api.presets,
      setTarget(ctx){painter.ctx=ctx;},
      stroke(points,options){
        if(!points||!points.length)return;
        const o=options||{},rgb=hex(o.color),ctx=painter.ctx;
        painter.setBrush(o.preset||api.presets[0]);
        painter.setColor(rgb[0],rgb[1],rgb[2]);
        painter.setBrushSize(Math.max(.025,(Number(o.size)||18)/18));
        ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,Number(o.opacity??1)));
        if(o.erase)ctx.globalCompositeOperation='destination-out';
        const first=points[0];painter.newStroke(first.x,first.y);
        let prev=first;
        for(let i=0;i<points.length;i++){
          const p=points[i],dt=Math.max(.001,Math.min(.12,(p.time&&prev.time)?(p.time-prev.time)/1000:.016));
          const pressure=o.pressure===false?1:(p.pressure>0?p.pressure:.55);
          painter.stroke(p.x,p.y,dt,pressure,p.tiltX||0,p.tiltY||0);
          prev=p;
        }
        ctx.restore();
      }
    };
  }
  root.MyPaintEngine={load,createPainter};
})(window);
