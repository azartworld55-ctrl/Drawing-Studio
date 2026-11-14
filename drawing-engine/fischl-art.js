/* Fischl — original layered raster fan-art for Drawing Studio 4.0.
 * Native Canvas layers only. No SVG, external image, AI service or paid dependency.
 */
(() => {
'use strict';
const W=1600,H=1200,$=id=>document.getElementById(id);let started=false;
const app=window.DrawingStudioApp;if(!app||window.drawFischlArtwork)return;
const ink='#30263b',violet='#684c83',purple='#49345f',deep='#29263f',gold='#d9b66e',goldHi='#f7df9c',skin='#f1c9ae',skinHi='#ffe2cc',skinShade='#c88f86',hair='#f0d08b',hairShade='#a77c4e',hairLight='#fff0bd',cloth='#e8e0dc',clothShade='#a69bb0',night='#202641';
const path=(c,o,f,s=ink,w=4)=>{c.beginPath();for(const a of o){if(a[0]==='M')c.moveTo(a[1],a[2]);else if(a[0]==='L')c.lineTo(a[1],a[2]);else if(a[0]==='C')c.bezierCurveTo(...a.slice(1));else if(a[0]==='Q')c.quadraticCurveTo(...a.slice(1));else if(a[0]==='Z')c.closePath();}if(f){c.fillStyle=f;c.fill();}if(s){c.strokeStyle=s;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke();}};
const el=(c,x,y,rx,ry,f,s=ink,w=3,r=0)=>{c.beginPath();c.ellipse(x,y,rx,ry,r,0,Math.PI*2);if(f){c.fillStyle=f;c.fill();}if(s){c.strokeStyle=s;c.lineWidth=w;c.stroke();}};
const ln=(c,p,col,w=3)=>{c.beginPath();c.moveTo(...p[0]);p.slice(1).forEach(q=>c.lineTo(...q));c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.stroke();};
const gr=(c,x1,y1,x2,y2,st)=>{const g=c.createLinearGradient(x1,y1,x2,y2);st.forEach(v=>g.addColorStop(v[0],v[1]));return g;};
const glow=(c,x,y,r,col,a=1)=>{c.save();const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(130,105,220,0)');c.globalAlpha=a;c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();};
const layer=n=>app.addLayer(n);
function background(c){
 c.fillStyle=gr(c,0,0,0,H,[[0,'#171d35'],[.45,'#3a3658'],[.76,'#756080'],[1,'#292c48']]);c.fillRect(0,0,W,H);
 glow(c,1180,260,400,'#a9a2ed',.62);el(c,1180,260,115,115,'#d9d4e8',null);
 el(c,1180,260,93,93,'#fff0c8',null);
 // distant Mondstadt rooftops
 for(let i=0;i<12;i++){const x=30+i*140,y=790+(i%3)*38,w=92+(i%4)*13;c.fillStyle=i%2?'#272b48':'#30304e';c.fillRect(x,y,w,260);path(c,[['M',x-12,y],['L',x+w/2,y-60-(i%3)*13],['L',x+w+12,y],['Z']], '#45435f',null);for(let j=0;j<3;j++){c.fillStyle='rgba(245,210,160,.55)';c.fillRect(x+18+j*23,y+48,8,22);}}
 path(c,[['M',0,980],['C',270,870,390,940,620,890],['C',880,830,1060,930,1270,850],['C',1420,800,1510,840,1600,810],['L',1600,1200],['L',0,1200],['Z']], '#252b47',null);
 // constellation arcs
 c.save();c.strokeStyle='rgba(212,205,246,.35)';c.lineWidth=2;
 for(const [x,y,r] of [[280,300,130],[1310,520,170],[1080,140,75]]){c.beginPath();c.arc(x,y,r,.2,2.7);c.stroke();}
 const stars=[[180,180],[420,330],[1280,130],[1440,410],[1080,510],[280,610],[960,180],[1500,670],[700,230],[90,470],[1370,760]];
 stars.forEach(([x,y],i)=>{el(c,x,y,2+i%3,2+i%3,'#fff0c7',null);if(i%3===0){ln(c,[[x-10,y],[x+10,y]],'#e7ddff',2);ln(c,[[x,y-10],[x,y+10]],'#e7ddff',2);}});c.restore();
}
function atmosphere(c){
 glow(c,810,600,520,'#8876c8',.24);glow(c,1020,880,330,'#a78bd4',.2);
 // violet electro ribbons
 const curves=[[[150,820],[300,690],[420,730],[510,610]],[[1050,180],[1200,300],[1360,250],[1510,360]],[[1090,980],[1240,900],[1390,940],[1540,840]],[[220,390],[340,300],[430,340],[520,250]]];
 curves.forEach((p,i)=>{c.beginPath();c.moveTo(...p[0]);c.bezierCurveTo(...p[1],...p[2],...p[3]);c.strokeStyle=i%2?'rgba(213,198,255,.48)':'rgba(168,145,236,.42)';c.lineWidth=4;c.stroke();});
 for(let i=0;i<90;i++){const x=(i*181+47)%W,y=(i*127+80)%H,r=1.5+(i%4)*.7;c.fillStyle=i%3?'rgba(219,207,255,.65)':'rgba(255,231,180,.8)';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();if(i%10===0)glow(c,x,y,26,'#9d8be8',.55);}
}
function pose(c){
 c.save();c.strokeStyle='rgba(80,180,230,.8)';c.lineWidth=9;c.lineCap='round';
 const l=(a,b)=>{c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();};const d=(x,y,r)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();};
 d(790,350,100);l([790,460],[780,640]);l([780,640],[660,840]);l([780,640],[930,850]);l([700,510],[570,620]);l([570,620],[530,770]);l([860,500],[1020,390]);l([1020,390],[1110,280]);d(1020,390,22);d(570,620,22);c.restore();
}
function body(c){
 // flowing rear skirt and cape
 path(c,[['M',620,650],['C',500,770,460,980,500,1130],['C',650,1180,900,1180,1060,1110],['C',1110,930,1050,760,950,650],['Z']],gr(c,500,650,1080,1150,[[0,'#51406b'],[.5,'#302b4b'],[1,'#211f39']]));
 path(c,[['M',600,700],['C',540,850,570,1030,620,1110],['L',970,1110],['C',1030,970,1010,820,940,690],['Z']],gr(c,580,690,1000,1120,[[0,'#77658c'],[.5,'#443956'],[1,'#29263e']]));
 // torso
 path(c,[['M',650,590],['C',710,550,880,555,960,620],['C',1010,700,1000,840,940,920],['C',820,970,670,940,570,880],['C',560,770,570,660,650,590],['Z']],gr(c,570,590,980,920,[[0,'#eee6e3'],[.38,'#c9bdce'],[.7,'#6c567b'],[1,'#3b304f']]));
 // neck
 path(c,[['M',720,500],['C',725,590,690,630,770,670],['C',850,660,880,610,850,500],['Z']],gr(c,710,510,860,650,[[0,'#ffe0c7'],[.6,'#e5b5a2'],[1,'#b9807d']]));
 // face
 path(c,[['M',650,285],['C',690,230,850,235,920,315],['C',975,390,945,530,875,600],['C',830,650,745,650,690,605],['C',620,545,600,380,650,285],['Z']],gr(c,620,260,920,620,[[0,'#ffe4cb'],[.4,'#f4cbb1'],[.8,'#e1a994'],[1,'#b77c7d']]));
 // face light and nose bridge
 path(c,[['M',650,330],['C',700,270,775,275,820,310],['C',750,370,720,445,700,530],['C',650,475,635,390,650,330],['Z']], 'rgba(255,244,226,.36)',null);
 // bodice panels
 path(c,[['M',650,625],['C',700,600,740,625,780,685],['L',720,920],['C',660,910,610,885,570,860],['C',570,750,600,660,650,625],['Z']],gr(c,580,620,760,920,[[0,'#6d527e'],[.6,'#44324f'],[1,'#2a273f']]));
 path(c,[['M',855,680],['C',900,620,940,620,970,665],['C',1010,760,1000,850,940,920],['C',870,930,820,915,790,900],['Z']],gr(c,800,650,990,920,[[0,'#82708f'],[.5,'#51405f'],[1,'#302a46']]));
 // ornate white chest inset
 path(c,[['M',720,650],['L',800,720],['L',870,650],['L',900,720],['L',820,850],['L',750,820],['Z']], '#e9e0e2','#4c3b59',4);
 path(c,[['M',770,715],['L',820,770],['L',850,715]],null,'#b7a2bb',5);
 // high collar
 path(c,[['M',700,610],['L',770,690],['L',825,690],['L',900,610],['L',875,680],['L',815,735],['L',750,700],['Z']], '#f6ece4','#51405d',4);
 // waist corset
 path(c,[['M',650,865],['C',740,900,860,900,950,855],['L',940,930],['C',840,980,720,970,640,930],['Z']], '#2f2945','#d6b76d',4);
 path(c,[['M',720,890],['L',790,955],['L',860,890]],null,'#d8b76d',4);
 // asymmetric overskirt panels
 path(c,[['M',620,920],['C',690,950,760,970,800,970],['L',760,1150],['C',650,1160,560,1140,500,1110],['Z']], '#493550','#d0ad69',4);
 path(c,[['M',810,970],['C',900,960,990,920,1010,890],['L',1090,1090],['C',1000,1150,900,1170,790,1150],['Z']], '#342a49','#c7a45f',4);
 // lace-like hem details
 for(let i=0;i<9;i++){const x=560+i*55;ln(c,[[x,1115+(i%2)*12],[x+22,1135+(i%2)*10],[x+40,1117+(i%2)*12]],'#bfa16d',2);}
 // arms, left hand raised near face
 path(c,[['M',640,650],['C',570,640,540,700,540,760],['L',600,820],['C',650,830,685,790,700,740],['L',720,690],['Z']],gr(c,540,650,710,820,[[0,'#6a507d'],[1,'#332a48']]));
 path(c,[['M',930,660],['C',1010,640,1050,690,1040,760],['L',1000,850],['C',970,890,920,870,915,830],['L',920,750],['Z']],gr(c,920,650,1045,870,[[0,'#f8d8bd'],[.55,'#e9b8a5'],[1,'#bd8580']]));
 // left hand gesture
 path(c,[['M',550,755],['C',520,720,525,685,545,670],['C',562,657,575,680,570,700],['L',600,670],['C',620,655,638,670,625,690],['L',590,740],['C',580,775,555,790,550,755],['Z']], '#f2c7ae');
 // glove cuff
 path(c,[['M',915,810],['C',950,830,980,840,1000,820],['L',1010,870],['C',980,900,940,890,910,865],['Z']], '#e8e0e0','#4c3b59',4);
 // stockings and boot hints
 path(c,[['M',570,1110],['C',640,1140,700,1140,755,1135],['L',740,1200],['L',580,1200],['Z']], '#e9e2e6','#45364e',3);
 path(c,[['M',800,1150],['C',900,1160,1000,1130,1060,1100],['L',1090,1200],['L',810,1200],['Z']], '#ddd6e1','#45364e',3);
}
function hairAndHead(c){
 // long flowing twin masses
 path(c,[['M',630,300],['C',520,340,500,520,535,700],['C',555,835,490,950,450,1010],['C',570,970,650,840,660,700],['C',680,550,700,420,730,350],['Z']],gr(c,480,300,690,980,[[0,'#fff0b8'],[.3,'#e2c27d'],[.72,'#9a744f'],[1,'#554050']]));
 path(c,[['M',865,300],['C',980,330,1050,500,1010,680],['C',990,830,1080,920,1140,980],['C',1010,980,920,850,900,710],['C',870,560,850,430,800,350],['Z']],gr(c,850,300,1080,980,[[0,'#f9e5a6'],[.4,'#d9b875'],[.75,'#92704f'],[1,'#4c3a50']]));
 // crown and bangs
 path(c,[['M',620,370],['C',630,240,735,190,830,210],['C',930,215,980,300,950,410],['C',900,355,855,345,810,390],['C',740,430,680,390,620,440],['Z']],gr(c,620,200,950,420,[[0,'#fff1c0'],[.4,'#e5c27c'],[1,'#98704e']]));
 path(c,[['M',635,340],['C',690,260,760,250,800,280],['C',760,345,740,420,735,490],['C',700,450,670,425,630,445],['Z']],gr(c,630,260,750,480,[[0,'#f9e6aa'],[1,'#9e7653']]));
 path(c,[['M',770,260],['C',850,235,920,280,940,350],['C',895,390,865,450,850,505],['C',825,420,800,350,770,260],['Z']],gr(c,780,250,925,500,[[0,'#fff0b5'],[1,'#a17a53']]));
 // hair shine strokes
 const locks=[[[585,420],[545,570],[585,760],[520,900]],[[625,350],[600,470],[625,570],[610,700]],[[700,275],[680,330],[690,390],[680,440]],[[850,260],[900,330],[910,390],[925,460]],[[940,410],[990,560],[970,700],[1040,850]],[[985,570],[1015,690],[1010,790],[1080,900]]];
 locks.forEach(p=>{c.beginPath();c.moveTo(...p[0]);c.bezierCurveTo(...p[1],...p[2],...p[3]);c.strokeStyle='rgba(255,242,190,.62)';c.lineWidth=7;c.lineCap='round';c.stroke();});
 // eyepatch over right eye with filigree
 path(c,[['M',800,420],['C',850,385,915,400,930,445],['C',910,485,850,500,810,470],['Z']], '#29253d','#d5b46d',5);
 path(c,[['M',825,432],['Q',865,420,900,440],['Q',865,462,830,458]],null,'#9b7baf',3);
 // eyepatch strap across temple
 ln(c,[[810,430],[770,410],[740,395]],'#d2b26e',5);
 // golden circlet, purple feather ornament
 path(c,[['M',650,280],['C',730,230,850,235,935,290]],null,'#d9b66e',10);
 path(c,[['M',900,270],['C',950,205,1015,180,1060,205],['C',1025,255,975,290,920,300],['Z']], '#4e3b69','#d9b66e',4);
 path(c,[['M',925,265],['Q',980,220,1035,215]],null,'#a995c7',4);
 el(c,795,252,20,23,'#e4c477','#755b49',3);
 // violet ribbon
 path(c,[['M',675,270],['C',620,205,600,170,615,130],['C',675,160,720,205,730,250],['Z']], '#6a4b83','#d4b36b',4);
}
function face(c){
 // visible left eye, amber-violet iris
 el(c,710,455,39,49,'#f7e4d4',null);
 el(c,710,458,25,34,'#9d7154','#49364a',3);
 el(c,710,458,15,26,'#b6a0c9',null);
 el(c,710,458,8,23,'#30273b',null);
 el(c,700,444,8,10,'#fff5dc',null);el(c,720,470,4,5,'#fff',null);
 path(c,[['M',670,432],['C',690,400,735,397,752,430]],null,'#493447',7);
 ln(c,[[678,420],[665,407]],'#493447',4);
 // brow above visible eye
 path(c,[['M',680,390],['Q',710,376,740,393]],null,'#9a714f',5);
 // blush and nose, confident smile
 el(c,685,520,23,10,'rgba(224,125,130,.3)',null);
 path(c,[['M',765,520],['Q',780,528,790,517]],null,'#a46d6d',2);
 path(c,[['M',750,548],['Q',780,570,810,540]],null,'#794957',3);
 path(c,[['M',780,565],['Q',795,570,806,558]],null,'#a45f68',2);
 // soft face planes
 path(c,[['M',640,350],['Q',670,320,700,325]],null,'rgba(255,245,225,.6)',5);
}
function oz(c){
 // raven hovering beside her shoulder, friendly stylized familiar
 glow(c,1130,520,210,'#7965b8',.34);
 // tail feathers
 path(c,[['M',1130,575],['C',1210,600,1260,680,1240,760],['C',1190,710,1160,665,1110,645],['Z']], '#322a48','#d0b06a',4);
 path(c,[['M',1160,575],['C',1260,590,1320,650,1310,720],['C',1250,680,1200,640,1140,635],['Z']], '#4b3c69','#d0b06a',4);
 // body
 el(c,1120,520,100,125,gr(c,1030,420,1220,650,[[0,'#5e4b79'],[.5,'#322b49'],[1,'#1f2039']]),'#c7a96b',5,-.22);
 // wings spread
 path(c,[['M',1070,500],['C',990,410,950,370,900,390],['C',925,470,980,550,1060,570],['Z']], '#51416c','#d4b56f',4);
 for(let i=0;i<5;i++){path(c,[['M',1040-i*13,490+i*10],['C',990-i*24,430+i*13,960-i*18,405+i*24,935-i*10,410+i*30],['C',970-i*5,480+i*10,1000-i*4,520+i*10,1050-i*5,540+i*8],['Z']],i%2?'#453858':'#66547d','#bda16d',2);}
 // head
 el(c,1120,405,78,75,'#3a304f','#d4b46c',4);
 path(c,[['M',1055,390],['C',1040,320,1070,270,1100,250],['C',1105,310,1140,330,1160,365],['Z']], '#49375f','#d4b46c',3);
 path(c,[['M',1140,365],['C',1180,310,1210,300,1235,315],['C',1205,370,1180,390,1150,405],['Z']], '#5b4774','#d4b46c',3);
 // eye and beak
 el(c,1140,405,17,22,'#f1d07c',null);el(c,1144,405,7,14,'#26243c',null);
 path(c,[['M',1180,420],['L',1220,435],['L',1175,448],['Z']], '#d7ad61','#49364b',2);
 // breast feathers
 for(let i=0;i<4;i++)path(c,[['M',1080+i*22,510],['Q',1110+i*12,555,1120+i*10,590],['Q',1140+i*12,550,1135+i*8,510]],null,'rgba(222,204,235,.6)',3);
 // golden electro crest
 path(c,[['M',1080,330],['L',1100,285],['L',1115,325],['L',1150,290],['L',1140,345]],null,'#e3c36e',5);
}
function details(c){
 // filigree costume trims
 path(c,[['M',625,660],['Q',650,700,700,720],['L',680,770]],null,'#d9b66e',5);
 path(c,[['M',900,675],['Q',940,710,965,760]],null,'#d9b66e',5);
 for(let i=0;i<7;i++){const x=610+i*48;ln(c,[[x,930+(i%2)*7],[x+18,945+(i%2)*7]],'#d8b66d',2);}
 // brooch
 el(c,800,735,25,30,'#d9b66e','#6b4b56',3);el(c,800,735,12,16,'#5d4778','#f2d995',2);
 path(c,[['M',800,718],['L',810,735],['L',800,752],['L',790,735],['Z']], '#f5e7b4',null);
 // hair strand lines
 const lines=[[[565,470],[540,600],[570,730],[530,850]],[[610,390],[590,500],[610,620],[600,740]],[[690,300],[670,350],[680,395],[670,430]],[[875,290],[910,355],[915,410],[945,485]],[[980,480],[1010,610],[1000,730],[1060,850]]];
 lines.forEach(p=>{c.beginPath();c.moveTo(...p[0]);c.bezierCurveTo(...p[1],...p[2],...p[3]);c.strokeStyle='rgba(255,239,190,.72)';c.lineWidth=2.5;c.stroke();});
 // delicate hand details and finger lines
 ln(c,[[548,700],[557,735],[578,750]],'rgba(170,105,92,.55)',2);
 // gem drops on skirt and golden buttons
 for(let i=0;i<4;i++)el(c,650+i*95,1000+(i%2)*20,5,7,'#e5c47c',null);
 // soft edge highlights
 ln(c,[[585,690],[560,780],[570,840]],'rgba(255,229,180,.55)',3);
 ln(c,[[960,700],[985,770],[970,820]],'rgba(255,229,180,.5)',3);
}
function finishing(c){
 // constellation sparkles and restrained electro arcs
 const arcs=[[[1020,720],[1130,800],[1280,760],[1370,650]],[[300,600],[390,530],[470,550],[520,620]],[[1040,300],[1150,220],[1280,250],[1370,330]]];
 arcs.forEach((p,i)=>{c.beginPath();c.moveTo(...p[0]);c.bezierCurveTo(...p[1],...p[2],...p[3]);c.strokeStyle=i===1?'rgba(238,222,255,.6)':'rgba(166,143,240,.6)';c.lineWidth=3;c.stroke();});
 for(let i=0;i<38;i++){const x=230+(i*97)%1160,y=280+(i*149)%750,r=1.5+(i%3);glow(c,x,y,r*7,'#9c8be8',.28);c.fillStyle=i%2?'#d9ccff':'#ffebbd';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
 const v=c.createRadialGradient(800,570,370,800,570,950);v.addColorStop(0,'rgba(14,15,35,0)');v.addColorStop(1,'rgba(12,14,31,.4)');c.fillStyle=v;c.fillRect(0,0,W,H);
}
function referenceSheet(){const c=document.createElement('canvas');c.width=420;c.height=310;const x=c.getContext('2d');x.fillStyle='#24213c';x.fillRect(0,0,420,310);x.fillStyle='#f1e6c8';x.font='bold 18px system-ui';x.fillText('FISCHL · PRINZESSIN STUDY',15,28);const cols=['#49345f','#78608d','#29263f','#f0d08b','#e8e0dc','#d9b66e','#b6a0c9'];cols.forEach((v,i)=>{x.fillStyle=v;x.fillRect(16+i*56,55,46,80);});x.fillStyle='#eee4d9';x.font='12px system-ui';x.fillText('Violet velvet · antique gold · moonlit silver',16,165);x.fillText('Silhouette: long twin tails / asymmetrical gothic dress',16,190);x.fillText('Companion: Oz · raven familiar',16,215);x.fillText('Light: cool moon fill + warm face key',16,240);return c.toDataURL('image/png');}
async function draw(){
 if(started)return;started=true;const status=$('labStatus');if(status)status.textContent='Рисую Фишль · строю растровые слои…';
 $('color').value='#684c83';$('color').dispatchEvent(new Event('input'));$('paletteMode').value='analogous';$('paletteMode').dispatchEvent(new Event('change'));$('lightDirection').value='tl';$('lightDirection').dispatchEvent(new Event('change'));
 $('gridGuide').checked=true;$('perspectiveGuide').checked=true;['gridGuide','perspectiveGuide'].forEach(id=>$(id).dispatchEvent(new Event('input')));
 const bg=layer('Fischl · moonlit Mondstadt');background(bg.ctx);
 const at=layer('Fischl · electro atmosphere');atmosphere(at.ctx);
 const b=layer('Fischl · dress and body block-in');body(b.ctx);
 const h=layer('Fischl · hair and headpiece');hairAndHead(h.ctx);face(h.ctx);
 const o=layer('Fischl · Oz the raven familiar');oz(o.ctx);
 const d=layer('Fischl · costume filigree and linework');details(d.ctx);
 const f=layer('Fischl · electro finishing and particles');finishing(f.ctx);
 $('posePreset').value='action';$('addPose').click();const pls=app.getLayers();pls[pls.length-1].visible=false;app.render();app.refresh();app.commit();
 const ref=$('referenceImage'),panel=$('referencePanel');ref.src=referenceSheet();ref.onload=()=>{panel.hidden=false;$('refInfo').textContent='Original character study · palette, silhouette and light direction';$('refScale').value=70;$('refOpacity').value=92;$('refScale').dispatchEvent(new Event('input'));};
 let api=null,engineLabel='procedural raster brush fallback';
 try{if(window.MyPaintEngine){const loaded=await MyPaintEngine.load();api={painter:await MyPaintEngine.createPainter(),presets:loaded.presets};engineLabel='MyPaint WASM';}}catch(e){api=null;}
 const accents=layer('Fischl · expressive brush accents');
 const paths=[[[530,500],[550,560],[560,630],[545,700]],[[990,500],[1015,570],[1020,640],[1000,700]],[[650,280],[700,245],[760,240],[800,260]],[[870,280],[920,320],[940,370],[950,420]],[[570,930],[620,960],[670,970],[710,960]],[[940,920],[980,940],[1020,960],[1050,990]],[[1060,360],[1110,330],[1160,340],[1190,370]]];
 if(api){const p=api.painter,brush=api.presets.find(q=>/soft|dry|pencil/i.test(q.name))||api.presets[0];p.setTarget(accents.ctx);for(const pts of paths){const t=Date.now();p.begin({x:pts[0][0],y:pts[0][1],time:t},{preset:brush,color:'#e5d3ff',size:6,opacity:.48,pressure:false});p.move(pts.slice(1).map((v,i)=>({x:v[0],y:v[1],pressure:.7,time:t+(i+1)*16})),{preset:brush,color:'#e5d3ff',size:6,opacity:.48,pressure:false});p.end();}}
 else if(window.DrawingStudioBrushes){for(const pts of paths)DrawingStudioBrushes.paintStroke(accents.ctx,pts.map(p=>({x:p[0],y:p[1],pressure:.7})),{type:'pencil',color:'#e5d3ff',size:6,opacity:.48,seed:91,pressure:true});}
 $('gridGuide').checked=false;$('perspectiveGuide').checked=false;['gridGuide','perspectiveGuide'].forEach(id=>$(id).dispatchEvent(new Event('input')));
 $('grayPreview').checked=true;$('grayPreview').dispatchEvent(new Event('change'));$('grayPreview').checked=false;$('grayPreview').dispatchEvent(new Event('change'));
 app.render();app.commit();$('runReview').click();$('fit').click();if(status)status.textContent='Фишль готова · '+engineLabel+' · 9 raster layers';
}
window.drawFischlArtwork=draw;if(window.location.hash==='#fischl')setTimeout(draw,450);
})();
