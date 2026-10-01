import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { screenSVG, screenContent, storyboard } from '../docs/wireframes/screens.mjs';
const dest = new URL('../docs/wireframes/', import.meta.url);
await mkdir(dest,{recursive:true});
for (const [i,frame] of storyboard.entries()) {
  await writeFile(new URL(`${String(i+1).padStart(2,'0')}-${frame.state}.svg`,dest),screenSVG(frame.state,frame.index,{progress:frame.progress}));
}
const escape = s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
let svg='<svg xmlns="http://www.w3.org/2000/svg" width="1152" height="1020" viewBox="0 0 1152 1020" role="img" aria-labelledby="title desc"><title id="title">RetroLauncher — cartridge shelf and loading storyboard</title><desc id="desc">Six proposed 160 by 144 screens: browse, navigate, pick up, insert, click, and an explicitly labeled unimplemented game handoff.</desc><rect width="1152" height="1020" fill="#f5f2e9"/><g font-family="Arial,sans-serif" fill="#30333e"><text x="40" y="48" font-size="25" font-weight="bold">RETROLAUNCHER / INTERACTION WIREFRAMES</text><text x="40" y="76" font-size="15">160 × 144 logical pixels · schematic label artwork · design preview, not a playable compilation</text>';
for(const [i,f] of storyboard.entries()){
 const x=40+(i%3)*372,y=114+Math.floor(i/3)*432;
 svg+=`<text x="${x}" y="${y}" font-size="19" font-weight="bold">${escape(f.title)}</text><text x="${x}" y="${y+23}" font-size="12" letter-spacing="1">${f.time}</text><g transform="translate(${x} ${y+40}) scale(2)" shape-rendering="crispEdges">${screenContent(f.state,f.index,{progress:f.progress})}</g><rect x="${x}" y="${y+40}" width="320" height="288" fill="none" stroke="#30333e"/>`;
 const words=f.description.split(' ');let lines=[''];
 for(const word of words){let n=lines.length-1;if((lines[n]+' '+word).trim().length>43)lines.push(word);else lines[n]=(lines[n]+' '+word).trim();}
 lines.forEach((line,j)=>{svg+=`<text x="${x}" y="${y+351+j*19}" font-size="14">${escape(line)}</text>`;});
}
svg+='<text x="40" y="995" font-size="13">Music direction: the original site track. Native audio conversion, game switching, and return from real games remain unresolved.</text></g></svg>';
await writeFile(new URL('storyboard.svg',dest),svg);
console.log(`Rendered six screens and storyboard to ${fileURLToPath(dest)}`);
