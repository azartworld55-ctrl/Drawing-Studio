/* Drawing Studio boot guard: surface runtime failures instead of leaving a silent dead UI. */
(() => {
 'use strict';
 const report=(kind,message)=>{
  const line='['+kind+'] '+String(message||'Unknown error').slice(0,260);
  const status=document.getElementById('labStatus');
  if(status)status.textContent='Startup error: '+line;
  console.error('[Drawing Studio]',line);
 };
 window.addEventListener('error',e=>report('JS',e.message||e.error?.message||'script error'));
 window.addEventListener('unhandledrejection',e=>report('Promise',e.reason?.message||e.reason||'promise rejected'));
 window.addEventListener('DOMContentLoaded',()=>{
  const status=document.getElementById('labStatus');
  if(status)status.textContent='Interface loaded · checking engines…';
  const required=['board','stage','undo','redo','savePNG','addLayer','drawAmber','drawFischl'];
  const missing=required.filter(id=>!document.getElementById(id));
  if(missing.length)report('DOM','Missing elements: '+missing.join(', '));
 });
})();
