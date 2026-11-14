(() => {
'use strict';
const $=id=>document.getElementById(id);
const app=window.DrawingStudioApp;
if(!app)return;
const W=1600,H=1200,stage=$('stage'),viewport=$('viewport');
const guides=document.createElement('canvas');guides.width=W;guides.height=H;guides.id='guides';guides.className='canvas guides';viewport.append(guides);
const gx=guides.getContext('2d');
let refs=[],activeRef=0,showPerspective=false,showGrid=false,gray=false,poseIndex=0;
const poses={
 neutral:{name:'Нейтральная стойка',head:[800,230],neck:[800,330],shoulders:[[680,360],[920,360]],hips:[[720,650],[880,650]],elbows:[[610,540],[990,520]],hands:[[560,700],[1040,680]],knees:[[740,900],[860,900]],feet:[[690,1120],[920,1120]]},
 action:{name:'Динамический шаг',head:[810,220],neck:[800,315],shoulders:[[680,350],[900,390]],hips:[[735,640],[885,665]],elbows:[[590,480],[1010,560]],hands:[[520,600],[1080,700]],knees:[[700,870],[940,850]],feet:[[560,1080],[1100,1040]]},
 sitting:{name:'Сидячая поза',head:[800,220],neck:[800,320],shoulders:[[680,350],[920,350]],hips:[[700,620],[900,620]],elbows:[[600,500],[1000,500]],hands:[[680,680],[920,680]],knees:[[590,760],[1010,760]],feet:[[520,900],[1080,900]]},
 profile:{name:'Профиль в движении',head:[820,230],neck:[810,330],shoulders:[[730,350],[900,380]],hips:[[760,650],[900,660]],elbows:[[680,520],[1000,530]],hands:[[640,680],[1080,650]],knees:[[700,900],[970,850]],feet:[[620,1100],[1120,1050]]}
};
function clearGuides(){gx.clearRect(0,0,W,H);}
function drawGuides(){
 clearGuides();if(!showGrid&&!showPerspective)return;
 gx.save();gx.lineWidth=2;gx.setLineDash([12,10]);
 if(showGrid){gx.strokeStyle='rgba(85,145,255,.28)';for(let x=0;x<=W;x+=100){gx.beginPath();gx.moveTo(x,0);gx.lineTo(x,H);gx.stroke()}for(let y=0;y<=H;y+=100){gx.beginPath();gx.moveTo(0,y);gx.lineTo(W,y);gx.stroke()}}
 if(showPerspective){
  const hy=+$('horizon').value, vx1=+$('vp1').value, vx2=+$('vp2').value;
  gx.strokeStyle='rgba(255,190,80,.85)';gx.setLineDash([18,12]);gx.beginPath();gx.moveTo(0,hy);gx.lineTo(W,hy);gx.stroke();
  [[vx1,hy],[vx2,hy]].forEach(([x,y])=>{gx.strokeStyle='rgba(255,120,120,.72)';gx.beginPath();gx.arc(x,y,13,0,Math.PI*2);gx.stroke();gx.beginPath();gx.moveTo(x,y);gx.lineTo(0,0);gx.moveTo(x,y);gx.lineTo(W,0);gx.moveTo(x,y);gx.lineTo(0,H);gx.moveTo(x,y);gx.lineTo(W,H);gx.stroke()});
 }
 gx.restore();
}
function setGuideFlags(){showGrid=$('gridGuide').checked;showPerspective=$('perspectiveGuide').checked;['horizon','vp1','vp2'].forEach(id=>$(id).disabled=!showPerspective);drawGuides();}
['gridGuide','perspectiveGuide','horizon','vp1','vp2'].forEach(id=>$(id).addEventListener('input',setGuideFlags));
function hslToHex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h/30)%12;const c=l-a*Math.max(-1,Math.min(k-3,Math.min(9-k,1)));return Math.round(255*c).toString(16).padStart(2,'0')};return '#'+f(0)+f(8)+f(4)}
function hexToHsl(hex){const n=parseInt(hex.slice(1),16),r=((n>>16)&255)/255,g=((n>>8)&255)/255,b=(n&255)/255,max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0,s=0,l=(max+min)/2;if(d){s=d/(1-Math.abs(2*l-1));switch(max){case r:h=60*(((g-b)/d)%6);break;case g:h=60*((b-r)/d+2);break;default:h=60*((r-g)/d+4)}}return[h,Math.round(s*100),Math.round(l*100)]}
function buildPalette(mode){
 const [h,s,l]=hexToHsl($('color').value);let hs=[];
 if(mode==='complementary')hs=[h,h+180];else if(mode==='analogous')hs=[h-30,h-15,h,h+15,h+30];else if(mode==='triadic')hs=[h,h+120,h+240];else hs=[h,h+180,h+30,h+210,h+60];
 const colors=hs.map((v,i)=>hslToHex(v,Math.min(90,s+(i%2?5:0)),Math.max(20,Math.min(82,l+(i%3-1)*10))));
 const box=$('paletteSwatches');box.innerHTML='';colors.forEach(c=>{const b=document.createElement('button');b.className='palette-chip';b.style.background=c;b.title=c;b.onclick=()=>{ $('color').value=c;$('color').dispatchEvent(new Event('input')); };box.append(b)});
 $('paletteCaption').textContent=mode+' · '+colors.join('  ');
}
function drawLighting(){
 const c=$('lightPreview'),x=c.getContext('2d'),w=c.width,h=c.height;x.clearRect(0,0,w,h);
 const dir=$('lightDirection').value,points={tl:[w*.3,h*.28],tr:[w*.7,h*.28],left:[w*.25,h*.5],right:[w*.75,h*.5],top:[w*.5,h*.2]},p=points[dir]||points.tl;
 const g=x.createRadialGradient(p[0],p[1],5,w*.5,h*.55,w*.48);g.addColorStop(0,'#fff5cf');g.addColorStop(.25,'#d8b6a1');g.addColorStop(.72,'#76678d');g.addColorStop(1,'#24253a');
 x.fillStyle=g;x.beginPath();x.arc(w*.5,h*.55,h*.38,0,Math.PI*2);x.fill();
 x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=2;x.stroke();
 x.fillStyle='rgba(255,255,255,.8)';x.font='12px system-ui';x.fillText('Схема света · учебная сфера',12,18);
}
$('paletteMode').onchange=()=>buildPalette($('paletteMode').value);
$('color').addEventListener('input',()=>buildPalette($('paletteMode').value));
$('lightDirection').onchange=drawLighting;
$('grayPreview').onchange=()=>{gray=$('grayPreview').checked;$('board').style.filter=gray?'grayscale(1)':'none';$('grayState').textContent=gray?'Тональная проверка включена':'Обычный цвет';};
function addPoseGuide(){
 const p=poses[$('posePreset').value];if(!p)return;
 const l=app.addLayer('Pose guide · '+p.name),c=l.ctx;
 c.save();c.strokeStyle='rgba(45,110,190,.8)';c.fillStyle='rgba(45,110,190,.10)';c.lineWidth=9;c.lineCap='round';c.lineJoin='round';
 const line=(a,b)=>{c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke()};
 const dot=(a,r=18)=>{c.beginPath();c.arc(a[0],a[1],r,0,Math.PI*2);c.fill();c.stroke()};
 const ellipse=(a,b)=>{c.beginPath();c.ellipse((a[0]+b[0])/2,(a[1]+b[1])/2,Math.abs(a[0]-b[0])*.62,Math.abs(a[1]-b[1])*.68,0,0,Math.PI*2);c.fill();c.stroke()};
 dot(p.head,48);line(p.head,p.neck);ellipse(p.shoulders[0],p.shoulders[1]);ellipse(p.hips[0],p.hips[1]);
 line(p.shoulders[0],p.shoulders[1]);line(p.hips[0],p.hips[1]);
 line(p.neck,p.shoulders[0]);line(p.neck,p.shoulders[1]);
 line(p.shoulders[0],p.elbows[0]);line(p.elbows[0],p.hands[0]);line(p.shoulders[1],p.elbows[1]);line(p.elbows[1],p.hands[1]);
 line(p.hips[0],p.knees[0]);line(p.knees[0],p.feet[0]);line(p.hips[1],p.knees[1]);line(p.knees[1],p.feet[1]);
 [p.neck,...p.shoulders,...p.elbows,...p.hands,...p.hips,...p.knees,...p.feet].forEach(a=>dot(a,9));
 c.restore();app.render();app.commit();$('poseStatus').textContent='Манекен добавлен отдельным слоем. Используй его как направляющую и рисуй поверх.';
}
$('addPose').onclick=addPoseGuide;
function setRefTransform(){const im=$('referenceImage');if(!im.naturalWidth)return;const scale=+$('refScale').value/100;im.style.width=Math.min(420,im.naturalWidth*scale)+'px';im.style.opacity=+$('refOpacity').value/100;$('refScaleValue').textContent=$('refScale').value+'%';$('refOpacityValue').textContent=$('refOpacity').value+'%';}
$('referenceFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);const im=$('referenceImage');if(im.dataset.url)URL.revokeObjectURL(im.dataset.url);im.dataset.url=url;im.onload=()=>{setRefTransform();$('referencePanel').hidden=false;$('refInfo').textContent=f.name+' · '+im.naturalWidth+'×'+im.naturalHeight;};im.src=url;e.target.value='';};
$('refScale').oninput=setRefTransform;$('refOpacity').oninput=setRefTransform;
$('toggleReference').onclick=()=>$('referencePanel').hidden=!$('referencePanel').hidden;
$('closeReference').onclick=()=>$('referencePanel').hidden=true;
let drag=null;
$('referenceHeader').addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;drag={x:e.clientX,y:e.clientY,left:$('referencePanel').offsetLeft,top:$('referencePanel').offsetTop};$('referenceHeader').setPointerCapture(e.pointerId)});
$('referenceHeader').addEventListener('pointermove',e=>{if(!drag)return;const panel=$('referencePanel');panel.style.left=Math.max(0,Math.min(stage.clientWidth-panel.offsetWidth,drag.left+e.clientX-drag.x))+'px';panel.style.top=Math.max(0,Math.min(stage.clientHeight-panel.offsetHeight,drag.top+e.clientY-drag.y))+'px';panel.style.right='auto'});
$('referenceHeader').addEventListener('pointerup',()=>drag=null);
const criteria=['Силуэт читается в уменьшенном размере','Поза имеет ясную линию действия','Голова и конечности построены в перспективе','Лицо и взгляд выражают нужную эмоцию','Волосы собраны в крупные формы','Складки одежды имеют конструктивную причину','Свет имеет единое направление','Работа читается в оттенках серого','Палитра ограничена и согласована','Фон поддерживает главный объект','Края имеют осмысленную резкость','Нет случайных линий и незаконченных зон'];
const checks=$('reviewChecks');criteria.forEach((s,i)=>{const label=document.createElement('label');label.className='review-check';const input=document.createElement('input');input.type='checkbox';input.dataset.criterion=String(i);const span=document.createElement('span');span.textContent=s;label.append(input,span);checks.append(label)});
function review(){
 const canvas=app.composite(),ctx=canvas.getContext('2d',{willReadFrequently:true}),data=ctx.getImageData(0,0,W,H).data;
 let non=0,min=255,max=0,step=32;const hist=new Uint32Array(8);let r=0,g=0,b=0,n=0;
 for(let y=0;y<H;y+=step)for(let x=0;x<W;x+=step){const i=(y*W+x)*4,a=data[i+3];if(a>12){non++;const lum=.2126*data[i]+.7152*data[i+1]+.0722*data[i+2];min=Math.min(min,lum);max=Math.max(max,lum);hist[Math.min(7,lum>>5)]++;r+=data[i];g+=data[i+1];b+=data[i+2];n++;}}
 const coverage=non/((W/step)*(H/step))*100,tones=hist.filter(v=>v>0).length,checksDone=[...checks.querySelectorAll('input')].filter(x=>x.checked).length;
 $('reviewStats').innerHTML='<div class="stat"><b>'+coverage.toFixed(1)+'%</b><span>покрытие холста</span></div><div class="stat"><b>'+tones+'/8</b><span>тональные диапазоны</span></div><div class="stat"><b>'+checksDone+'/12</b><span>самопроверка</span></div>';
 let advice=[];if(coverage<3)advice.push('На холсте пока мало содержимого — это нормально для эскиза.');else if(coverage>96)advice.push('Почти весь холст заполнен: проверь, не потерялось ли свободное пространство.');if(tones<4)advice.push('Тональный диапазон узкий: попробуй усилить разделение света, полутонов и теней.');if(n&&max-min<75)advice.push('Контраст невысокий — проверь фокусную точку и читаемость силуэта.');if(checksDone<8)advice.push('Пройди ручной список качества: компьютер не способен надёжно оценить анатомию и композицию.');if(!advice.length)advice.push('Автоматические показатели выглядят разнообразно. Теперь проверь форму, позу и выразительность глазами.');
 $('reviewAdvice').textContent=advice.join(' ');$('reviewNote').textContent='Автоматика измеряет только покрытие и распределение тонов. Это не оценка художественного качества и не замена человеческому просмотру.';
}
$('runReview').onclick=review;
$('resetReview').onclick=()=>{checks.querySelectorAll('input').forEach(x=>x.checked=false);$('reviewStats').textContent='Нажми «Проверить холст», чтобы получить техническую сводку.';$('reviewAdvice').textContent='';};
$('clearGuides').onclick=()=>{showGrid=false;showPerspective=false;$('gridGuide').checked=false;$('perspectiveGuide').checked=false;drawGuides()};
$('togglePanels').addEventListener('click',()=>setTimeout(()=>{guides.style.width=viewport.style.width;guides.style.height=viewport.style.height},0));
window.addEventListener('resize',drawGuides);
$('versionLabel').textContent='4.0 · ARTIST LAB';
$('labStatus').textContent='Artist Lab готов · локально, бесплатно';
buildPalette('complementary');drawLighting();drawGuides();
})();