// Shared 160 × 144 wireframe renderer. No remote fonts, images, or game code.
export const games = [
  ['FlapGPT', 'FLAPGPT'], ['Ash & Oath', 'ASH & OATH'],
  ['Codex Land', 'CODEX LAND'], ['Arc Pocket', 'ARC POCKET'],
  ['Seedy’s Sweet Garden', 'SEEDY\'S|SWEET GARDEN'], ['Swarmfall', 'SWARMFALL'],
  ['Hollow Descent', 'HOLLOW DESCENT'], ['Cairn & Cinder', 'CAIRN & CINDER'],
  ['WhoadexWare', 'WHOADEXWARE'], ['Fetch Frenzy', 'FETCH FRENZY'],
  ['Pizza Dash', 'PIZZA DASH'], ['Cloudfall', 'CLOUDFALL'], ['Ember Escape', 'EMBER ESCAPE'],
];

// Original 5 × 7 bitmap lettering keeps every native-screen glyph on the pixel grid.
const glyphs = {
 A:['01110','10001','10001','11111','10001','10001','10001'],
 B:['11110','10001','10001','11110','10001','10001','11110'],
 C:['01111','10000','10000','10000','10000','10000','01111'],
 D:['11110','10001','10001','10001','10001','10001','11110'],
 E:['11111','10000','10000','11110','10000','10000','11111'],
 F:['11111','10000','10000','11110','10000','10000','10000'],
 G:['01111','10000','10000','10111','10001','10001','01111'],
 H:['10001','10001','10001','11111','10001','10001','10001'],
 I:['111','010','010','010','010','010','111'],
 J:['00111','00010','00010','00010','10010','10010','01100'],
 K:['10001','10010','10100','11000','10100','10010','10001'],
 L:['10000','10000','10000','10000','10000','10000','11111'],
 M:['10001','11011','10101','10101','10001','10001','10001'],
 N:['10001','11001','10101','10011','10001','10001','10001'],
 O:['01110','10001','10001','10001','10001','10001','01110'],
 P:['11110','10001','10001','11110','10000','10000','10000'],
 Q:['01110','10001','10001','10001','10101','10010','01101'],
 R:['11110','10001','10001','11110','10100','10010','10001'],
 S:['01111','10000','10000','01110','00001','00001','11110'],
 T:['11111','00100','00100','00100','00100','00100','00100'],
 U:['10001','10001','10001','10001','10001','10001','01110'],
 V:['10001','10001','10001','10001','10001','01010','00100'],
 W:['10001','10001','10001','10101','10101','10101','01010'],
 X:['10001','10001','01010','00100','01010','10001','10001'],
 Y:['10001','10001','01010','00100','00100','00100','00100'],
 Z:['11111','00001','00010','00100','01000','10000','11111'],
 '0':['01110','10001','10011','10101','11001','10001','01110'],
 '1':['010','110','010','010','010','010','111'],
 '2':['01110','10001','00001','00010','00100','01000','11111'],
 '3':['11110','00001','00001','01110','00001','00001','11110'],
 '4':['00010','00110','01010','10010','11111','00010','00010'],
 '5':['11111','10000','10000','11110','00001','00001','11110'],
 '6':['01110','10000','10000','11110','10001','10001','01110'],
 '7':['11111','00001','00010','00100','01000','01000','01000'],
 '8':['01110','10001','10001','01110','10001','10001','01110'],
 '9':['01110','10001','10001','01111','00001','00001','01110'],
 '/':['00001','00001','00010','00100','01000','10000','10000'],
 '&':['01100','10010','10100','01000','10101','10010','01101'],
 "'":['1','1','0','0','0','0','0'],
 '-':['000','000','000','111','000','000','000'],
 '.':['0','0','0','0','0','1','1'],
 '!':['1','1','1','1','1','0','1'],
 ' ':['000','000','000','000','000','000','000'],
};
const c = { ink:'#30333e', paper:'#f5f2e9', mid:'#a7a9b1', pale:'#dddedf', pink:'#d3a9b6' };
const rect = (x,y,w,h,fill=c.ink) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function lettering(value,x,y,center=false,color=c.ink) {
  const chars=[...value].map(ch=>glyphs[ch] || glyphs[' ']);
  if(center) x=Math.round(x-(chars.reduce((n,g)=>n+g[0].length+1,0)-1)/2);
  let parts=[];
  for(const glyph of chars){
    for(let row=0;row<7;row++) for(let col=0;col<glyph[row].length;col++)
      if(glyph[row][col]==='1') parts.push(rect(x+col,y+row,1,1,color));
    x+=glyph[0].length+1;
  }
  return parts.join('');
}
function art(index) {
  // Explicitly schematic label art, not reproductions of the game's artwork.
  let s=rect(44,40,72,42,c.pale);
  s+=`<path d="M46 77L62 54L80 72L94 52L114 78Z" fill="${c.mid}"/>`;
  s+=rect(55+(index%4)*12,46,8,8,c.paper)+rect(44,78,72,4,c.ink);
  s+=rect(72,60,15,11,c.paper)+rect(75,63,3,3)+rect(82,63,3,3)+rect(68,65,4,4,c.paper);
  return s;
}
function cart(index=0,x=0,y=0,scale=1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">`+
    `<path d="M38 24H120V30H124V94H118V98H38V92H34V30H38Z" fill="${c.ink}"/>`+
    `<path d="M40 26H118V32H122V92H116V96H40V90H36V32H40Z" fill="${c.pale}"/>`+
    rect(44,28,28,6,c.paper)+lettering(String(index+1).padStart(2,'0'),46,28)+
    [0,1,2].map(i=>rect(92,28+i*3,20,1,c.mid)).join('')+
    rect(42,38,76,46)+art(index)+rect(44,86,72,1,c.mid)+
    `<path d="M75 90H85L80 94Z" fill="${c.ink}"/></g>`;
}
function consoleBody() {
  return `<path d="M49 62H111V126H107V130H53V126H49Z" fill="${c.ink}"/>`+
    rect(51,64,58,62,c.pink)+rect(55,68,50,35)+rect(60,73,40,25,c.pale)+
    rect(60,110,15,5)+rect(65,105,5,15)+
    rect(91,110,7,7)+rect(101,105,7,7)+rect(78,123,9,2,c.ink)+rect(91,120,9,2,c.ink);
}
function counter(index,muted) {
  return lettering('RETRO',8,7)+lettering(`${String(index+1).padStart(2,'0')}/13`,117,7)+
    rect(8,19,144,1,c.mid)+(muted?lettering('M',96,7):rect(96,7,2,7)+rect(100,10,2,4)+rect(104,8,2,6));
}
export function screenContent(state='browse',index=0,{muted=false,progress=0,offset=0,liftProgress=1,nudge=0}={}) {
  let s=rect(0,0,160,144,c.paper);
  const title=games[index][1].split('|');
  if(state==='browse'||state==='slide') {
    s+=counter(index,muted);
    // Persistent arrows at the same location; only one complete cartridge is shown.
    s+=`<path d="M15 55L9 61L15 67M145 55L151 61L145 67" fill="none" stroke="${c.ink}" stroke-width="2"/>`;
    s+=cart(index,offset,0);
    title.forEach((line,i)=>{s+=lettering(line,80,104+i*9,true);});
    s+=rect(8,123,144,1,c.mid)+lettering('A PLAY',10,131)+lettering('SELECT MUTE',87,131);
  } else if(state==='handoff') {
    s+=lettering('DESIGN PREVIEW',80,10,true)+cart(index,32,14,.6);
    s+=lettering('GAME STARTS HERE',80,82,true)+lettering('ROM NOT LOADED',80,96,true);
    s+=rect(8,119,144,1,c.mid)+lettering('B BACK TO SHELF',80,130,true);
  } else {
    s+=lettering(state==='click'?'CLICK!':'LOADING',80,7,true);
    // Cartridge sits behind the console and disappears into its rear slot.
    const py=state==='lift'? 8 : state==='click'?48 : 8+Math.round(progress*40);
    const scale=state==='lift'?1-.5*liftProgress:.5;
    s+=cart(index,Math.round(80*(1-scale)),state==='lift'?Math.round(8*liftProgress):py,scale);
    s+=`<g transform="translate(0 ${nudge})">`+consoleBody()+'</g>';
    if(state==='click') {
      s+=rect(60,73,40,25,c.paper)+lettering('READY',80,82,true);
      s+=`<path d="M39 69H44M42 57L46 61M116 69H121M114 61L118 57" stroke="${c.ink}" stroke-width="2"/>`;
    } else s+=lettering('...',80,82,true);
    s+=lettering('CHROMATIC',80,135,true);
  }
  return s;
}
export function screenSVG(state='browse',index=0,options={}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 144" width="160" height="144" shape-rendering="crispEdges" role="img" aria-label="${escape(games[index][0]+' — '+state+' wireframe')}">${screenContent(state,index,options)}</svg>`;
}
export const storyboard = [
  {state:'browse',index:0,title:'01 / Browse',time:'RESTING STATE',description:'One cartridge, a readable title, a position count, and persistent left/right arrows.'},
  {state:'browse',index:1,title:'02 / Next cartridge',time:'180 MS',description:'D-pad left/right changes selection. The shelf wraps from 13 back to 1.'},
  {state:'lift',index:1,title:'03 / Pick it up',time:'0–220 MS',description:'A selects. The cartridge shrinks and lifts above a Chromatic silhouette.'},
  {state:'insert',index:1,progress:.55,title:'04 / Slide it in',time:'220–700 MS',description:'The cartridge moves behind the console toward its rear slot.'},
  {state:'click',index:1,title:'05 / The click',time:'700–900 MS',description:'A short mechanical click lands with a 1-pixel body nudge. Music ducks.'},
  {state:'handoff',index:1,title:'06 / Game handoff',time:'900–1,150 MS',description:'Proposed: start the selected game. This preview stops here; B returns to the shelf.'},
];
