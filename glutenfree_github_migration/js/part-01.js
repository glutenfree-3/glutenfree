
const visuals = [
  {src:'images/visual-01.png', name:'MORNING MODE', code:'01'},
  {src:'images/visual-02.png', name:'TACTICAL SIDE', code:'02'},
  {src:'images/visual-03.png', name:'DOUBLE STACK', code:'03'},
  {src:'images/visual-04.png', name:'HOOD ERROR', code:'04'},
  {src:'images/visual-05.png', name:'ARCADE MODE', code:'05'}
];
const tracks = [
  {src:'music/track-01.m4a', title:'403 Forbidden', desc:'morning...のイラストに対応する初期BGM。'},
  {src:'music/track-02.m4a', title:'404 Not Found', desc:'横顔のタクティカル翠に対応するBGM。'},
  {src:'music/track-03.m4a', title:'Double Stack Attack!', desc:'ハンバーガーの翠に対応するBGM。'},
  {src:'music/track-04.m4a', title:"418 I'm teapot", desc:'フード姿の翠に対応するBGM。'},
  {src:'music/track-05.m4a', title:'WELCOME.exe', desc:'ゲームセンターの翠に対応するBGM。'}
];
const pod=document.getElementById('pod'), minPod=document.getElementById('minPod');
minPod.addEventListener('click',()=>{const small=pod.classList.toggle('minimized');minPod.textContent=small?'+':'−';minPod.setAttribute('aria-expanded',String(!small));minPod.setAttribute('aria-label',small?'プレイヤーを展開':'プレイヤーを最小化');try{retroClick()}catch(e){}});
const stage = document.getElementById('stage');
visuals.forEach(v=>{
  const d=document.createElement('div');
  d.className='slide';
  d.innerHTML=`<img class="main" src="${v.src}" alt="${v.name}"><img class="blur" src="${v.src}" alt="">`;
  stage.appendChild(d);
});
const slides=[...document.querySelectorAll('.slide')];
const vname=document.getElementById('vname');
const vcode=document.getElementById('vcode');
let visualIndex=Math.floor(Math.random()*visuals.length);
function showVisual(i){
  visualIndex=(i+visuals.length)%visuals.length;
  slides.forEach((s,idx)=>s.classList.toggle('active', idx===visualIndex));
  vname.textContent=visuals[visualIndex].name;
  vcode.textContent=visuals[visualIndex].code;
}
showVisual(visualIndex);
setInterval(()=>showVisual(visualIndex+1),3000);

const bgm=document.getElementById('bgm');
const trackTitle=document.getElementById('trackTitle');
const trackDesc=document.getElementById('trackDesc');
const bar=document.getElementById('bar');
const cur=document.getElementById('cur');
const dur=document.getElementById('dur');
const playState=document.getElementById('playState');
const musicBtn=document.getElementById('musicBtn');
const trackList=document.getElementById('trackList');
let currentTrack=visualIndex;
let activated=false;
let autoplayTries=0;
let playRequest=0;
let sfxOn=true;
tracks.forEach((t,idx)=>{
  const row=document.createElement('div');
  row.className='minirow';
  row.innerHTML=`<span>${String(idx+1).padStart(2,'0')}</span><span>${t.title}</span><span>${idx===currentTrack?'PLAY':'LIST'}</span>`;
  row.addEventListener('click',()=>{ loadTrack(idx); playTrack(); retroClick(); });
  trackList.appendChild(row);
});
const rows=[...document.querySelectorAll('.minirow')];
function fmt(t){ if(!isFinite(t)) return '00:00'; const m=Math.floor(t/60), s=Math.floor(t%60); return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }
function updateRows(){ rows.forEach((r,idx)=>{ r.classList.toggle('active', idx===currentTrack); r.lastElementChild.textContent = idx===currentTrack ? 'PLAY' : 'LIST'; }); }
function loadTrack(idx){
  playRequest++;
  currentTrack=(idx+tracks.length)%tracks.length;
  const t=tracks[currentTrack];
  bgm.pause(); bgm.src=t.src; bgm.load(); cur.textContent='00:00'; dur.textContent='00:00'; document.getElementById('seek').value=0;
  bgm.volume=Number(document.getElementById('volume').value)/100;
  trackTitle.textContent=t.title;document.getElementById('miniTrack').textContent='♪ '+t.title;
  trackDesc.textContent=t.desc;
  updateRows();
}
function chooseRandomNext(){
  let n=currentTrack;
  if(tracks.length>1){ while(n===currentTrack) n=Math.floor(Math.random()*tracks.length); }
  loadTrack(n);
  playTrack();
}
async function playTrack(){
  const request=++playRequest;
  try{
    await bgm.play();
    if(request!==playRequest)return;
    activated=true;
    playState.textContent='PLAY';
    musicBtn.textContent='Ⅱ';
  }catch(e){
    if(request!==playRequest)return;
    playState.textContent=e.name==='NotAllowedError'?'WAIT':'ERROR';
    musicBtn.textContent='▶';
  }
}
loadTrack(currentTrack);playTrack();
function unlock(e){if(!document.getElementById('extraGate').hidden||!document.getElementById('extraWorld').hidden||!document.getElementById('extraBoot').hidden)return;if(!activated && !e.target.closest('#musicBtn,#nextBtn,#prevTrack,#shuffleBtn'))playTrack();}
document.addEventListener('click',unlock);document.addEventListener('keydown',unlock);
bgm.addEventListener('loadedmetadata', ()=>{ dur.textContent=fmt(bgm.duration); });
bgm.addEventListener('timeupdate', ()=>{
  cur.textContent=fmt(bgm.currentTime);
  dur.textContent=fmt(bgm.duration);
  document.getElementById('seek').value=Number.isFinite(bgm.duration)?bgm.currentTime/bgm.duration*1000:0;
});
bgm.addEventListener('ended', chooseRandomNext);

let actx;
function AC(){ actx ||= new (window.AudioContext||window.webkitAudioContext)(); return actx; }
function retroHover(){ if(!sfxOn) return; const c=AC(); c.resume(); const now=c.currentTime; [680,900].forEach((f,n)=>{ const o=c.createOscillator(), g=c.createGain(); o.type='square'; o.frequency.setValueAtTime(f,now+n*0.028); g.gain.setValueAtTime(.0001,now+n*0.028); g.gain.exponentialRampToValueAtTime(.08,now+n*0.028+0.01); g.gain.exponentialRampToValueAtTime(.0001,now+n*0.028+0.10); o.connect(g).connect(c.destination); o.start(now+n*0.028); o.stop(now+n*0.028+0.11); }); }
function retroClick(){ if(!sfxOn) return; const c=AC(); c.resume(); const now=c.currentTime; [520,740,980].forEach((f,n)=>{ const o=c.createOscillator(), g=c.createGain(); o.type='square'; o.frequency.setValueAtTime(f,now+n*0.04); g.gain.setValueAtTime(.0001,now+n*0.04); g.gain.exponentialRampToValueAtTime(.12,now+n*0.04+0.01); g.gain.exponentialRampToValueAtTime(.0001,now+n*0.04+0.14); o.connect(g).connect(c.destination); o.start(now+n*0.04); o.stop(now+n*0.04+0.15); }); }

const menuBtns=[...document.querySelectorAll('.menu button')];

menuBtns.forEach(b=>{const label=b.children[1];label.classList.add('pixel-label');label.replaceChildren(...Array.from(b.dataset.name,c=>{const x=document.createElement('span');x.textContent=c;return x;}));});
let menuIndex=0;
let hoverIndex=-1;
function setMenu(i, hover=false){
  const previousMenu=menuIndex;
  menuIndex=(i+menuBtns.length)%menuBtns.length;
  if(document.body.classList.contains("is-home") && menuIndex===0) menuIndex=i<0||i===0&&hover&&previousMenu===1?menuBtns.length-1:1;
  menuBtns.forEach((b,idx)=>b.classList.toggle('active', idx===menuIndex));
  const label=menuBtns[menuIndex].querySelector('.pixel-label');
  if(!confirming && hover && hoverIndex!==menuIndex && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    label.querySelectorAll('span').forEach((el,j)=>{el.getAnimations().forEach(a=>a.cancel());el.animate([{transform:'translateY(0)',color:'#c8ff46'},{transform:'translateY(-5px)',color:'#fff'},{transform:'translateY(0)',color:'#c8ff46'}],{duration:210,delay:j*24,easing:'steps(3,end)'});});
  }
  if(hover && hoverIndex!==menuIndex){ hoverIndex=menuIndex; retroHover(); }
}
let confirming=false;
async function confirmMenu(idx){
  if(confirming)return;
  confirming=true;setMenu(idx);try{retroClick()}catch(e){}
  const btn=menuBtns[idx],label=btn.querySelector('.pixel-label');
  btn.classList.add('confirming');
  try{
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      const letters=[...label.children];
      const animations=letters.map((el,j)=>{
        el.getAnimations().forEach(a=>a.cancel());
        const r=el.getBoundingClientRect();
        for(let k=0;k<5;k++){
          const dot=document.createElement('i');dot.className='pixel-spark';dot.style.left=(r.left+r.width/2)+'px';dot.style.top=(r.top+r.height/2)+'px';document.body.append(dot);
          const a=dot.animate([{transform:'translate(0,0)',opacity:0},{transform:'translate(0,0)',opacity:1,offset:.15},{transform:`translate(${(k-2)*10}px,${(k%2?1:-1)*(12+j%3*4)}px)`,opacity:0}],{duration:240,delay:j*12,easing:'steps(5,end)',fill:'backwards'});a.finished.catch(()=>{}).finally(()=>dot.remove());
        }
        return el.animate([{transform:'scale(1)',opacity:1},{transform:'translateY(3px) scale(.5,1.4)',opacity:1,offset:.22},{transform:'translateY(-7px) scale(.2)',opacity:0,offset:.48},{transform:'translateY(0) scale(1.2)',opacity:1,offset:.78},{transform:'scale(1)',opacity:1}],{duration:340,delay:j*12,easing:'steps(5,end)'}).finished.catch(()=>{});
      });
      await Promise.all(animations);
    }
    await sceneTransition(idx);
  }finally{btn.classList.remove('confirming');confirming=false;}
}
let transitioning=false;
const wipe=document.getElementById('wipe');
for(let i=0;i<96;i++)wipe.append(document.createElement('i'));
async function sceneTransition(idx){
 if(transitioning)return;transitioning=true;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){navigate(idx);transitioning=false;return;}
 wipe.classList.add('running');
 try{const cells=[...wipe.children];await Promise.all(cells.map((c,i)=>c.animate([{opacity:0},{opacity:1}],{duration:100,delay:((i%12)+Math.floor(i/12))*12,easing:'steps(2,end)',fill:'forwards'}).finished));navigate(idx);window.scrollTo(0,0);await Promise.all(cells.map((c,i)=>c.animate([{opacity:1},{opacity:0}],{duration:100,delay:(19-(i%12)-Math.floor(i/12))*10,easing:'steps(2,end)',fill:'forwards'}).finished));}finally{wipe.children.length&&[...wipe.children].forEach(c=>c.getAnimations().forEach(a=>a.cancel()));wipe.classList.remove('running');transitioning=false;}
}
function navigate(idx,writeHash=true){
 const panel=document.getElementById('pagePanel');panel.hidden=idx===0; panel.classList.toggle("charpage",idx===1);document.getElementById("character").hidden=idx!==1;document.getElementById("placeholder").hidden=idx===1;
 document.body.classList.toggle("is-home",idx===0);
 document.getElementById('pageTitle').textContent=menuBtns[idx].dataset.name;
 document.title='glutenfree_ / '+menuBtns[idx].dataset.name;
 if(writeHash){const h='#'+menuBtns[idx].dataset.name.toLowerCase();if(location.hash!==h)location.hash=h;}
 setMenu(idx===0?1:idx);
}

window.gfGalleryImage=i=>visuals[i].src;
function showCRT(){const el=document.getElementById('crtGallery');el.hidden=false;el.style.display='flex';const f=document.getElementById('crtFrame');if(!f.hasAttribute('srcdoc'))f.srcdoc=GALLERY_DOC;}
function hideCRT(){const el=document.getElementById('crtGallery');el.hidden=true;el.style.display='none';}
function openCRT(){location.hash='gallery';}
const GALLERY_DOC="<!doctype html>\n<html lang=\"ja\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>glutenfree_ / GALLERY CRT<\/title>\n<style>\n:root{\n  --bg:#060809;\n  --bg2:#0b0f11;\n  --panel:#11171a;\n  --panel2:#161d20;\n  --line:#293136;\n  --text:#e9efe8;\n  --muted:#91a093;\n  --accent:#c9ff46;\n  --accent2:#ebffb1;\n  --shadow:0 18px 48px rgba(0,0,0,.45);\n}\n*{box-sizing:border-box}\nhtml,body{height:100%}\nbody{\n  margin:0;\n  background:radial-gradient(circle at top right, rgba(201,255,70,.06), transparent 18%), linear-gradient(180deg,#07090b,#0a0d10 55%,#080a0c);\n  color:var(--text);\n  overflow:hidden;\n  font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;\n  letter-spacing:.02em;\n}\nbody::before{content:'';position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(180deg, rgba(255,255,255,.018) 0 2px, transparent 2px 4px);opacity:.12}\nbutton{font:inherit;color:inherit;background:none;border:0;cursor:pointer}\nbutton:focus-visible{outline:2px solid var(--accent);outline-offset:3px}\n.wrap{min-height:100%;display:grid;grid-template-columns:320px 1fr;gap:22px;padding:24px}\n.sidebar{background:linear-gradient(180deg, rgba(16,22,25,.92), rgba(10,13,16,.94));border:1px solid var(--line);box-shadow:var(--shadow);padding:20px;display:flex;flex-direction:column;min-width:0}\n.kicker{font-size:11px;color:var(--muted);letter-spacing:.18em;text-transform:uppercase}\n.logo{font-family:Arial, Helvetica, sans-serif;font-weight:900;font-size:56px;line-height:.85;letter-spacing:-.1em;margin:10px 0 18px}\n.logo span{color:var(--accent)}\n.page-title{font-size:24px;line-height:1.1;margin:0 0 6px;font-weight:900;color:var(--text);text-transform:uppercase}\n.page-desc{font-size:12px;line-height:1.8;color:#c0c9c1;margin:0 0 18px}\n.channels{display:grid;gap:8px;margin:0 0 18px}\n.channel-btn{display:grid;grid-template-columns:70px 1fr auto;gap:12px;align-items:center;width:100%;padding:12px 12px;border:1px solid var(--line);background:rgba(255,255,255,.02);text-align:left;transition:.18s transform,.18s color,.18s border-color,.18s background}\n.channel-btn strong{font-size:12px;color:var(--muted);letter-spacing:.12em}\n.channel-btn span{font-size:15px;font-weight:700}\n.channel-btn em{font-style:normal;opacity:0;color:var(--accent);transform:translateX(-4px);transition:inherit}\n.channel-btn:hover,.channel-btn.active{color:var(--accent);transform:translateX(6px);border-color:rgba(201,255,70,.34);background:rgba(201,255,70,.06)}\n.channel-btn:hover strong,.channel-btn.active strong{color:#ebf8e7}\n.channel-btn:hover em,.channel-btn.active em{opacity:1;transform:translateX(0)}\n.controls{margin-top:auto;display:grid;gap:10px}\n.ctrlrow{display:flex;gap:8px;flex-wrap:wrap}\n.ctrlrow button{padding:10px 12px;border:1px solid var(--line);background:rgba(255,255,255,.03);font-size:11px;letter-spacing:.12em;text-transform:uppercase;transition:.18s}\n.ctrlrow button:hover{color:var(--accent);border-color:rgba(201,255,70,.34);background:rgba(201,255,70,.07)}\n.info{border:1px solid var(--line);background:rgba(255,255,255,.02);padding:12px;font-size:11px;color:var(--muted);line-height:1.7}\n.stage{display:grid;grid-template-rows:minmax(0,1fr) auto;gap:18px;min-width:0}\n.crt-shell{position:relative;background:linear-gradient(180deg,#1f282d,#0e1417);border:1px solid #364248;border-radius:26px;padding:28px 28px 36px;box-shadow:0 28px 70px rgba(0,0,0,.50), inset 0 2px 0 rgba(255,255,255,.05);min-height:0;overflow:hidden}\n.crt-shell::before{content:'';position:absolute;inset:12px;border-radius:22px;border:1px solid rgba(255,255,255,.06);pointer-events:none}\n.brandplate{position:absolute;top:14px;left:24px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#93a195}\n.statuslight{position:absolute;top:18px;right:26px;width:12px;height:12px;border-radius:50%;background:var(--accent);box-shadow:0 0 14px rgba(201,255,70,.65)}\n.crt-screen{position:relative;height:100%;min-height:420px;background:#020303;border-radius:18px;overflow:hidden;border:2px solid #0f1417;box-shadow:inset 0 0 40px rgba(0,0,0,.8), inset 0 0 120px rgba(0,0,0,.35)}\n.screen-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:1;transition:opacity .35s ease, transform .45s ease}\n.screen-overlay{position:absolute;inset:0;pointer-events:none;background:\n radial-gradient(circle at 50% 48%, transparent 24%, rgba(0,0,0,.12) 74%, rgba(0,0,0,.55) 100%),\n linear-gradient(180deg, rgba(255,255,255,.06), transparent 18%, transparent 82%, rgba(255,255,255,.03)),\n repeating-linear-gradient(180deg, rgba(255,255,255,.035) 0 2px, transparent 2px 4px);\n mix-blend-mode:screen;opacity:.52}\n.curve{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.03), inset 0 0 80px rgba(255,255,255,.05)}\n.noise{position:absolute;inset:0;pointer-events:none;opacity:0;background:\n repeating-linear-gradient(0deg, rgba(255,255,255,.18) 0 1px, transparent 1px 4px),\n repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 2px, transparent 2px 6px),\n linear-gradient(90deg, rgba(255,0,64,.06), rgba(0,255,255,.06));mix-blend-mode:screen}\n.crt-screen.switching .noise{animation:noiseFlash .36s linear 1}\n.crt-screen.switching .screen-img{transform:scale(1.015);filter:contrast(1.08) saturate(1.08)}\n@keyframes noiseFlash{0%{opacity:0}10%{opacity:.9}30%{opacity:.35}45%{opacity:.8}100%{opacity:0}}\n.bottom-bar{display:grid;grid-template-columns:1.4fr 1fr auto;gap:16px;align-items:center;margin-top:16px;padding:12px 14px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.18);border-radius:14px}\n.meta h2{margin:0 0 5px;font-size:28px;line-height:1;color:var(--accent2);text-transform:uppercase;letter-spacing:.04em}\n.meta p{margin:0;font-size:12px;color:#c3cdc4;line-height:1.8}\n.signal{font-size:12px;color:#bfd19d;letter-spacing:.14em;text-transform:uppercase}\n.tag{justify-self:end;padding:8px 10px;border:1px solid rgba(201,255,70,.26);background:rgba(201,255,70,.06);font-size:12px;color:var(--accent);letter-spacing:.15em;text-transform:uppercase}\n.thumb-row{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;min-width:0}\n.thumb-tv{position:relative;background:linear-gradient(180deg,#20282d,#11171a);border:1px solid #323b40;border-radius:16px;padding:12px 12px 16px;box-shadow:var(--shadow);min-width:0}\n.thumb-screen{position:relative;height:96px;border-radius:10px;overflow:hidden;background:#040506;border:2px solid #0f1417}\n.thumb-screen img{width:100%;height:100%;object-fit:cover}\n.thumb-screen::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 50%, transparent 28%, rgba(0,0,0,.12) 74%, rgba(0,0,0,.38) 100%),repeating-linear-gradient(180deg, rgba(255,255,255,.035) 0 2px, transparent 2px 4px);pointer-events:none;opacity:.45}\n.thumb-tv button{display:block;width:100%;text-align:left;padding:0}\n.thumb-label{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-top:10px;font-size:11px;color:#c8d1c8;text-transform:uppercase;letter-spacing:.14em}\n.thumb-tv.active{outline:2px solid rgba(201,255,70,.55);outline-offset:2px}\n.thumb-tv.active .thumb-label{color:var(--accent)}\n.backnote{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.14em}\n@media (max-width:1080px){\n  body{overflow:auto}\n  .wrap{grid-template-columns:1fr;padding:16px}\n  .thumb-row{grid-template-columns:repeat(2,1fr)}\n  .bottom-bar{grid-template-columns:1fr}\n  .tag{justify-self:start}\n}\n.screen-img{object-fit:contain;cursor:zoom-in}.crt-shell{overflow:visible}.crt-screen{height:clamp(300px,60vh,850px);min-height:0}.wrap{min-height:100%;height:auto}.stage{grid-template-rows:auto auto}body{overflow:auto}.thumb-row{padding-bottom:80px}.crt-screen.switching .noise{animation:none;opacity:.22;transition:opacity .2s}.screen-overlay{opacity:.24}@media(max-width:1080px){.crt-screen{height:50vh}} <\/style>\n<\/head>\n<body>\n<div class=\"wrap\">\n  <aside class=\"sidebar\">\n    <div>\n      <div class=\"kicker\">glutenfree_ / page 05<\/div>\n      <div class=\"logo\">g<span>l<\/span>uten<span>free_<\/span><\/div>\n      <h1 class=\"page-title\">Gallery / CRT Mode<\/h1>\n      <p class=\"page-desc\">古いブラウン管モニターでイラストを視聴する、チャンネル切替型ギャラリー。左右キーまたはボタンで切り替えできます。<\/p>\n      <div class=\"channels\" id=\"channelList\"><\/div>\n    <\/div>\n    <div class=\"controls\">\n      <div class=\"ctrlrow\">\n        <button id=\"prevBtn\">◀ Channel Down<\/button>\n        <button id=\"nextBtn\">Channel Up ▶<\/button>\n      <\/div>\n      <div class=\"ctrlrow\">\n        <button id=\"randomBtn\">Random Tune<\/button>\n        <button id=\"powerBtn\">Power Off<\/button>\n      <\/div>\n      <div class=\"info\">\n        <div>SYSTEM : CRT MONITOR ROOM<\/div>\n        <div>INPUT : KEYBOARD / POINTER<\/div>\n        <div class=\"backnote\">← → : change channel / enter : lock signal<\/div>\n      <\/div>\n    <\/div>\n  <\/aside>\n\n  <main class=\"stage\">\n    <section class=\"crt-shell\">\n      <div class=\"brandplate\">GF MONITOR // VISUAL ARCHIVE<\/div>\n      <div class=\"statuslight\" id=\"statusLight\"><\/div>\n      <div class=\"crt-screen\" id=\"screen\">\n        <img class=\"screen-img\" id=\"screenImg\" alt=\"gallery image\">\n        <div class=\"noise\"><\/div>\n        <div class=\"screen-overlay\"><\/div>\n        <div class=\"curve\"><\/div>\n      <\/div>\n      <div class=\"bottom-bar\">\n        <div class=\"meta\">\n          <h2 id=\"title\">ARCADE MODE<\/h2>\n          <p id=\"desc\">ゲームセンターのネオンと翠の相性が最高。<\/p>\n        <\/div>\n        <div class=\"signal\" id=\"signal\">CH-05 / SIGNAL LOCKED<\/div>\n        <div class=\"tag\" id=\"tag\">live view<\/div>\n      <\/div>\n    <\/section>\n\n    <section class=\"thumb-row\" id=\"thumbRow\"><\/section>\n  <\/main>\n<\/div>\n\n<script>\nconst items = [{\"channel\": \"CH-01\", \"title\": \"MORNING MODE\", \"desc\": \"朝の気配が残る、静かな一枚。\", \"src\": \"images/visual-01.png\"}, {\"channel\": \"CH-02\", \"title\": \"TACTICAL SIDE\", \"desc\": \"翠のクールさが強く出るメインビジュアル。\", \"src\": \"images/visual-02.png\"}, {\"channel\": \"CH-03\", \"title\": \"DOUBLE STACK\", \"desc\": \"遊び心のあるポップなハンバーガー回。\", \"src\": \"images/visual-03.png\"}, {\"channel\": \"CH-04\", \"title\": \"HOOD ERROR\", \"desc\": \"ダウナーな空気とフードのシルエットが映える。\", \"src\": \"images/visual-04.png\"}, {\"channel\": \"CH-05\", \"title\": \"ARCADE MODE\", \"desc\": \"ゲームセンターのネオンと翠の相性が最高。\", \"src\": \"images/visual-05.png\"}];\nlet index = 0;\nlet powerOn = true;\nconst screen = document.getElementById('screen');\nconst screenImg = document.getElementById('screenImg');\nconst titleEl = document.getElementById('title');\nconst descEl = document.getElementById('desc');\nconst signalEl = document.getElementById('signal');\nconst tagEl = document.getElementById('tag');\nconst lightEl = document.getElementById('statusLight');\nconst channelList = document.getElementById('channelList');\nconst thumbRow = document.getElementById('thumbRow');\n\nitems.forEach((item,i)=>{\n  const btn = document.createElement('button');\n  btn.className = 'channel-btn';\n  btn.innerHTML = `<strong>${item.channel}<\/strong><span>${item.title}<\/span><em>▶<\/em>`;\n  btn.addEventListener('mouseenter',()=>{});\n  btn.addEventListener('click',()=>switchChannel(i,true));\n  channelList.appendChild(btn);\n\n  const box = document.createElement('div');\n  box.className = 'thumb-tv';\n  box.innerHTML = `<button type=\"button\"><div class=\"thumb-screen\"><img src=\"${item.src}\" alt=\"${item.title}\"><\/div><div class=\"thumb-label\"><span>${item.channel}<\/span><span>${item.title}<\/span><\/div><\/button>`;\n  box.querySelector('button').addEventListener('click',()=>switchChannel(i,true));\n  thumbRow.appendChild(box);\n});\nconst channelBtns=[...document.querySelectorAll('.channel-btn')];\nconst thumbTvs=[...document.querySelectorAll('.thumb-tv')];\n\nfunction setIndex(i){\n  index = (i + items.length) % items.length;\n  channelBtns.forEach((b,idx)=>b.classList.toggle('active', idx===index));\n  thumbTvs.forEach((b,idx)=>b.classList.toggle('active', idx===index));\n  const item = items[index];\n  titleEl.textContent = item.title;\n  descEl.textContent = item.desc;\n  signalEl.textContent = `${item.channel} / SIGNAL LOCKED`;\n  tagEl.textContent = `visual ${String(index+1).padStart(2,'0')}`;\n}\nfunction applyCurrentImage(){\n  const item = items[index];\n  screenImg.src = item.src;\n  screenImg.alt = item.title;\n}\nfunction switchChannel(i, doNoise=false){\n  if(!powerOn) return;\n  setIndex(i);\n  if(doNoise){\n    screen.classList.remove('switching');\n    void screen.offsetWidth;\n    screen.classList.add('switching');\n    setTimeout(()=>screen.classList.remove('switching'), 360);\n  }\n  applyCurrentImage();\n}\nfunction next(){ switchChannel(index+1,true); }\nfunction prev(){ switchChannel(index-1,true); }\nfunction randomChan(){\n  let n=index;\n  while(n===index) n=Math.floor(Math.random()*items.length);\n  switchChannel(n,true);\n}\nfunction togglePower(){\n  powerOn = !powerOn;\n  if(powerOn){\n    lightEl.style.background='var(--accent)';\n    lightEl.style.boxShadow='0 0 14px rgba(201,255,70,.65)';\n    screenImg.style.opacity='1';\n    titleEl.textContent = items[index].title;\n    descEl.textContent = items[index].desc;\n    signalEl.textContent = `${items[index].channel} / SIGNAL LOCKED`;\n    tagEl.textContent = `visual ${String(index+1).padStart(2,'0')}`;\n    applyCurrentImage();\n    document.getElementById('powerBtn').textContent='Power Off';\n  } else {\n    lightEl.style.background='#283028';\n    lightEl.style.boxShadow='none';\n    screen.classList.remove('switching');\n    screenImg.style.opacity='0';\n    titleEl.textContent='NO SIGNAL';\n    descEl.textContent='モニターの電源が切れています。';\n    signalEl.textContent='-- / SCREEN OFF';\n    tagEl.textContent='standby';\n    document.getElementById('powerBtn').textContent='Power On';\n  }\n}\n\ndocument.getElementById('prevBtn').addEventListener('click',prev);\ndocument.getElementById('nextBtn').addEventListener('click',next);\ndocument.getElementById('randomBtn').addEventListener('click',randomChan);\ndocument.getElementById('powerBtn').addEventListener('click',togglePower);\nwindow.addEventListener('keydown',(e)=>{\n  if(e.key==='ArrowRight'){e.preventDefault(); next();}\n  if(e.key==='ArrowLeft'){e.preventDefault(); prev();}\n  if(e.key==='Enter'){e.preventDefault(); switchChannel(index,true);}\n});\n\nindex = items.length - 1;\nswitchChannel(index,false);\nscreenImg.addEventListener('click',()=>{if(powerOn)parent.gfOpenArt(items[index].src)});\n<\/script>\n<\/body>\n<\/html>";
document.getElementById('crtBack').onclick=()=>{retroClick();location.hash='characters';};
document.getElementById('crtHome').onclick=()=>{retroClick();location.hash='home';};


function route(){if(location.hash==='#gallery'){navigate(1,false);showCRT();return;}hideCRT();const i=menuBtns.findIndex(b=>b.dataset.name.toLowerCase()===location.hash.slice(1));navigate(Math.max(0,i),false);}
window.addEventListener('hashchange',route);document.getElementById('backHome').onclick=()=>{try{retroClick()}catch(e){};sceneTransition(0);};route();
menuBtns.forEach((btn,idx)=>{
  btn.addEventListener('mouseenter',()=>setMenu(idx,true));btn.addEventListener('mouseleave',()=>{hoverIndex=-1;});
  btn.addEventListener('focus',()=>setMenu(idx,true));
  btn.addEventListener('click',()=>confirmMenu(idx));
});
window.addEventListener('keydown',e=>{
  if(e.target.matches('input')||!document.body.classList.contains('is-home'))return;
  if(e.key==='ArrowDown'){ e.preventDefault(); setMenu(menuIndex+1,true); }
  if(e.key==='ArrowUp'){ e.preventDefault(); setMenu(menuIndex-1,true); }
  if(e.key==='ArrowRight'){ e.preventDefault(); showVisual(visualIndex+1); retroClick(); }
  if(e.key==='ArrowLeft'){ e.preventDefault(); showVisual(visualIndex-1); retroClick(); }
  if(e.key==='Enter' && !e.target.closest('button,input')){ e.preventDefault(); confirmMenu(menuIndex); }
});

document.getElementById('nextBtn').addEventListener('click',()=>{ loadTrack(currentTrack+1); playTrack(); try{retroClick()}catch(e){} });
document.getElementById('sfxBtn').addEventListener('click',()=>{ sfxOn=!sfxOn; document.getElementById('sfxBtn').textContent='SFX '+(sfxOn?'ON':'OFF'); if(sfxOn) retroClick(); });
musicBtn.addEventListener('click',()=>{
  retroClick();
  if(bgm.paused){ playTrack(); }
  else { playRequest++; bgm.pause(); playState.textContent='PAUSE'; musicBtn.textContent='▶'; }
});
document.getElementById('seek').addEventListener('input',e=>{if(Number.isFinite(bgm.duration))bgm.currentTime=bgm.duration*e.target.value/1000});document.getElementById('volume').addEventListener('input',e=>bgm.volume=e.target.value/100);document.getElementById('prevTrack').onclick=()=>{loadTrack(currentTrack-1);playTrack();try{retroClick()}catch(e){}};
document.getElementById('shuffleBtn').onclick=()=>{chooseRandomNext();try{retroClick()}catch(e){}};
bgm.addEventListener('error',()=>{playState.textContent='ERROR';musicBtn.textContent='▶'});
document.querySelectorAll('.wheel button').forEach(b=>b.addEventListener('pointerenter',retroHover));

const charPortrait=document.getElementById('charPortrait');charPortrait.src=visuals[1].src;
const roster=document.getElementById('roster');['MIDORI','DAI','YOSHIRO','SHO','TSUKUMO','HIIRO','GAKU'].forEach((n,i)=>{const b=document.createElement('button');b.textContent=(i===0?'▶ ':'')+n;b.disabled=i!==0;b.title=i?'COMING SOON':'MIDORI';if(!i){b.className='on';b.onclick=()=>showCommand('PROFILE')}roster.append(b)});
let typing, hits=0, unlocked=false;const talk=document.getElementById('charTalk');function say(line){clearInterval(typing);talk.textContent='';let j=0;typing=setInterval(()=>{talk.textContent=line.slice(0,++j);if(j>=line.length)clearInterval(typing)},35)}
const profile='<p>雨水 翠（あまみ みどり）</p><p>AGE / 28　HEIGHT / 178 cm<br>所属 / 異祓士・第二弟子</p><p>無愛想で皮肉屋。面倒くさがりだが、ゲームの腕は抜群。猫には甘い。</p>';
const commands=['GALLERY'];const cmd=document.getElementById('commands');commands.forEach(n=>{let b=document.createElement('button');b.textContent=n;b.onclick=()=>{retroClick();openCRT()};b.onpointerenter=retroHover;cmd.append(b)});
let galleryIndex=0, galleryPower=true;
function renderSingle(n){document.getElementById("character").dataset.command=n;document.getElementById('commandTitle').textContent='MIDORI.exe / '+n;[...cmd.children].forEach(b=>b.classList.toggle('on',b.textContent===n));const el=document.getElementById('commandContent');const label=t=>'<div class="gf-label">'+t+'</div>';
if(n==='PROFILE'){el.innerHTML=label('01 / PERSONNEL DATABASE')+'<h2 style="color:#c8ff46;margin:0">雨水 翠</h2><p>AMAMI MIDORI</p><div class="gf-data"><div><small>AGE</small><strong>28</strong></div><div><small>HEIGHT</small><strong>178 cm</strong></div><div><small>CLASS</small>異祓士</div><div><small>RANK</small>第二弟子</div></div><p>無愛想で皮肉屋。面倒くさがりだが、ゲームの腕は抜群。猫には甘い。</p>'}
else if(n==='STATUS'){el.innerHTML=label('02 / PERFORMANCE ANALYSIS · DEMO')+[['POWER',8],['SPEED',6],['TECH',9],['STAMINA',7],['CAT LOVE',10]].map(([a,v])=>`<div class="stat"><span>${a}</span><div class="blocks">${Array.from({length:10},(_,i)=>'<i style="animation-delay:'+i*35+'ms" class="'+(i<v?'fill':'')+'"></i>').join('')}</div></div>`).join('')}
else if(n==='WEAPON'){el.innerHTML=label('03 / EQUIPMENT BLUEPRINT')+'<div class="gf-weapon"><svg viewBox="0 0 240 120" aria-label="仮のハンマー設計図"><g fill="none" stroke="#c8ff46" stroke-width="2"><path d="M30 24H170V64H30Z M43 24V64 M157 24V64 M93 64H107V110H93Z"/><path stroke-dasharray="4 4" d="M20 15H180M20 12V20M180 12V20M185 24V64M180 24H190M180 64H190"/><path d="M55 35H145V53H55Z"/></g></svg></div><h3>HEAVY HAMMER</h3><p>巨大ハンマー / 仮設計図</p><p>詳細スペック：未設定</p>'}
else if(n==='TALK'){el.innerHTML=label('04 / COMMUNICATION LINK')+'<div class="gf-talk"><strong>▶ MIDORI</strong><p>翠に話しかける。</p><button id="talkAgain">A / TALK</button></div>';document.getElementById('talkAgain').onclick=()=>{retroClick();say(['「……何だよ。」','「朝から元気だな、お前。」','「猫？ ……どこ。」','「ゲームなら付き合ってやるよ。」','「ジジイに聞け。」'][Math.floor(Math.random()*5)])}}
else if(n==='GALLERY'){el.innerHTML=label('05 / CRT VISUAL ARCHIVE')+'<div class="gf-crt" id="gfCRT"><img id="gfArt" alt="翠のイラスト"></div><div class="gf-channel" id="gfChannel"></div><div class="gf-controls"><button id="gfPrev">◀ CH</button><button id="gfNext">CH ▶</button><button id="gfPower">POWER</button><button id="gfExpand">FULL VIEW</button></div><div class="gf-thumbs" id="gfThumbs"></div>';const draw=()=>{const art=document.getElementById('gfArt'),crt=document.getElementById('gfCRT');art.src=visuals[galleryIndex].src;art.style.visibility=galleryPower?'visible':'hidden';document.getElementById('gfChannel').textContent=galleryPower?'CH-'+String(galleryIndex+1).padStart(2,'0')+' / '+visuals[galleryIndex].name:'NO SIGNAL';crt.classList.remove('tune');void crt.offsetWidth;crt.classList.add('tune');[...document.getElementById('gfThumbs').children].forEach((b,i)=>b.classList.toggle('on',i===galleryIndex))};const move=i=>{galleryIndex=(i+visuals.length)%visuals.length;galleryPower=true;retroClick();draw()};visuals.forEach((v,i)=>{const b=document.createElement('button'),im=document.createElement('img');im.src=v.src;im.alt=v.name;b.append(im);b.onclick=()=>move(i);document.getElementById('gfThumbs').append(b)});document.getElementById('gfExpand').onclick=()=>{if(galleryPower)gfOpenArt(visuals[galleryIndex].src)};document.getElementById('gfArt').onclick=()=>{if(galleryPower)gfOpenArt(visuals[galleryIndex].src)};document.getElementById('gfPrev').onclick=()=>move(galleryIndex-1);document.getElementById('gfNext').onclick=()=>move(galleryIndex+1);document.getElementById('gfPower').onclick=()=>{galleryPower=!galleryPower;retroClick();draw()};draw()}
else {el.innerHTML=label('06 / ENCRYPTED DATA')+'<div class="gf-secret"><strong>'+(unlocked?'ACCESS GRANTED':'LOCKED / ???')+'</strong><p>'+(unlocked?'猫には甘い。':'ヒント：ミニキャラにちょっかいを出す。')+'</p>'+(unlocked?'<button id="catBtn">CALL CAT</button>':'')+'</div>';if(unlocked)document.getElementById('catBtn').onclick=()=>say('「……おいで。こっち。」')}
}

const combinedContent=document.getElementById('commandContent');
function showCommand(n){
 if(n==='GALLERY'){openCRT();return;}
 if(n==='SECRET'){const secret=document.getElementById('combinedSecret');if(secret){secret.hidden=!unlocked;const old=combinedContent.id;combinedContent.id='combinedMain';secret.id='commandContent';renderSingle('SECRET');secret.id='combinedSecret';combinedContent.id=old;document.getElementById('commandTitle').textContent='MIDORI.exe / CHARACTER DATA';document.getElementById('character').dataset.command='PROFILE';}return;}
 if(combinedContent.dataset.ready)return;
 for(const name of ['PROFILE','STATUS','WEAPON','TALK','SECRET']){const section=document.createElement('section');section.className='combinedSection';if(name==='SECRET'){section.id='combinedSecret';section.hidden=!unlocked;}const previous=combinedContent.id;combinedContent.id='combinedMain';section.id='commandContent';combinedContent.append(section);renderSingle(name);section.id=name==='SECRET'?'combinedSecret':'section'+name;combinedContent.id=previous;}
 combinedContent.dataset.ready='1';document.getElementById('commandTitle').textContent='MIDORI.exe / CHARACTER DATA';document.getElementById('character').dataset.command='PROFILE';
}
const sp=document.getElementById('spriteBtn');sp.onclick=()=>{hits++;document.getElementById('clickCount').textContent='INPUT '+String(hits).padStart(2,'0');const svg=sp.querySelector('svg');svg.classList.remove('bop');void svg.getBoundingClientRect();svg.classList.add('bop');retroClick();if(hits===5){unlocked=true;say('「……しつけぇな。猫でも連れてこい。」');showCommand('SECRET')}else say(hits>5?'「まだやんのかよ。」':['「……。」','「何だよ。」','「おい。」','「やめろ。」'][hits-1])};showCommand('PROFILE');

(()=>{const $=id=>document.getElementById(id),logo=document.querySelector('.logo');let taps=0,last=0,busy=false,found=false;try{found=localStorage.getItem('gf_extra_v1')==='1'}catch(e){};const shortcut=$('extraShortcut');shortcut.hidden=!found;let saved=null;const seaAudio=new Audio('music/track-06.mp3');seaAudio.loop=true;seaAudio.preload='auto';seaAudio.volume=.25;function stopSea(){seaAudio.pause();seaAudio.currentTime=0}function seaSound(){seaAudio.volume=bgm.volume;seaAudio.play().catch(()=>{});}function openGate(){if(!saved){saved={playing:!bgm.paused};bgm.pause()}$('extraBoot').hidden=true;$('extraWorld').hidden=true;$('extraGate').hidden=false;stopSea();}function closeExtra(){$('extraGate').hidden=true;$('extraWorld').hidden=true;$('extraBoot').hidden=true;stopSea();if(saved?.playing)playTrack();saved=null}async function unlock(){if(busy)return;busy=true;found=true;try{localStorage.setItem('gf_extra_v1','1')}catch(e){}shortcut.hidden=false;$('extraBoot').hidden=false;$('bootText').textContent='';for(const line of ['> SYSTEM SCANNING...','> UNKNOWN DATA FOUND.','> MOUNTING SECRET WORLD...','> ACCESS GRANTED.']){const p=document.createElement('div');p.textContent=line;$('bootText').append(p);try{retroClick()}catch(e){};await new Promise(r=>setTimeout(r,350))}openGate();busy=false}logo.tabIndex=0;logo.setAttribute('role','button');function tap(){if(Date.now()-last>1600)taps=0;last=Date.now();if(++taps===5){taps=0;unlock()}}logo.addEventListener('click',tap);logo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();tap()}});shortcut.onclick=openGate;$('extraReturn').onclick=closeExtra;let diving=false;function diveSound(){if(!sfxOn)return;try{const c=new (window.AudioContext||window.webkitAudioContext)();c.resume().catch(()=>{});const t=c.currentTime;const master=c.createGain();master.gain.value=.55;master.connect(c.destination);const len=Math.floor(c.sampleRate*2.5),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);let z=0;for(let i=0;i<len;i++){z=.96*z+.04*(Math.random()*2-1);d[i]=z*3}const n=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();n.buffer=buf;f.type='lowpass';f.frequency.setValueAtTime(1300,t);f.frequency.exponentialRampToValueAtTime(180,t+2.3);g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(.33,t+.22);g.gain.exponentialRampToValueAtTime(.001,t+2.45);n.connect(f).connect(g).connect(master);n.start(t);for(let i=0;i<24;i++){const a=t+.06+i*.087+Math.random()*.045,o=c.createOscillator(),v=c.createGain(),freq=140+Math.random()*490;o.type='sine';o.frequency.setValueAtTime(freq,a);o.frequency.exponentialRampToValueAtTime(freq*(1.5+Math.random()),a+.14);v.gain.setValueAtTime(.001,a);v.gain.exponentialRampToValueAtTime(.10+Math.random()*.10,a+.026);v.gain.exponentialRampToValueAtTime(.001,a+.19);o.connect(v).connect(master);o.start(a);o.stop(a+.20)}setTimeout(()=>c.close().catch(()=>{}),2800)}catch(e){}}$('enterSea').onclick=async()=>{if(diving)return;diving=true;$('enterSea').disabled=true;seaAudio.volume=0;seaAudio.play().catch(()=>{});const fx=$('diveFX');diveSound();try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){fx.querySelectorAll('i').forEach(x=>x.remove());for(let j=0;j<42;j++){const b=document.createElement('i'),r=7+Math.random()*38;b.style.cssText=`left:${Math.random()*100}%;width:${r}px;height:${r}px;--life:${1.2+Math.random()*1.4}s;--delay:${Math.random()*.85}s;--drift:${(Math.random()-.5)*150}px`;fx.append(b)}fx.hidden=false;await fx.animate([{opacity:0},{opacity:1}],{duration:420,fill:'forwards'}).finished;await new Promise(r=>setTimeout(r,1500));}$('extraGate').hidden=true;$('extraWorld').hidden=false;seaAudio.currentTime=0;seaSound();if(!fx.hidden)await fx.animate([{opacity:1},{opacity:0}],{duration:650,fill:'forwards'}).finished;}finally{fx.hidden=true;fx.getAnimations().forEach(a=>a.cancel());$('enterSea').disabled=false;diving=false}};$('seaBack').onclick=openGate;$('seaTalk').onclick=()=>{$('seaLine').textContent=['遠くから、微かな旋律が聞こえる。','光の粒が、静かに漂っている。','ここにはまだ、知らない物語がある。'][Math.floor(Math.random()*3)]};window.addEventListener('keydown',e=>{if(e.key==='Escape'&&saved&&!diving)closeExtra()});window.addEventListener('keydown',e=>{if(saved||busy){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter'].includes(e.key)&&e.target===document.body){e.stopImmediatePropagation();e.preventDefault()}}},true);})();
