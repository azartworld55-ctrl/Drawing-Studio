/* Drawing Studio 3.0 — MyPaint/libmypaint WebAssembly adapter.
 * Upstream: https://github.com/eliot-akira/brushlib-wasm
 * The engine renders real MyPaint brush dabs to each raster layer canvas.
 */
(function(root){
  'use strict';
  let readyPromise;
  async function load(){
    if(readyPromise)return readyPromise;
    readyPromise=(async()=>{
      if(!root.brushlib||typeof root.brushlib.create!=='function')throw new Error('MyPaint loader missing');
      const canvas=document.createElement('canvas');canvas.width=8;canvas.height=8;
      const painter=await root.brushlib.create(canvas);
      if(!Array.isArray(root.brushlib.brushes)||!root.brushlib.brushes.length)throw new Error('MyPaint presets missing');
      return {presets:root.brushlib.brushes,createPainter:async target=>root.brushlib.create(target)};
    })();
    return readyPromise;
  }
  function hex(hex){const s=String(hex||'#000000').replace('#','');return [parseInt(s.slice(0,2),16)||0,parseInt(s.slice(2,4),16)||0,parseInt(s.slice(4,6),16)||0];}
  async function createPainter(canvas){const api=await load();const painter=await api.createPainter(canvas);return {
    presets:api.presets,
    stroke(points,options){
      if(!points||!points.length)return;
      const o=options||{},color=hex(o.color),ctx=canvas.getContext('2d');
      painter.setBrush(o.preset||api.presets[0]);
      painter.setColor(color[0],color[1],color[2]);
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
  };}
  root.MyPaintEngine={load,createPainter};
})(window);
