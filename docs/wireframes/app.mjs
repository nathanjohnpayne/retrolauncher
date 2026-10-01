import { games, screenSVG, storyboard } from './screens.mjs';
const $ = id => document.getElementById(id);
let index=0, state='browse', frameId=0, context, musicFailed=false;
const music = new Audio('https://developers.openai.com/modretro/audio/ambient-chiptune-loop.mp3');
music.loop=true; music.volume=.22;
$('motion').checked=!matchMedia('(prefers-reduced-motion: reduce)').matches;
$('frames').innerHTML=storyboard.map(f=>`<article class="frame">${screenSVG(f.state,f.index,{progress:f.progress})}<h3>${f.title}</h3><span class="timing">${f.time}</span><p>${f.description}</p></article>`).join('');
function draw(options={}) {
  $('screen').innerHTML=screenSVG(state,index,{muted:!$('music').checked,...options});
  $('screen').setAttribute('aria-label',state==='browse'?`Select ${games[index][0]}`:'Return to cartridge shelf');
  $('game-title').textContent=games[index][0];
  $('position').textContent=`Cartridge ${String(index+1).padStart(2,'0')} / 13`;
  for(const id of ['previous','next','play']) $(id).disabled=state!=='browse';
  $('back').disabled=state==='browse';
}
function reset() {cancelAnimationFrame(frameId);state='browse';music.volume=.22;$('status').textContent='Browse the shelf, then select a cartridge.';draw();}
function navigate(direction) {
  if(state!=='browse')return;
  index=(index+direction+games.length)%games.length;
  $('status').textContent=`${games[index][0]} selected. Press A to load.`;
  cancelAnimationFrame(frameId);
  const start=performance.now();
  const slide=now=>{const p=Math.min(1,(now-start)/180);draw({offset:$('motion').checked?Math.round(direction*10*(1-p)):0});if(p<1)frameId=requestAnimationFrame(slide);};
  frameId=requestAnimationFrame(slide);
}
function unlockAudio(){if(!$('sound').checked)return;context??=new (window.AudioContext||window.webkitAudioContext)();context.resume().catch(()=>{});}
function clickSound(){
  if(!$('sound').checked||!context)return;
  const buffer=context.createBuffer(1,Math.floor(context.sampleRate*.055),context.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/(context.sampleRate*.009));
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
  filter.type='highpass';filter.frequency.value=700;gain.gain.value=.45;source.buffer=buffer;
  source.connect(filter).connect(gain).connect(context.destination);source.start();
}
function play(){
  if(state!=='browse')return;
  cancelAnimationFrame(frameId);unlockAudio();
  $('status').textContent='Inserting cartridge…';
  const start=performance.now();let clicked=false;
  const animate=now=>{
    const t=$('motion').checked?now-start:1150;
    state=t<220?'lift':t<700?'insert':t<900?'click':'handoff';
    if(t>=700&&!clicked){clicked=true;clickSound();music.volume=.06;}
    if(t>=900)music.volume=.22;
    draw({progress:Math.max(0,Math.min(1,(t-220)/480)),liftProgress:Math.min(1,t/220),nudge:t>=700&&t<750?1:0});
    if(t<1150)frameId=requestAnimationFrame(animate);
    else $('status').textContent='Animation complete. A native launcher would start the game here. This preview does not load ROMs.';
  };frameId=requestAnimationFrame(animate);
}
async function toggleMusic(){
  musicFailed=false;
  if($('music').checked){try{await music.play();$('audio-status').textContent='Playing the original ModRetro + Codex site track.';}catch{musicFailed=true;$('music').checked=false;$('audio-status').textContent='The site track could not be played. Enable music to retry.';}}
  else {music.pause();$('audio-status').textContent='Music muted.';}
  draw();
}
music.addEventListener('error',()=>{if($('music').checked&&!musicFailed){musicFailed=true;$('music').checked=false;$('audio-status').textContent='The site track is unavailable. Enable music to retry.';draw();}});
$('previous').onclick=()=>navigate(-1);$('next').onclick=()=>navigate(1);$('play').onclick=play;$('back').onclick=reset;
$('screen').onclick=()=>state==='browse'?play():reset();$('music').onchange=toggleMusic;$('native').onchange=()=>document.body.classList.toggle('native',$('native').checked);
document.addEventListener('keydown',event=>{
  if(event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.target.tagName==='INPUT')return;
  const key=event.key.toLowerCase();
  if(key==='arrowleft'){event.preventDefault();navigate(-1);}else if(key==='arrowright'){event.preventDefault();navigate(1);}
  else if(key==='a'||(key==='enter'&&event.target===document.body)){event.preventDefault();play();}
  else if(key==='b'||key==='escape'){event.preventDefault();reset();}
  else if(key==='m'){event.preventDefault();$('music').checked=!$('music').checked;toggleMusic();}
});
draw();
