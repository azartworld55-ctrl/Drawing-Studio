/* Drawing Studio 3.0 — MyPaint/libmypaint WebAssembly adapter.
 * Upstream: https://github.com/eliot-akira/brushlib-wasm
 * One WASM painter is rebound to the active raster layer.
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
  async function createPainter(){
    const api=await load(),painter=api.painter;
    let ctx=null,active=false,lastTime=0;
    return {
      presets:api.presets,
      setTarget(target){if(active)this.end();ctx=target;painter.ctx=target;},
      begin(point,options){
        if(!ctx)throw new Error('No active layer canvas');
        const o=options||{},rgb=hex(o.color);
        painter.setBrush(o.preset||api.presets[0]);
        painter.setColor(rgb[0],rgb[1],rgb[2]);
        painter.setBrushSize(Math.max(.025,(Number(o.size)||18)/18));
        ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,Number(o.opacity??1)));
        if(o.erase)ctx.globalCompositeOperation='destination-out';
        painter.newStroke(point.x,point.y);lastTime=point.time||0;
        active=true;
        this.move([point],o);
      },
      move(points,options){
        if(!active||!points||!points.length)return;
        const o=options||{};let previous=null;
        for(const p of points){
          const dt=Math.max(.001,Math.min(.12,(p.time&&lastTime)?(p.time-lastTime)/1000:.016));
          const pressure=o.pressure===false?1:(p.pressure>0?p.pressure:.55);
          painter.stroke(p.x,p.y,dt,pressure,p.tiltX||0,p.tiltY||0);
          if(p.time)lastTime=p.time;previous=p;
        }
      },
      end(){if(active&&ctx){ctx.restore();active=false;}}
    };
  }
  root.MyPaintEngine={load,createPainter};
})(window);
