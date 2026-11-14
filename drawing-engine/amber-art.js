/* Amber — original raster fan-art scene for Drawing Studio 4.0.
 * Draws into native Canvas raster layers; no SVG, remote image, AI API or paid service.
 * Uses the local MyPaint/libmypaint WASM adapter for expressive brush marks when available,
 * with the studio's own procedural raster brushes as a transparent fallback.
 */
(() => {
'use strict';
const W=1600,H=1200,$=id=>document.getElementById(id);let started=false;
const app=window.DrawingStudioApp;
if(!app||window.drawAmberArtwork)return;
const C={ink:'#392b35',deep:'#5b3036',red:'#a9363c',red2:'#d4544c',redLight:'#f07a62',gold:'#e9b85e',gold2:'#ffdf91',skin:'#f4c7a8',skinLight:'#ffe0c5',skinShadow:'#ce8f7d',hair:'#63352f',hair2:'#8e4938',hairLight:'#c16a45',cream:'#f5e8d4',cloth:'#f5eee4',blue:'#536b86',sky:'#263d59',pyro:'#ff9b54'};
const path=(c,ops,fill,stroke=C.ink,sw=4)=>{c.beginPath();for(const o of ops){if(o[0]==='M')c.moveTo(o[1],o[2]);else if(o[0]==='L')c.lineTo(o[1],o[2]);else if(o[0]==='C')c.bezierCurveTo(...o.slice(1));else if(o[0]==='Q')c.quadraticCurveTo(...o.slice(1));else if(o[0]==='Z')c.closePath();}if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;c.lineCap='round';c.lineJoin='round';c.stroke();}};
const ellipse=(c,x,y,rx,ry,fill,stroke=C.ink,sw=3,rot=0)=>{c.beginPath();c.ellipse(x,y,rx,ry,rot,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;c.stroke();}};
const line=(c,pts,color,width=3)=>{c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();};
const grad=(c,x1,y1,x2,y2,stops)=>{const g=c.createLinearGradient(x1,y1,x2,y2);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g;};
const glow=(c,x,y,r,color,alpha=1)=>{c.save();const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(255,160,80,0)');c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore();};
const roundRect=(c,x,y,w,h,r,fill,stroke=C.ink,sw=3)=>{c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=sw;c.stroke();}};
function layer(name){return app.addLayer(name);}
function strokeEngine(ctx,paths,color,size,opacity,preset,api){
 if(api){const painter=api.painter,brush=api.presets.find(p=>preset.test(p.name))||api.presets[0];painter.setTarget(ctx);for(const pts of paths){if(pts.length<2)continue;const t=Date.now();painter.begin({x:pts[0][0],y:pts[0][1],time:t},{preset:brush,color,size,opacity,pressure:false});painter.move(pts.slice(1).map((p,i)=>({x:p[0],y:p[1],pressure:.72,time:t+(i+1)*16})),{preset:brush,color,size,opacity,pressure:false});painter.end();}}
 else if(window.DrawingStudioBrushes){for(const pts of paths)DrawingStudioBrushes.paintStroke(ctx,pts.map(p=>({x:p[0],y:p[1],pressure:.65})),{type:'pencil',color,size,opacity,seed:73,pressure:true});}
}
function drawBackground(c){
 c.fillStyle=grad(c,0,0,0,H,[[0,'#182a43'],[.42,'#405775'],[.72,'#d07b61'],[1,'#f0bb86']]);c.fillRect(0,0,W,H);
 glow(c,1220,290,360,'#ffcf8c',.62);ellipse(c,1220,290,112,112,'#ffe1a9',null);
 for(let i=0;i<7;i++){const y=180+i*92;c.globalAlpha=.09;c.fillStyle=i%2?'#d9e5ef':'#f8c6a0';c.beginPath();c.ellipse(230+i*210,y,180,18+i*2,-.08,0,Math.PI*2);c.fill();}c.globalAlpha=1;
 path(c,[['M',0,700],['C',220,610,330,670,520,620],['C',740,560,850,650,1040,600],['C',1260,520,1420,600,1600,530],['L',1600,1200],['L',0,1200],['Z']], '#344b62',null);
 path(c,[['M',0,850],['C',250,720,390,780,570,730],['C',760,680,940,770,1120,700],['C',1320,630,1460,700,1600,660],['L',1600,1200],['L',0,1200],['Z']], '#253a50',null);
 // Distant Mondstadt rooftops and towers
 c.save();c.globalAlpha=.72;
 for(let i=0;i<11;i++){const x=65+i*145,y=775+(i%3)*24,w=80+(i%3)*18,h=130+(i%4)*28;c.fillStyle=i%2?'#263a50':'#30475c';c.fillRect(x,y,w,h);path(c,[['M',x-12,y],['L',x+w/2,y-45-(i%3)*12],['L',x+w+12,y],['Z']], '#526176',null);c.fillStyle='#e9c18b';for(let j=0;j<3;j++)c.fillRect(x+17+j*20,y+35,7,17);}
 path(c,[['M',710,790],['L',760,510],['L',790,470],['L',820,510],['L',860,790],['Z']], '#273a50',null);
 path(c,[['M',745,520],['L',790,390],['L',835,520],['Z']], '#526176',null);
 c.restore();
 // Wind-glider silhouettes in the sky
 path(c,[['M',140,410],['C',300,300,420,300,565,410],['C',420,375,300,390,140,410],['Z']], '#8ba2b1',null);
 path(c,[['M',1020,440],['C',1160,335,1300,330,1450,430],['C',1300,395,1160,405,1020,440],['Z']], '#879eaf',null);
 line(c,[[140,410],[350,390],[565,410]],'#c6d4d8',3);line(c,[[1020,440],[1230,410],[1450,430]],'#c6d4d8',3);
 // foreground grass silhouettes
 c.globalAlpha=.65;for(let i=0;i<95;i++){const x=(i*173)%W,y=1060+(i%7)*18;c.strokeStyle=i%2?'#c98a70':'#7f9b87';c.lineWidth=1.5;c.beginPath();c.moveTo(x,1200);c.quadraticCurveTo(x-20,y-70,x+(i%2?24:-24),y-110-(i%5)*8);c.stroke();}c.globalAlpha=1;
}
function drawAtmosphere(c){
 // warm focal glow and painterly wind ribbons
 glow(c,810,500,510,'#ffb16d',.22);glow(c,1120,690,320,'#ff764d',.28);
 c.lineCap='round';c.lineJoin='round';
 const ribbons=[[[80,900],[250,820],[350,860],[500,790]],[[1030,180],[1190,230],[1300,200],[1490,275]],[[1080,980],[1240,920],[1360,960],[1540,880]]];
 ribbons.forEach((p,i)=>{c.beginPath();c.moveTo(...p[0]);c.bezierCurveTo(...p[1],...p[2],...p[3]);c.strokeStyle=i===1?'rgba(255,220,170,.5)':'rgba(255,145,92,.32)';c.lineWidth=i===1?4:3;c.stroke();});
 // ember motes
 for(let i=0;i<78;i++){const x=(i*197+73)%W,y=(i*113+41)%H,r=1.4+(i%5)*.7;c.fillStyle=i%3?'rgba(255,190,120,.7)':'rgba(255,240,198,.85)';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();if(i%9===0)glow(c,x,y,24,'#ff9b54',.55);}
 // small four-point stars
 for(const [x,y,r] of [[210,250,14],[1370,520,11],[1110,160,9],[420,570,8],[1480,760,12]]){c.fillStyle='#ffe6b8';c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x+2,y-2,x+r,y);c.quadraticCurveTo(x+2,y+2,x,y+r);c.quadraticCurveTo(x-2,y+2,x-r,y);c.quadraticCurveTo(x-2,y-2,x,y-r);c.fill();}
}
function drawPoseGuide(c){
 c.save();c.strokeStyle='rgba(75,145,220,.78)';c.fillStyle='rgba(75,145,220,.12)';c.lineWidth=10;c.lineCap='round';
 const l=(a,b)=>{c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();};
 const d=(x,y,r)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.stroke();};
 // construction for a lifted greeting arm and a turned torso
 d(780,360,104);l([790,470],[770,600]);l([770,600],[690,800]);l([770,600],[930,800]);
 l([700,510],[560,600]);l([560,600],[500,760]);l([850,500],[990,420]);l([990,420],[1050,270]);
 d(700,510,35);d(850,500,35);d(560,600,20);d(990,420,20);d(500,760,18);d(1050,270,18);
 c.restore();
}
function drawCharacterBase(c){
 // long rear hair silhouette
 path(c,[['M',590,300],['C',460,280,390,420,420,620],['C',430,790,360,920,450,1050],['C',500,1010,540,900,570,800],['C',610,670,600,530,680,440],['Z']],grad(c,430,320,650,960,[[0,'#5a302f'],[.48,'#854236'],[1,'#452b35']]));
 path(c,[['M',900,300],['C',1040,290,1130,430,1080,620],['C',1050,760,1130,880,1040,1010],['C',990,950,970,830,940,730],['C',900,610,940,500,850,430],['Z']],grad(c,900,330,1090,940,[[0,'#61332e'],[.5,'#9a4a37'],[1,'#4a2b35']]));
 // torso and shoulders, angled slightly
 path(c,[['M',620,620],['C',670,570,880,565,950,630],['C',1040,720,1060,930,1010,1110],['C',890,1170,650,1150,520,1080],['C',500,900,520,720,620,620],['Z']],grad(c,540,620,1040,1120,[[0,'#6e2e3a'],[.32,'#b13b42'],[.72,'#922e3c'],[1,'#542b39']]));
 // neck
 path(c,[['M',720,520],['C',720,600,700,640,760,675],['C',830,680,875,630,850,540],['Z']],grad(c,710,540,860,670,[[0,'#d99b85'],[.55,'#f5c6a6'],[1,'#b87970']]));
 // face
 path(c,[['M',650,300],['C',690,245,850,245,920,330],['C',960,410,930,545,870,610],['C',830,655,760,670,700,625],['C',620,565,600,410,650,300],['Z']],grad(c,620,290,920,620,[[0,'#ffe1c4'],[.35,'#f6c9aa'],[.75,'#e9ad94'],[1,'#c98276']]));
 // face light plane
 path(c,[['M',660,340],['C',700,280,790,280,840,320],['C',770,340,720,410,700,510],['C',660,470,640,400,660,340],['Z']], 'rgba(255,238,216,.38)',null);
 // outfit blouse
 path(c,[['M',630,650],['C',700,610,740,635,790,690],['C',850,630,900,620,955,660],['L',1000,1090],['C',850,1140,680,1135,535,1080],['Z']],grad(c,560,650,970,1100,[[0,'#f7ebd9'],[.5,'#f1e1ce'],[1,'#c7a99b']]));
 // red vest / coat panels
 path(c,[['M',620,650],['C',675,620,710,640,750,700],['L',710,1110],['C',650,1100,590,1080,540,1060],['C',540,860,560,730,620,650],['Z']],grad(c,560,650,740,1100,[[0,'#d14b4b'],[.55,'#a52e3b'],[1,'#692b39']]));
 path(c,[['M',850,690],['C',900,630,930,635,970,670],['C',1030,790,1030,980,1000,1090],['C',920,1110,870,1115,820,1110],['L',800,720],['Z']],grad(c,820,660,1010,1080,[[0,'#d54d48'],[.5,'#9e303b'],[1,'#602c3a']]));
 // collar and tie
 path(c,[['M',700,625],['L',770,700],['L',830,630],['L',855,660],['L',800,755],['L',745,730],['Z']], '#f7eee1');
 path(c,[['M',765,690],['L',810,690],['L',830,820],['L',790,860],['L',748,820],['Z']],grad(c,750,690,830,850,[[0,'#f4e4d2'],[1,'#c2a294']]));
 // dark waist harness
 path(c,[['M',570,990],['C',700,1025,860,1025,1010,980],['L',1010,1040],['C',850,1090,700,1090,560,1040],['Z']], '#4b3039');
 // shoulder cape and trim
 path(c,[['M',630,655],['C',670,600,730,600,770,650],['L',735,730],['C',690,700,650,700,610,740],['Z']], '#f0dfc8');
 path(c,[['M',850,650],['C',890,605,935,620,970,675],['L',995,740],['C',930,700,890,700,835,735],['Z']], '#ead6bd');
 // chest gold emblem and belt clasp
 ellipse(c,800,790,33,37,grad(c,770,760,830,820,[[0,'#fff0b5'],[.5,'#e8b95e'],[1,'#a96c39']]),'#8e5637',4);
 path(c,[['M',780,788],['L',800,765],['L',820,788],['L',800,815],['Z']], '#fff0c2',null);
 // arms: left bent toward bunny, right raised in greeting
 path(c,[['M',610,670],['C',560,670,520,735,505,820],['C',490,870,530,905,575,875],['L',680,780],['L',700,710],['Z']],grad(c,500,690,690,890,[[0,'#d54a48'],[.55,'#a9343d'],[1,'#6d2e3a']]));
 path(c,[['M',930,660],['C',1000,650,1040,700,1055,765],['L',1100,550],['C',1110,500,1150,480,1180,505],['C',1205,535,1180,585,1160,625],['L',1105,830],['C',1080,895,1015,890,990,835],['L',920,740],['Z']],grad(c,930,650,1170,870,[[0,'#e2b69c'],[.25,'#f5c7a9'],[1,'#bd7f76']]));
 // glove cuff on raised arm
 path(c,[['M',1080,670],['C',1110,690,1150,690,1175,660],['L',1195,710],['C',1160,750,1115,755,1070,725],['Z']], '#f1e2d2');
 // raised open hand, fingers
 path(c,[['M',1120,510],['C',1100,470,1090,420,1105,395],['C',1118,380,1135,393,1137,420],['L',1145,455],['L',1155,385],['C',1160,355,1180,360,1180,390],['L',1178,465],['L',1200,410],['C',1213,385,1230,399,1218,430],['L',1198,500],['C',1185,545,1145,560,1120,510],['Z']],grad(c,1100,380,1210,540,[[0,'#ffe0c4'],[.55,'#f4c3a4'],[1,'#cf9180']]));
 // glove on left hand and tiny wrist details
 path(c,[['M',510,820],['C',485,845,500,880,535,886],['L',580,852],['L',560,810],['Z']], '#f0e2d1');
 // shorts/waist hint
 path(c,[['M',590,1040],['C',720,1080,900,1080,1000,1030],['L',1015,1190],['C',870,1200,690,1200,555,1170],['Z']], '#63323b');
 // gold trim
 line(c,[[615,670],[650,690],[690,750]],'#f4c56f',6);line(c,[[950,675],[920,700],[885,750]],'#f4c56f',6);
}
function drawHairAndHeadpiece(c){
 // crown hair cap
 path(c,[['M',625,390],['C',600,270,690,205,795,215],['C',900,205,965,285,950,390],['C',910,355,875,340,835,360],['C',780,390,725,370,690,420],['Z']],grad(c,630,220,950,420,[[0,'#3e2a32'],[.45,'#8c4738'],[1,'#512b32']]));
 // long side locks
 path(c,[['M',650,390],['C',590,470,600,620,645,760],['C',665,835,635,910,590,980],['C',550,890,545,760,555,630],['C',565,490,590,400,650,390],['Z']],grad(c,550,400,665,940,[[0,'#a8563e'],[.5,'#67342f'],[1,'#402b35']]));
 path(c,[['M',895,365],['C',970,420,990,560,965,710],['C',950,820,1000,900,1030,970],['C',1080,875,1070,730,1050,600],['C',1035,470,970,385,895,365],['Z']],grad(c,930,380,1050,930,[[0,'#9a4d39'],[.55,'#5e3031'],[1,'#3d2934']]));
 // front bangs, separate sweeping locks
 path(c,[['M',635,365],['C',670,275,735,250,795,280],['C',745,335,730,395,735,465],['C',700,440,675,410,635,430],['Z']],grad(c,640,270,740,460,[[0,'#a9563d'],[1,'#4c2c34']]));
 path(c,[['M',760,275],['C',825,250,885,285,920,355],['C',885,390,845,420,830,490],['C',805,425,790,365,760,275],['Z']],grad(c,770,260,900,470,[[0,'#b15b3d'],[1,'#4b2b34']]));
 path(c,[['M',840,290],['C',910,315,940,370,925,455],['C',900,430,870,415,845,405],['C',860,365,855,325,840,290],['Z']], '#7a3b32');
 // hair shine ribbons
 const shine=[[[625,455],[595,610],[620,760],[600,860]],[[670,300],[650,380],[670,425],[685,465]],[[880,315],[930,450],[930,570],[950,690]],[[960,500],[980,650],[970,760],[1010,860]],[[750,285],[720,325],[715,360],[710,390]]];
 shine.forEach(p=>{c.beginPath();c.moveTo(...p[0]);c.bezierCurveTo(...p[1],...p[2],...p[3]);c.strokeStyle='rgba(226,133,85,.55)';c.lineWidth=8;c.lineCap='round';c.stroke();});
 // iconic red rabbit-ear headband
 path(c,[['M',680,270],['C',640,160,635,85,660,50],['C',715,115,755,190,770,275],['Z']],grad(c,650,55,760,275,[[0,'#ec6a59'],[.55,'#bb333b'],[1,'#742d3a']]));
 path(c,[['M',825,270],['C',855,170,910,95,955,55],['C',965,140,930,220,895,285],['Z']],grad(c,850,60,950,280,[[0,'#f27660'],[.55,'#c03a40'],[1,'#702b38']]));
 path(c,[['M',672,100],['C',695,155,720,205,735,245],['L',706,232],['Z']], '#f7a08a',null);
 path(c,[['M',920,108],['C',900,160,880,220,865,250],['L',890,235],['Z']], '#f5a18a',null);
 // headband band and center medallion
 path(c,[['M',640,290],['C',700,235,865,230,930,295],['L',920,330],['C',835,280,725,285,650,330],['Z']], '#a7353d');
 ellipse(c,795,278,23,18,grad(c,770,260,820,295,[[0,'#fff0b5'],[1,'#c78a3e']]),'#7e4d39',3);
}
function drawFace(c){
 // eye shadows and eyes
 ellipse(c,710,445,39,51,'#f6e2ce',null,0,-.08);ellipse(c,850,440,39,51,'#f6e2ce',null,0,.08);
 ellipse(c,713,450,25,37,'#b66d36','#54363a',4);ellipse(c,850,445,25,37,'#b66d36','#54363a',4);
 ellipse(c,713,451,15,28,'#e9a849',null);ellipse(c,850,446,15,28,'#e9a849',null);
 ellipse(c,713,450,8,24,'#352b36',null);ellipse(c,850,445,8,24,'#352b36',null);
 ellipse(c,705,435,8,10,'#fff4dc',null);ellipse(c,842,430,8,10,'#fff4dc',null);
 ellipse(c,721,462,4,6,'#fff4dc',null);ellipse(c,858,457,4,6,'#fff4dc',null);
 // upper lash lines
 path(c,[['M',672,425],['C',690,392,735,390,751,424]],null,'#4b3037',7);
 path(c,[['M',812,420],['C',835,390,878,395,890,425]],null,'#4b3037',7);
 line(c,[[678,417],[665,403]],'#4b3037',5);line(c,[[885,418],[898,405]],'#4b3037',5);
 // brows
 path(c,[['M',680,390],['Q',710,375,740,390]],null,'#744139',5);path(c,[['M',825,386],['Q',855,370,880,392]],null,'#744139',5);
 // blush
 ellipse(c,670,510,25,11,'rgba(239,119,121,.28)',null);ellipse(c,890,505,25,11,'rgba(239,119,121,.28)',null);
 // nose and smile
 path(c,[['M',780,500],['Q',795,510,808,500]],null,'rgba(151,88,79,.55)',2);
 path(c,[['M',770,535],['Q',795,555,820,532]],null,'#75434a',3);
 path(c,[['M',795,552],['Q',810,565,824,550]],null,'#75434a',2);
 // face rim light
 line(c,[[640,455],[646,510],[668,565]],'rgba(255,240,218,.6)',4);
}
function drawBaronBunny(c){
 // little plush mascot at lower-left, distinct from character silhouette
 // body
 ellipse(c,385,890,95,118,grad(c,300,780,475,1010,[[0,'#f8e6d2'],[.55,'#d9c1ac'],[1,'#a98f83']]),'#49343b',7);
 // ears
 path(c,[['M',320,815],['C',280,740,275,670,300,650],['C',345,700,365,750,360,820],['Z']], '#e8d3bd');
 path(c,[['M',405,810],['C',420,720,465,680,485,695],['C',495,755,455,800,430,835],['Z']], '#e8d3bd');
 path(c,[['M',305,680],['C',330,730,340,760,344,790]],null,'#d57c6c',10);
 path(c,[['M',465,715],['C',450,755,435,780,425,800]],null,'#d57c6c',10);
 // face and scarf
 ellipse(c,355,875,13,19,'#49343b',null);ellipse(c,415,875,13,19,'#49343b',null);
 ellipse(c,385,910,10,7,'#d17c72',null);
 path(c,[['M',320,950],['C',355,980,420,980,450,945],['L',470,1000],['C',420,1040,340,1030,300,990],['Z']], '#a83b40');
 ellipse(c,385,985,14,14,'#efbd64','#79503c',3);
 // small stitch lines and star patch
 for(let i=0;i<5;i++)line(c,[[310+i*9,805+i*4],[317+i*9,800+i*4]],'rgba(255,255,255,.55)',2);
 path(c,[['M',380,820],['L',390,845],['L',415,850],['L',395,866],['L',400,890],['L',380,876],['L',360,890],['L',365,866],['L',345,850],['L',370,845],['Z']], '#e6b75e',null);
}
function drawDetails(c){
 // outfit lapels, seams, belt, buckles
 path(c,[['M',690,650],['L',755,700],['L',730,755],['L',675,710],['Z']], '#f8ead8','#8d5a4d',3);
 path(c,[['M',880,650],['L',825,700],['L',850,755],['L',900,705],['Z']], '#f8ead8','#8d5a4d',3);
 line(c,[[610,760],[585,920],[610,1020]],'rgba(255,205,143,.75)',4);
 line(c,[[970,760],[990,920],[970,1010]],'rgba(255,205,143,.65)',4);
 // gold belt clasp and stitching
 roundRect(c,760,1030,82,48,10,'#e8b65f','#6b433b',4);roundRect(c,777,1041,48,25,6,'#fff0bd','#94603e',2);
 for(let i=0;i<8;i++){line(c,[[580+i*14,1080],[585+i*14,1088]],'#f4b96d',2);}
 // hair strands: controlled, following locks
 const strands=[[[610,420],[585,520],[610,650],[590,770]],[[625,450],[610,560],[635,680],[620,790]],[[650,320],[680,350],[690,385],[690,420]],[[700,285],[720,320],[720,365],[710,410]],[[820,280],[845,325],[860,355],[870,400]],[[905,390],[945,500],[940,620],[960,720]],[[990,540],[1010,650],[995,770],[1025,860]]];
 strands.forEach(p=>{c.beginPath();c.moveTo(...p[0]);c.bezierCurveTo(...p[1],...p[2],...p[3]);c.strokeStyle='rgba(239,157,103,.68)';c.lineWidth=2.4;c.stroke();});
 // gloves and raised hand fingers
 line(c,[[1124,500],[1132,535],[1150,545]],'rgba(164,94,82,.55)',3);
 line(c,[[1165,410],[1165,475]],'rgba(164,94,82,.5)',3);
 line(c,[[1195,435],[1180,485]],'rgba(164,94,82,.5)',3);
 // jewelry, vision-like amber charm and scarf pin
 ellipse(c,970,720,18,23,'#dba94f','#7a503c',3);ellipse(c,970,720,8,12,'#fff0b2',null);
 // costume trim and buttons
 for(let i=0;i<4;i++)ellipse(c,650+i*3,820+i*57,4,4,'#f5c56d',null);
 // clean outer silhouette accents
 line(c,[[620,645],[575,710],[550,825]],'rgba(255,191,133,.7)',3);
 line(c,[[950,640],[1010,720],[1025,815]],'rgba(255,191,133,.6)',3);
}
function drawFinalEffects(c){
 // glowing pyro ribbon, not obscuring the face
 const loops=[[[240,600],[330,460],[470,490],[540,630]],[[1020,760],[1150,850],[1310,780],[1390,620]],[[500,1040],[650,1130],[900,1120],[1080,1040]]];
 loops.forEach((p,i)=>{c.beginPath();c.moveTo(...p[0]);c.bezierCurveTo(...p[1],...p[2],...p[3]);c.strokeStyle=i===1?'rgba(255,137,78,.75)':'rgba(255,195,122,.5)';c.lineWidth=i===1?7:4;c.stroke();});
 for(let i=0;i<32;i++){const x=250+(i*83)%1120,y=350+(i*137)%720,r=2+(i%4);glow(c,x,y,r*7,'#ff9b54',.32);c.fillStyle=i%2?'#ffb46c':'#ffe2a8';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
 // edge vignette
 const v=c.createRadialGradient(800,560,360,800,560,950);v.addColorStop(0,'rgba(14,23,40,0)');v.addColorStop(1,'rgba(12,19,33,.45)');c.fillStyle=v;c.fillRect(0,0,W,H);
}
function makeReferenceSheet(){
 const c=document.createElement('canvas');c.width=420;c.height=310;const x=c.getContext('2d');
 x.fillStyle='#202d42';x.fillRect(0,0,420,310);
 x.fillStyle='#f1d8bd';x.font='bold 18px system-ui';x.fillText('AMBER · OUTRIDER STUDY',16,28);
 x.fillStyle='#d64a4a';x.fillRect(18,48,95,150);x.fillStyle='#f0d6bf';x.fillRect(135,48,95,150);x.fillStyle='#6b3933';x.fillRect(252,48,95,150);
 x.fillStyle='#f3bd62';x.font='12px system-ui';x.fillText('COSTUME',18,218);x.fillText('FACE + LIGHT',135,218);x.fillText('HAIR MASS',252,218);
 const colors=['#a9363c','#d4544c','#f5eee4','#63352f','#e9b85e','#f4c7a8','#263d59'];colors.forEach((col,i)=>{x.fillStyle=col;x.fillRect(18+i*54,245,43,35);});
 x.fillStyle='#d7d8df';x.font='10px system-ui';x.fillText('Warm sunset · soft key light · amber accents',18,298);
 return c.toDataURL('image/png');
}
async function draw(){
 if(started)return;started=true;
 const status=$('labStatus');if(status)status.textContent='Рисую Эмбер · строю слои…';
 // Configure the built-in palette and lighting labs to match the art direction.
 $('color').value='#d4544c';$('color').dispatchEvent(new Event('input'));
 $('paletteMode').value='analogous';$('paletteMode').dispatchEvent(new Event('change'));
 $('lightDirection').value='tl';$('lightDirection').dispatchEvent(new Event('change'));
 // Use the Perspective Assistant while establishing the background, then turn guides off.
 $('gridGuide').checked=true;$('perspectiveGuide').checked=true;['gridGuide','perspectiveGuide'].forEach(id=>$(id).dispatchEvent(new Event('input')));
 // Native raster layers, ordered from environment to foreground.
 const bg=layer('Amber · Mondstadt background');drawBackground(bg.ctx);
 const atm=layer('Amber · atmosphere and warm light');drawAtmosphere(atm.ctx);
 const base=layer('Amber · character block-in');drawCharacterBase(base.ctx);
 const hair=layer('Amber · hair, headpiece and face');drawHairAndHeadpiece(hair.ctx);drawFace(hair.ctx);
 const doll=layer('Amber · Baron Bunny');drawBaronBunny(doll.ctx);
 const detail=layer('Amber · costume details and linework');drawDetails(detail.ctx);
 const fx=layer('Amber · pyro glow and finishing');drawFinalEffects(fx.ctx);
 // A hidden construction layer documents the pose study without contaminating the finished painting.
 $('posePreset').value='action';$('addPose').click();const poseLayers=app.getLayers();poseLayers[poseLayers.length-1].visible=false;app.render();app.refresh();app.commit();
 // Add a compact original design/reference sheet to the separate Reference Workspace.
 const ref=$('referenceImage'),panel=$('referencePanel');
 ref.src=makeReferenceSheet();ref.onload=()=>{panel.hidden=false;$('refInfo').textContent='Original design study · palette, costume masses and light direction';$('refScale').value=70;$('refOpacity').value=92;$('refScale').dispatchEvent(new Event('input'));};
 // Use MyPaint WASM for a handful of tapered painterly accent strokes; fallback is explicit.
 let api=null,engineLabel='fallback raster brushes';
 try{if(window.MyPaintEngine){const loaded=await MyPaintEngine.load();api={painter:await MyPaintEngine.createPainter(),presets:loaded.presets};engineLabel='MyPaint WASM';}}catch(e){api=null;}
 const accents=layer('Amber · expressive brush accents');
 strokeEngine(accents.ctx,[
 [[575,515],[580,555],[595,595],[620,625]],
 [[1010,535],[1030,580],[1035,630],[1020,680]],
 [[655,300],[690,280],[725,270],[760,275]],
 [[840,290],[875,305],[900,330],[916,360]],
 [[560,900],[600,930],[635,940],[660,930]],
 [[920,920],[955,940],[980,965],[995,990]],
 [[320,610],[370,570],[420,565],[470,600]],
 [[1090,850],[1150,885],[1210,880],[1260,840]]
 ],'#f8bd83',7,.52,/soft|dry|pencil/i,api);
 
 // Restore clean presentation: turn off construction overlays, retain the hidden pose layer.
 $('gridGuide').checked=false;$('perspectiveGuide').checked=false;['gridGuide','perspectiveGuide'].forEach(id=>$(id).dispatchEvent(new Event('input')));
 $('grayPreview').checked=true;$('grayPreview').dispatchEvent(new Event('change'));$('grayPreview').checked=false;$('grayPreview').dispatchEvent(new Event('change'));
 app.render();app.commit();
 // Review is deliberately run as a technical report; manual criteria remain for a human to verify.
 $('runReview').click();
 if(status)status.textContent='Эмбер готова · '+engineLabel+' · 9 raster layers';
 const zoom=$('fit');if(zoom)zoom.click();
}
window.drawAmberArtwork=draw;
if(window.location.hash==='#amber')setTimeout(draw,450);
})();
