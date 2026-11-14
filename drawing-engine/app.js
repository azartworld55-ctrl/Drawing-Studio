(() => {
'use strict';
const $=id=>document.getElementById(id),W=1600,H=1200;
const stage=$('stage'),viewport=$('viewport'),board=$('board'),overlay=$('overlay');
const view=board.getContext('2d',{willReadFrequently:true}),fx=overlay.getContext('2d');
let layers=[],active=0,tool='brush',drawing=false,shapeStart=null,lastPoint=null,zoom=1,pan={x:0,y:0};
let undo=[],redo=[],historyBusy=false,myPainter=null,presets=[],engineReady=false,activePreset=null,strokeCtx=null;
const colorNames=['#24202c','#171923','#ffffff','#e85d75','#f28b42','#f4c95d','#a5c882','#4d9e87','#5b83c5','#7160a8','#bd82b8','#8d5b42','#d9a27c','#efc6ad','#8e98a8','#323d57'];
function layer(name){const c=document.createElement('canvas');c.width=W;c.height=H;return{name,canvas:c,ctx:c.getContext('2d',{willReadFrequently:true}),visible:true,opacity:1,blend:'source-over',locked:false};}
function init(){const bg=layer('Фон');bg.ctx.fillStyle='#fff';bg.ctx.fillRect(0,0,W,H);layers=[bg];renderLayers();fit();renderLayerList();saveHistory();loadEngine();}
async function loadEngine(){
  try{
    if(!window.MyPaintEngine)throw new Error('Адаптер MyPaint не найден');
    const api=await MyPaintEngine.load();presets=api.presets;
    myPainter=await MyPaintEngine.createPainter();engineReady=true;
    populatePresets();$('engineStatus').textContent='MyPaint WASM · '+presets.length+' кистей';$('engineStatus').className='engine-status ready';
    selectPreset(presets.find(p=>/soft/i.test(p.name))||presets.find(p=>/liner/i.test(p.name))||presets[0]);$('engineDetail').textContent='MyPaint загружен. Выбери один из 36 оригинальных пресетов; нажим и наклон пера передаются движку.';
  }catch(err){
    engineReady=false;$('engineStatus').textContent='Резервный движок · MyPaint не загрузился';$('engineStatus').className='engine-status fallback';
    $('engineDetail').textContent='Не удалось загрузить WebAssembly: '+err.message;
    populateFallbackPresets();
  }
}
function populatePresets(){const s=$('brushPreset');s.innerHTML='';presets.forEach((p,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=p.name.replace(/_/g,' ');s.append(o);});s.onchange=()=>selectPreset(presets[+s.value]);}
function populateFallbackPresets(){const s=$('brushPreset');s.innerHTML='';['soft','pencil','marker','airbrush','watercolor','oil'].forEach((n,i)=>{const o=document.createElement('option');o.value=n;o.textContent=n;s.append(o);});}
function selectPreset(p){if(!p)return;activePreset=p;const i=presets.indexOf(p);if(i>=0)$('brushPreset').value=String(i);$('presetName').textContent=p.name.replace(/_/g,' ');}
function activeLayer(){return layers[active];}
function snapshot(){return layers.map(l=>({name:l.name,visible:l.visible,opacity:l.opacity,blend:l.blend,locked:l.locked,data:l.canvas.toDataURL('image/png')}));}
function saveHistory(){if(historyBusy)return;undo.push(snapshot());if(undo.length>24)undo.shift();redo=[];historyButtons();}
function historyButtons(){$('undo').disabled=undo.length<2;$('redo').disabled=!redo.length;}
function loadSnapshot(data){historyBusy=true;layers=data.map(x=>{const l=layer(x.name);l.visible=x.visible!==false;l.opacity=x.opacity??1;l.blend=x.blend||'source-over';l.locked=!!x.locked;const im=new Image();im.onload=()=>{l.ctx.drawImage(im,0,0);renderLayers();};im.src=x.data;return l;});active=Math.max(0,Math.min(active,layers.length-1));renderLayers();renderLayerList();setTimeout(()=>{historyBusy=false;},120);}
function undoAction(){if(undo.length<2)return;redo.push(undo.pop());loadSnapshot(undo[undo.length-1]);historyButtons();}
function redoAction(){if(!redo.length)return;const s=redo.pop();undo.push(s);loadSnapshot(s);historyButtons();}
function renderLayers(){view.clearRect(0,0,W,H);for(const l of layers){if(!l.visible)continue;view.save();view.globalAlpha=l.opacity;view.globalCompositeOperation=l.blend;view.drawImage(l.canvas,0,0);view.restore();}$('dimensions').textContent=W+' × '+H+' px';}
function renderLayerList(){const box=$('layers');box.innerHTML='';layers.forEach((l,i)=>{const row=document.createElement('div');row.className='layer'+(i===active?' selected':'');const eye=document.createElement('button');eye.className='eye';eye.textContent=l.visible?'◉':'○';eye.title='Видимость';eye.onclick=e=>{e.stopPropagation();l.visible=!l.visible;renderLayers();renderLayerList();};const name=document.createElement('button');name.className='layer-name';name.textContent=l.name;name.title='Двойной щелчок — переименовать';name.ondblclick=e=>{e.stopPropagation();const n=prompt('Название слоя',l.name);if(n&&n.trim()){l.name=n.trim();renderLayerList();}};name.onclick=()=>{active=i;syncLayerUI();};const lock=document.createElement('button');lock.className='eye';lock.textContent=l.locked?'🔒':'·';lock.title='Блокировка слоя';lock.onclick=e=>{e.stopPropagation();l.locked=!l.locked;renderLayerList();};row.append(eye,name,lock);row.onclick=()=>{active=i;syncLayerUI();};box.append(row);});const l=activeLayer();$('layerOpacity').value=Math.round((l?.opacity??1)*100);$('layerOpacityValue').textContent=$('layerOpacity').value+'%';$('blend').value=l?.blend||'source-over';}
function syncLayerUI(){renderLayerList();renderLayers();if(myPainter&&activeLayer())myPainter.setTarget(activeLayer().ctx);}
function addLayer(){saveHistory();layers.push(layer('Слой '+(layers.length+1)));active=layers.length-1;syncLayerUI();}
function deleteLayer(){saveHistory();if(layers.length===1){activeLayer().ctx.clearRect(0,0,W,H);}else{layers.splice(active,1);active=Math.max(0,active-1);}syncLayerUI();}
function moveLayer(dir){const n=active+dir;if(n<0||n>=layers.length)return;saveHistory();[layers[active],layers[n]]=[layers[n],layers[active]];active=n;syncLayerUI();}
function fit(){const r=stage.getBoundingClientRect();zoom=Math.max(.06,Math.min((r.width-44)/W,(r.height-44)/H,1));pan={x:0,y:0};applyView();}
function applyView(){viewport.style.width=W*zoom+'px';viewport.style.height=H*zoom+'px';board.style.width=W*zoom+'px';board.style.height=H*zoom+'px';overlay.style.width=W*zoom+'px';overlay.style.height=H*zoom+'px';viewport.style.transform='translate('+pan.x+'px,'+pan.y+'px)';$('zoomValue').textContent=Math.round(zoom*100)+'%';$('zoom').value=Math.round(zoom*100);}
function setZoom(v){const old=zoom;zoom=Math.max(.08,Math.min(5,v/100));const r=stage.getBoundingClientRect();pan.x+=(r.width/2-pan.x)*(1-zoom/old);pan.y+=(r.height/2-pan.y)*(1-zoom/old);applyView();}
function point(e){const r=board.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height,pressure:e.pressure>0?e.pressure:.6,tiltX:e.tiltX||0,tiltY:e.tiltY||0,time:e.timeStamp};}
function opts(erase=false){return{preset:activePreset,color:$('color').value,size:+$('size').value,opacity:+$('opacity').value/100,pressure:$('pressure').checked,erase};}
function fallbackPaint(ctx,pts,o){if(!window.DrawingStudioBrushes)return;DrawingStudioBrushes.paintStroke(ctx,pts,{type:$('fallbackType').value,color:o.color,size:o.size,opacity:o.opacity,pressure:o.pressure,seed:Date.now()});}
function beginPaint(p,erase=false){if(activeLayer().locked){$('engineDetail').textContent='Слой заблокирован. Разблокируй его, чтобы рисовать.';return false;}strokeCtx=activeLayer().ctx;if(engineReady&&myPainter){myPainter.setTarget(strokeCtx);myPainter.begin(p,opts(erase));}else{strokeCtx.save();if(erase)strokeCtx.globalCompositeOperation='destination-out';fallbackPaint(strokeCtx,[p],opts(erase));}return true;}
function continuePaint(p){if(!strokeCtx)return;if(engineReady&&myPainter)myPainter.move([p],opts(tool==='eraser'));else fallbackPaint(strokeCtx,[lastPoint,p],opts(tool==='eraser'));renderLayers();}
function endPaint(){if(!strokeCtx)return;if(engineReady&&myPainter)myPainter.end();else strokeCtx.restore();strokeCtx=null;renderLayers();}
function setTool(t){tool=t;const map={brush:/soft|liner/i,pencil:/pencil|liner/i,airbrush:/airbrush/i,watercolor:/dirty_transparent|clouds/i,marker:/marker/i,oil:/dry_brush|texture/i};if(map[t]&&presets.length){const p=presets.find(x=>map[t].test(x.name));if(p)selectPreset(p);}const fb={brush:'round',pencil:'pencil',airbrush:'airbrush',watercolor:'watercolor',marker:'marker',oil:'oil'};if(fb[t])$('fallbackType').value=fb[t];document.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('active',b.dataset.tool===t));board.style.cursor=t==='hand'?'grab':t==='eyedropper'?'copy':t==='text'?'text':'crosshair';}
function isPaintTool(){return ['brush','eraser','pencil','airbrush','watercolor','marker','oil'].includes(tool);}
function start(e){if(e.button!==0)return;const p=point(e);if(tool==='hand'){drawing=true;shapeStart={screenX:e.clientX,screenY:e.clientY,pan:{...pan}};board.setPointerCapture(e.pointerId);return;}
if(tool==='eyedropper'){const x=Math.max(0,Math.min(W-1,p.x|0)),y=Math.max(0,Math.min(H-1,p.y|0)),d=view.getImageData(x,y,1,1).data;$('color').value='#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('');$('color').dispatchEvent(new Event('input'));return;}
if(tool==='fill'){if(activeLayer().locked)return;saveHistory();floodFill(activeLayer().ctx,p.x|0,p.y|0,$('color').value);renderLayers();return;}
if(tool==='text'){if(activeLayer().locked)return;const t=prompt('Текст на холсте');if(!t)return;saveHistory();const c=activeLayer().ctx;c.save();c.fillStyle=$('color').value;c.globalAlpha=+$('opacity').value/100;c.font='600 '+Math.max(12,+$('size').value*3)+'px system-ui';c.fillText(t,p.x,p.y);c.restore();renderLayers();return;}
if(activeLayer().locked)return;
drawing=true;lastPoint=p;shapeStart=p;board.setPointerCapture(e.pointerId);saveHistory();
if(isPaintTool()){if(!beginPaint(p,tool==='eraser'))drawing=false;}else preview(p);
}
function move(e){if(!drawing)return;if(tool==='hand'){pan.x=shapeStart.pan.x+e.clientX-shapeStart.screenX;pan.y=shapeStart.pan.y+e.clientY-shapeStart.screenY;applyView();return;}
const p=point(e);
if(isPaintTool()){continuePaint(p);lastPoint=p;}else preview(p);
}
function preview(p){fx.clearRect(0,0,W,H);fx.save();fx.strokeStyle=$('color').value;fx.globalAlpha=+$('opacity').value/100;fx.lineWidth=+$('size').value;fx.lineCap='round';fx.setLineDash([7,5]);fx.beginPath();if(tool==='line'){fx.moveTo(shapeStart.x,shapeStart.y);fx.lineTo(p.x,p.y);}else if(tool==='rect')fx.rect(shapeStart.x,shapeStart.y,p.x-shapeStart.x,p.y-shapeStart.y);else fx.ellipse((shapeStart.x+p.x)/2,(shapeStart.y+p.y)/2,Math.abs(p.x-shapeStart.x)/2,Math.abs(p.y-shapeStart.y)/2,0,0,Math.PI*2);fx.stroke();fx.restore();}
function finish(e){if(!drawing)return;if(tool==='hand'){drawing=false;return;}const p=point(e);
if(isPaintTool()){if(lastPoint&&Math.hypot(p.x-lastPoint.x,p.y-lastPoint.y)>.25)continuePaint(p);endPaint();}else{const c=activeLayer().ctx;c.save();c.strokeStyle=$('color').value;c.globalAlpha=+$('opacity').value/100;c.lineWidth=+$('size').value;c.lineCap='round';c.lineJoin='round';c.beginPath();if(tool==='line'){c.moveTo(shapeStart.x,shapeStart.y);c.lineTo(p.x,p.y);c.stroke();}else if(tool==='rect')c.strokeRect(shapeStart.x,shapeStart.y,p.x-shapeStart.x,p.y-shapeStart.y);else{c.ellipse((shapeStart.x+p.x)/2,(shapeStart.y+p.y)/2,Math.abs(p.x-shapeStart.x)/2,Math.abs(p.y-shapeStart.y)/2,0,0,Math.PI*2);c.stroke();}c.restore();}
drawing=false;lastPoint=null;fx.clearRect(0,0,W,H);renderLayers();}
function floodFill(ctx,x,y,hex){x=Math.max(0,Math.min(W-1,x));y=Math.max(0,Math.min(H-1,y));const im=ctx.getImageData(0,0,W,H),d=im.data,at=(y*W+x)*4,target=[d[at],d[at+1],d[at+2],d[at+3]],n=[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16),255];if(target.every((v,i)=>v===n[i]))return;const seen=new Uint8Array(W*H),q=new Int32Array(W*H);let h=0,t=0;const match=i=>{const p=i*4;return Math.abs(d[p]-target[0])+Math.abs(d[p+1]-target[1])+Math.abs(d[p+2]-target[2])<42&&Math.abs(d[p+3]-target[3])<55;};const add=i=>{if(i>=0&&i<W*H&&!seen[i]&&match(i)){seen[i]=1;q[t++]=i;}};add(y*W+x);while(h<t){const i=q[h++],p=i*4;d[p]=n[0];d[p+1]=n[1];d[p+2]=n[2];d[p+3]=255;const xx=i%W;if(xx)add(i-1);if(xx<W-1)add(i+1);if(i>=W)add(i-W);if(i<W*(H-1))add(i+W);}ctx.putImageData(im,0,0);}
function composite(){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');for(const l of layers){if(!l.visible)continue;x.save();x.globalAlpha=l.opacity;x.globalCompositeOperation=l.blend;x.drawImage(l.canvas,0,0);x.restore();}return c;}
function exportPNG(){const c=composite(),a=document.createElement('a');a.download='drawing-studio-3-artwork.png';a.href=c.toDataURL('image/png');a.click();}
function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500);}
function saveProject(){const p={format:'DrawingStudioProject',version:3,width:W,height:H,layers:snapshot(),active,tool,color:$('color').value,brushSize:+$('size').value,opacity:+$('opacity').value,brushPreset:activePreset?.name||null};download(new Blob([JSON.stringify(p)],{type:'application/json'}),'drawing-studio-3-project.dsp');}
function openProject(file){const rd=new FileReader();rd.onload=()=>{try{const p=JSON.parse(rd.result);if(p.format!=='DrawingStudioProject'||![2,3].includes(p.version)||!Array.isArray(p.layers))throw Error('Неподдерживаемый формат');loadSnapshot(p.layers);active=Math.max(0,Math.min(p.active||0,p.layers.length-1));if(p.color)$('color').value=p.color;if(p.brushSize)$('size').value=p.brushSize;if(p.opacity)$('opacity').value=p.opacity;const preset=presets.find(x=>x.name===p.brushPreset);if(preset)selectPreset(preset);undo=[];redo=[];setTimeout(()=>{saveHistory();syncLayerUI();},150);}catch(err){alert('Не удалось открыть проект: '+err.message);}};rd.readAsText(file);}
function importImage(file){const im=new Image(),url=URL.createObjectURL(file);im.onload=()=>{if(!activeLayer().locked){saveHistory();const scale=Math.min(W/im.width,H/im.height),w=im.width*scale,h=im.height*scale;activeLayer().ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);renderLayers();}URL.revokeObjectURL(url);};im.onerror=()=>URL.revokeObjectURL(url);im.src=url;}
function downloadLayer(){const l=activeLayer(),a=document.createElement('a');a.download=(l.name||'layer').replace(/[^a-z0-9а-я_-]+/gi,'-')+'.png';a.href=l.canvas.toDataURL('image/png');a.click();}
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));
board.addEventListener('pointerdown',start);board.addEventListener('pointermove',move);board.addEventListener('pointerup',finish);board.addEventListener('pointercancel',finish);
$('undo').onclick=undoAction;$('redo').onclick=redoAction;$('addLayer').onclick=addLayer;$('deleteLayer').onclick=deleteLayer;$('layerUp').onclick=()=>moveLayer(1);$('layerDown').onclick=()=>moveLayer(-1);$('downloadLayer').onclick=downloadLayer;
$('layerOpacity').oninput=()=>{activeLayer().opacity=+$('layerOpacity').value/100;$('layerOpacityValue').textContent=$('layerOpacity').value+'%';renderLayers();};$('blend').onchange=()=>{activeLayer().blend=$('blend').value;renderLayers();};
$('zoom').oninput=()=>setZoom(+$('zoom').value);$('fit').onclick=fit;$('savePNG').onclick=exportPNG;$('saveProject').onclick=saveProject;
$('openProject').onchange=e=>{if(e.target.files[0])openProject(e.target.files[0]);e.target.value='';};$('importImage').onchange=e=>{if(e.target.files[0])importImage(e.target.files[0]);e.target.value='';};
$('clearLayer').onclick=()=>{if(activeLayer().locked)return;saveHistory();activeLayer().ctx.clearRect(0,0,W,H);renderLayers();};
$('background').onclick=()=>{const l=layers[0];saveHistory();l.ctx.save();l.ctx.globalCompositeOperation='source-over';l.ctx.fillStyle='#fff';l.ctx.fillRect(0,0,W,H);l.ctx.restore();renderLayers();};
$('color').oninput=()=>{$('colorHex').textContent=$('color').value.toUpperCase();};$('size').oninput=()=>{$('sizeVal').textContent=$('size').value+' px';};$('opacity').oninput=()=>{$('opacityVal').textContent=$('opacity').value+'%';};
$('togglePanels').onclick=()=>document.body.classList.toggle('compact');
window.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;const k=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&k==='z'){e.preventDefault();e.shiftKey?redoAction():undoAction();}else if((e.ctrlKey||e.metaKey)&&k==='s'){e.preventDefault();saveProject();}else if((e.ctrlKey||e.metaKey)&&k==='y'){e.preventDefault();redoAction();}else if(k==='b')setTool('brush');else if(k==='e')setTool('eraser');else if(k==='i')setTool('eyedropper');else if(k==='g')setTool('fill');else if(k==='h')setTool('hand');else if(e.key==='['){$('size').value=Math.max(1,+$('size').value-2);$('size').dispatchEvent(new Event('input'));}else if(e.key===']'){$('size').value=Math.min(180,+$('size').value+2);$('size').dispatchEvent(new Event('input'));}});
new ResizeObserver(()=>{if(zoom<=1)fit();}).observe(stage);
const sw=$('swatches');colorNames.forEach(c=>{const b=document.createElement('button');b.style.background=c;b.title=c;b.onclick=()=>{$('color').value=c;$('color').dispatchEvent(new Event('input'));};sw.append(b);});
init();
})();