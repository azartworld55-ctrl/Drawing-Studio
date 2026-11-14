/* Amber — stroke-painted digital illustration.
 * Every visible mark is a brush gesture on native raster layers.
 * No SVG, paths-as-shapes, ellipses, filled polygons, gradients, or imported art.
 */
(() => {
'use strict';
const W=1600,H=1200,$=id=>document.getElementById(id),app=window.DrawingStudioApp;
if(!app||window.drawAmberArtwork)return;
let started=false;
const C={ink:'#34262b',dark:'#43252b',brown:'#6d392f',chestnut:'#98503b',copper:'#bd6848',gold:'#e6b85f',lightGold:'#ffe1a0',skin:'#f2c4a5',skinLight:'#ffdfc3',skinShade:'#c98779',cream:'#f4e8d7',red:'#a9343c',redLight:'#d4544d',blue:'#516c83',sky:'#334b66',shadow:'#25364e',white:'#fff1df'};
let seed=71;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const pts=a=>a.map(([x,y,p])=>({x,y,pressure:p??(.48+rnd()*.48)}));
const curve=(a,b,c,d,n=12)=>{const out=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;out.push([u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]);}return out;};
function jitterLine(a,amount=2){return a.map(([x,y])=>[x+(rnd()-.5)*amount,y+(rnd()-.5)*amount]);}
async function newPaint(name,opts={}){const l=app.addLayer(name);return {layer:l,brush:await DrawingStudioPaintWorkflow.create(l.ctx,opts)};}
function stroke(b,a,color,size,opacity=.8,type='oil',extra={}){if(a.length<2)return;b.stroke(pts(a),{color,size,opacity,fallback:type,smoothing:extra.smoothing??4,seed:extra.seed??Math.floor(rnd()*100000)});}
function multi(b,a,color,size,opacity=.5,count=4,spread=5,type='oil'){for(let i=0;i<count;i++){const off=(rnd()-.5)*spread;stroke(b,a.map(([x,y])=>[x+off,y+(rnd()-.5)*spread]),color,size*(.65+rnd()*.7),opacity*(.55+rnd()*.45),type);}}
function hatch(b,paths,color,size,opacity=.4,count=3,spread=10){for(const p of paths)multi(b,p,color,size,opacity,count,spread,'pencil');}
async function background(){
 const {brush:b}=await newPaint('Эмбер · подмалёвок и небо',{size:70,opacity:.14});
 // Layered horizontal sky washes; each band is made from overlapping broad brush gestures.
 for(let y=40;y<760;y+=34){const t=y/760;const col=t<.45?['#243950','#304a64','#405c73'][Math.floor(t*6)%3]:['#6d6370','#b47770','#e3a17c'][Math.floor(t*4)%3];for(let k=0;k<5;k++){const yy=y+(rnd()-.5)*25;stroke(b,[[0,yy],[260,yy-8],[560,yy+5],[880,yy-7],[1200,yy+6],[1600,yy-5]],col,65+rnd()*65,.12+rnd()*.08,'watercolor');}}
 const {brush:cloud}=await newPaint('Эмбер · облака и свет',{size:45,opacity:.2});
 for(let i=0;i<70;i++){const y=100+rnd()*610,x=rnd()*1500;stroke(cloud,[[x,y],[x+45,y-8],[x+95,y+3],[x+145,y-3]],i%3?'#f4c3a1':'#9baab1',12+rnd()*22,.08+rnd()*.12,'watercolor');}
 const {brush:town}=await newPaint('Эмбер · дальний Мондштадт',{size:14,opacity:.55});
 // Town is sketched as many individual architectural brush strokes, not filled buildings.
 for(let i=0;i<22;i++){const x=20+i*75+(rnd()-.5)*24,base=850+rnd()*100,top=base-80-rnd()*130;stroke(town,[[x,base],[x+2,top+25],[x+17,top],[x+34,top+28],[x+37,base]],'#263b50',7,.8,'pencil');for(let j=0;j<3;j++)stroke(town,[[x+8+j*9,base-22],[x+8+j*9,base-43]],'#e8bd91',2,.5,'pencil');}
 const {brush:ground}=await newPaint('Эмбер · дальний ландшафт',{size:42,opacity:.25});
 for(let i=0;i<60;i++){const x=rnd()*1600,y=850+rnd()*300;stroke(ground,[[x,y],[x+90,y-12],[x+180,y+8]],i%2?'#354b5c':'#60717b',12+rnd()*30,.18,'watercolor');}
}
async function figureSketch(){
 const {brush:b}=await newPaint('Эмбер · свободный набросок',{size:4,opacity:.6});
 const sketch=[
 [[620,330],[670,275],[745,245],[825,260],[900,315],[930,390],[920,485],[875,555],[790,590],[700,560],[640,500],[615,420],[620,330]],
 [[620,375],[580,480],[560,650],[520,790],[475,940]],
 [[900,370],[970,470],[1010,620],[1040,780],[1110,920]],
 [[660,570],[610,650],[585,790],[615,900]],
 [[865,570],[920,650],[955,790],[925,900]],
 [[635,610],[760,660],[900,620]],
 [[630,880],[760,930],[930,900],[1040,850]],
 [[690,300],[770,320],[860,300]],
 [[705,415],[760,430],[820,420],[875,435]]
 ];
 sketch.forEach(p=>stroke(b,jitterLine(p,4),'#e7b48e',2,.38,'pencil'));
 // gesture / arm raised in greeting
 stroke(b,[[960,620],[1010,550],[1065,480],[1110,425],[1150,390]],'#e7b48e',3,.48,'pencil');
 stroke(b,[[910,650],[955,610],[1005,550],[1060,500]],'#e7b48e',2,.4,'pencil');
}
async function paintHair(){
 const {brush:b}=await newPaint('Эмбер · тёмная масса волос',{size:34,opacity:.8});
 // broad directional locks build a silhouette only through overlapping strokes.
 const locks=[
 [[620,330],[560,420],[535,560],[555,700],[520,835],[450,930]],
 [[660,280],[600,360],[585,500],[600,660],[565,790],[520,880]],
 [[710,255],[655,330],[650,470],[660,600],[625,750],[590,840]],
 [[860,275],[930,350],[970,480],[960,620],[1005,760],[1080,870]],
 [[900,330],[960,410],[1000,550],[995,670],[1040,790],[1120,880]],
 [[925,390],[1000,480],[1030,610],[1040,720],[1090,800],[1160,845]],
 [[640,400],[620,530],[650,650],[630,770],[580,880]],
 [[880,420],[920,540],[930,680],[970,800],[1030,900]]
 ];
 locks.forEach((p,i)=>multi(b,p,i%2?C.brown:C.dark,30,.8,5,18,'oil'));
 const {brush:lights}=await newPaint('Эмбер · пряди и отражённый свет',{size:8,opacity:.62});
 const shine=[
 [[605,380],[585,500],[600,620],[570,750],[525,850]],
 [[650,310],[625,430],[640,550],[620,660]],
 [[690,280],[675,380],[690,470],[670,560]],
 [[900,350],[950,460],[955,570],[990,690],[1040,790]],
 [[945,440],[990,550],[1000,660],[1050,760]],
 [[860,300],[900,380],[910,470],[940,530]]
 ];
 shine.forEach((p,i)=>multi(lights,p,i%2?C.copper:'#d28a5d',3+i%3,0.52,3,8,'pencil'));
 hatch(lights,shine.slice(0,4),C.gold,1.6,.35,2,5);
}
async function paintBody(){
 const {brush:b}=await newPaint('Эмбер · силуэт и тёплый подмалёвок',{size:45,opacity:.45});
 // torso, shoulders and skirt are established by broad, overlapping directional strokes.
 const masses=[
 [[650,600],[720,570],[810,575],[900,620],[965,730],[960,850]],
 [[610,650],[575,760],[590,870],[660,940],[760,970]],
 [[930,650],[990,730],[1000,850],[950,930],[850,970]],
 [[600,900],[690,940],[780,955],[900,940],[1020,890]],
 [[600,930],[560,1010],[530,1110],[670,1150],[810,1140]],
 [[810,960],[930,930],[1030,960],[1100,1080],[1050,1150],[850,1160]]
 ];
 masses.forEach((p,i)=>multi(b,p,i%2?C.red:C.dark,36,.7,5,26,'oil'));
 const {brush:cloth}=await newPaint('Эмбер · красный костюм и ткань',{size:22,opacity:.72});
 const clothPaths=[
 [[650,635],[700,680],[740,750],[725,850],[680,920]],
 [[900,625],[860,700],[850,790],[900,880],[960,910]],
 [[620,900],[720,950],[820,970],[940,930],[1020,900]],
 [[590,970],[680,1020],[760,1040],[780,1140]],
 [[850,970],[930,1000],[1020,980],[1080,1090]],
 [[670,670],[630,760],[650,850],[700,900]],
 [[940,680],[975,770],[960,850],[930,900]]
 ];
 clothPaths.forEach((p,i)=>multi(cloth,p,i%3?C.red:C.redLight,16,.52,4,13,'oil'));
 // Dark folds and creases
 const {brush:folds}=await newPaint('Эмбер · складки и тени одежды',{size:6,opacity:.65});
 const foldPaths=[
 [[680,700],[710,760],[700,830],[670,885]],[[730,720],[755,790],[740,850],[720,900]],
 [[900,690],[880,770],[900,835],[930,880]],[[950,740],[930,800],[950,860]],
 [[640,950],[710,990],[750,1060]],[[900,970],[970,1010],[1010,1070]],
 [[750,950],[790,1010],[780,1090]],[[850,950],[830,1020],[860,1110]]
 ];
 foldPaths.forEach(p=>stroke(folds,p,C.dark,5,.65,'pencil'));
}
async function paintSkin(){
 const {brush:b}=await newPaint('Эмбер · кожа и свет лица',{size:18,opacity:.45});
 const faceMass=[
 [[665,330],[635,385],[640,465],[680,535],[750,575],[820,570],[885,525],[915,455],[905,370],[855,315]],
 [[690,355],[670,425],[690,490],[740,535],[800,550],[860,515],[890,450]],
 [[680,440],[700,480],[730,500]],[[850,450],[870,480],[885,465]]
 ];
 faceMass.forEach((p,i)=>multi(b,p,i?C.skin:C.skinLight,17,.34,4,8,'watercolor'));
 const {brush:features}=await newPaint('Эмбер · черты лица',{size:3,opacity:.8});
 // eye sockets and expressive eyes
 stroke(features,[[690,430],[715,412],[745,415],[766,435]],C.brown,5,.8,'pencil');
 stroke(features,[[815,435],[840,412],[870,418],[890,440]],C.brown,5,.8,'pencil');
 stroke(features,[[696,438],[718,428],[742,431],[760,447],[740,462],[715,461],[696,438]],'#56343a',3,.95,'pencil');
 stroke(features,[[818,445],[840,428],[866,434],[884,451],[865,467],[840,464],[818,445]],'#56343a',3,.95,'pencil');
 // irises and pupils with layered strokes
 for(const [x,y] of [[730,448],[850,450]]){multi(features,[[x-8,y-11],[x-4,y-2],[x,y+12],[x+5,y+1],[x+7,y-10]],'#d47a42',3,.8,3,2,'pencil');stroke(features,[[x,y-9],[x,y+9]],'#382c32',4,.95,'pencil');stroke(features,[[x-5,y-7],[x-2,y-5]],'#fff0cf',3,.95,'pencil');}
 // lashes and brows
 [[680,425,720,408],[815,420,860,407]].forEach(([x,y,x2,y2])=>stroke(features,[[x,y],[x+12,y-8],[x2,y2]],C.dark,5,.9,'pencil'));
 // nose, smile, blush
 stroke(features,[[785,465],[778,480],[787,484]],C.skinShade,2,.6,'pencil');
 stroke(features,[[758,505],[780,517],[806,510],[820,496]],'#8f4c4b',3,.9,'pencil');
 stroke(features,[[778,518],[800,520],[810,514]],'#fff0df',2,.8,'pencil');
 multi(features,[[675,480],[690,488],[705,485]],'#e98d83',7,.22,4,5,'watercolor');
 multi(features,[[865,485],[880,490],[895,484]],'#e98d83',7,.22,4,5,'watercolor');
}
async function paintOutfit(){
 const {brush:b}=await newPaint('Эмбер · кожа перчаток, ремни и бронза',{size:8,opacity:.8});
 // costume edging, straps and metal accents are strokes with varied widths.
 const goldPaths=[
 [[630,640],[670,625],[710,655],[730,700]],[[900,630],[940,650],[960,700]],
 [[610,920],[700,950],[790,960],[900,940],[1000,900]],
 [[640,985],[710,1010],[780,1015]],[[880,1005],[960,980],[1030,950]],
 [[720,620],[760,675],[820,690],[870,650]],
 [[660,690],[690,760],[675,830]],[[925,700],[950,770],[935,840]]
 ];
 goldPaths.forEach(p=>multi(b,p,C.gold,4,.8,3,3,'pencil'));
 const {brush:detail}=await newPaint('Эмбер · орнаменты и швы',{size:3,opacity:.72});
 const seams=[
 [[650,690],[680,730],[690,780]],[[700,900],[760,925],[820,930]],
 [[880,900],[930,890],[970,860]],[[620,970],[680,1000],[735,1015]],
 [[880,1015],[950,995],[1000,970]]
 ];
 seams.forEach(p=>stroke(detail,p,C.lightGold,2,.75,'pencil'));
 // belt and pouch details
 for(let i=0;i<9;i++){const x=620+i*42,y=960+(i%2)*10;stroke(detail,[[x,y],[x+15,y+3],[x+24,y+10]],i%2?C.gold:C.dark,3,.8,'pencil');}
}
async function paintAccessories(){
 const {brush:b}=await newPaint('Эмбер · бант и заячьи ушки',{size:13,opacity:.8});
 // long red bow and rabbit-ear silhouette formed entirely from tapered brush strokes.
 const bow=[
 [[700,260],[665,210],[620,145],[610,75],[650,110],[700,175],[745,225]],
 [[815,250],[875,205],[940,135],[1000,115],[980,180],[920,235],[850,270]],
 [[770,255],[755,205],[770,160],[800,190],[820,250]]
 ];
 bow.forEach((p,i)=>multi(b,p,i===1?C.redLight:C.red,12,.8,5,12,'oil'));
 const {brush:trims}=await newPaint('Эмбер · бант и аксессуары — блики',{size:3,opacity:.8});
 bow.forEach(p=>stroke(trims,p,C.gold,2,.75,'pencil'));
 // small rabbit plush suggested by soft brown and cream brush masses near waist.
 const {brush:rabbit}=await newPaint('Эмбер · Барон Зайчик',{size:12,opacity:.6});
 const bunny=[
 [[1010,825],[1050,800],[1100,810],[1130,850],[1120,900],[1080,925],[1035,900],[1010,825]],
 [[1050,820],[1030,770],[1040,720],[1060,790]],
 [[1090,820],[1110,765],[1140,735],[1130,810]]
 ];
 bunny.forEach(p=>multi(rabbit,p,'#d9c6b5',10,.5,4,8,'watercolor'));
 const {brush:eyes}=await newPaint('Эмбер · мелкие акценты Барона Зайчика',{size:2,opacity:.8});
 stroke(eyes,[[1050,860],[1060,870]],C.dark,3,.8,'pencil');stroke(eyes,[[1090,860],[1100,870]],C.dark,3,.8,'pencil');
}
async function finishing(){
 const {brush:b}=await newPaint('Эмбер · световые акценты и свободные мазки',{size:7,opacity:.55});
 const highlights=[
 [[630,365],[610,420],[615,500],[595,580]],[[660,320],[645,375],[655,420]],
 [[910,380],[950,450],[960,520],[985,590]],[[945,520],[990,610],[995,680]],
 [[700,650],[740,700],[760,755]],[[900,680],[925,735],[930,790]],
 [[650,940],[710,970],[760,975]],[[930,950],[980,930],[1020,900]]
 ];
 highlights.forEach((p,i)=>stroke(b,p,i%2?C.gold:C.skinLight,3,.45,'pencil'));
 const {brush:embers}=await newPaint('Эмбер · пиро-свет и атмосфера',{size:10,opacity:.35});
 for(let i=0;i<65;i++){const x=350+rnd()*950,y=230+rnd()*780;stroke(embers,[[x,y],[x+8+rnd()*12,y-10-rnd()*20]],i%3?'#ffb06b':'#ffe0a2',2+rnd()*3,.24,'airbrush');}
}
async function draw(){
 if(started)return;started=true;const status=$('labStatus');if(status)status.textContent='Эмбер · свободный набросок и живописные мазки…';
 try{
  $('color').value=C.red;$('color').dispatchEvent(new Event('input'));
  $('paletteMode').value='analogous';$('paletteMode').dispatchEvent(new Event('change'));
  $('lightDirection').value='tl';$('lightDirection').dispatchEvent(new Event('change'));
  $('gridGuide').checked=true;$('perspectiveGuide').checked=true;['gridGuide','perspectiveGuide'].forEach(id=>$(id).dispatchEvent(new Event('input')));
  // Build a complete illustration as sequential brush-only raster passes.
  await background();await figureSketch();await paintHair();await paintBody();await paintSkin();await paintOutfit();await paintAccessories();await finishing();
  $('gridGuide').checked=false;$('perspectiveGuide').checked=false;['gridGuide','perspectiveGuide'].forEach(id=>$(id).dispatchEvent(new Event('input')));
  $('grayPreview').checked=true;$('grayPreview').dispatchEvent(new Event('change'));$('grayPreview').checked=false;$('grayPreview').dispatchEvent(new Event('change'));
  app.render();app.commit();$('runReview').click();$('fit').click();
  if(status)status.textContent='Эмбер · живопись мазками · MyPaint / raster brush fallback · 10 слоёв';
 }catch(e){if(status)status.textContent='Ошибка рисования: '+e.message;console.error(e);}
}
window.drawAmberArtwork=draw;
// GitHub Pages may finish loading the brush WASM after this module.
// Start after the page load event; the manual button remains available.
const launchAmber=()=>{
 if(window.location.hash==='#amber'&&!started){
  const status=$('labStatus');
  if(status)status.textContent='Загружаю кисти и начинаю рисовать Эмбер…';
  setTimeout(()=>{if(!started)draw();},350);
 }
};
if(document.readyState==='complete')setTimeout(launchAmber,350);
else window.addEventListener('load',launchAmber,{once:true});
})();
