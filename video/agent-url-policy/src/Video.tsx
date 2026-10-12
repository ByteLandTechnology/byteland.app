import React from 'react';
import {AbsoluteFill, Audio, useCurrentFrame, staticFile} from 'remotion';
import {BrandCanvas} from './BrandCanvas';
import timing from './timing.json';
export const durationInFrames=timing.durationInFrames;
const blue='#007aff',green='#34c759',red='#ff3b30',ink='#172033',muted='#5c687b';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const t=clamp(n);return t*t*t*(t*(t*6-15)+10)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const scenes=[
 {body:'An agent reads a page. Which address can it connect to?',k:'THE QUESTION',a:'An agent reads a page.',b:'Which address can it connect to?',color:blue},
 {body:'27 offline cases using the actual package and local responses. No network.',k:'THE EXPERIMENT',a:'27 offline cases.',b:'Actual package. Local responses. No network.',color:green},
 {body:'The URL policy rejects private address forms before fetching.',k:'BEFORE FETCH',a:'The URL policy makes a decision.',b:'Private address forms are rejected.',color:red},
 {body:'Examine each new target; reject private addresses before the next call.',k:'REDIRECTS',a:'Examine each new target.',b:'Reject the private target before the next call.',color:red},
 {body:'A hostname is one input; the connection address needs a separate control.',k:'DNS AND CONNECTION',a:'A hostname is one input.',b:'The connection address needs a different control.',color:blue},
 {body:'Connection types differ; private-network bindings change the available routes.',k:'RUNTIME SCOPE',a:'Examine the connection type.',b:'Private-network bindings change the available routes.',color:blue},
 {body:'Markdown now streams; converted responses omit Content-Length.',k:'RELATED OCTOBER 9 CHANGE',a:'Markdown now streams.',b:'Converted responses omit Content-Length.',color:blue},
 {body:'Count received bytes: the local limit worked without a size header.',k:'THE RESPONSE LIMIT',a:'Count the received bytes.',b:'Our local limit worked without the size header.',color:green},
 {body:'Use host, redirect and response limits, then test the network.',k:'BEFORE CONNECTION',a:'Use all three controls.',b:'Hosts. Redirects. Response limits. Then test the network.',color:blue},
];
const Text=({x,y,children,size=32,color=ink,weight=400,anchor='start'}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string;weight?:number;anchor?:'start'|'middle'|'end'})=><text x={x} y={y} fontSize={size} fill={color} fontWeight={weight} textAnchor={anchor}>{children}</text>;
const Box=({x,y,w=390,h=122,title,detail,color=blue}:{x:number;y:number;w?:number;h?:number;title:string;detail:string;color?:string})=><g><rect x={x} y={y} width={w} height={h} rx="22" fill="white" stroke={color} strokeWidth="3"/><Text x={x+28} y={y+47} size={30} weight={700} color={color}>{title}</Text><Text x={x+28} y={y+89} size={24} color={muted}>{detail}</Text></g>;
export function Frame({frame}:{frame:number}){
 const t=frame/60;
 let scene=0;for(let i=1;i<timing.scenes.length;i++)if(t>=timing.scenes[i])scene=i;
 const s=scenes[scene],local=t-timing.scenes[scene],reveal=ease(local/.6);
 // The URL token is a single shared element, with a continuous position at every scene boundary.
 const targets=[[200,427],[1110,390],[590,427],[990,427],[180,410],[1150,405],[200,437],[1090,410],[205,420]];
 const prev=targets[Math.max(0,scene-1)],cur=targets[scene];
 const move=scene===0?ease((t-.4)/1.2):ease(local/.9);
 const px=mix(prev[0],cur[0],move),py=mix(prev[1],cur[1],move);
 // C2 shared-carrier transitions. The opaque SDF logo remains outside every mask.
 const headerIn=ease((t-3.60)/.50),bodyIn=ease((t-3.68)/.60);
 const transitionOutStart=timing.outro-.16;
 const headerOut=ease((t-transitionOutStart)/.16),bodyOut=ease((t-transitionOutStart)/.46);
 const headerX=48*(1-headerIn)-24*headerOut;
 const chapterTitleShift=scene===0?0:12*(1-ease(local/.30));
 const bodyX=64*(1-bodyIn)-48*bodyOut;
 const tokenLabel=scene===2||scene===3?'PRIVATE URL':scene===4?'HOSTNAME':scene===7?'BODY LIMIT':'PUBLIC URL';
 const tokenColor=scene===2||scene===3?red:blue;

 return <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label={s.a}>

  <defs>
   <linearGradient id="header-theme" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0062cc"/><stop offset="50%" stopColor="#208235"/><stop offset="100%" stopColor="#d92820"/></linearGradient>
   <clipPath id="header-carrier-clip"><rect x="140" y="32" width={1364*headerIn*(1-headerOut)} height="82"/></clipPath>
   <clipPath id="body-copy-exit-clip"><rect x="76" y="260" width={1448*(1-ease((t-transitionOutStart)/.26))} height="80"/></clipPath>
   <clipPath id="body-carrier-clip"><rect x="76" y="120" width={1448*bodyIn*(1-bodyOut)} height="646"/></clipPath>
  </defs>
  <g fontFamily="DejaVu Sans, sans-serif">


   <g clipPath="url(#header-carrier-clip)" data-header="logo-current-title"><g transform={`translate(${headerX+chapterTitleShift} 0)`} data-title-transition="opaque-slide"><Text x={140} y={91} size={36} weight={700} color="url(#header-theme)">{s.k}</Text></g></g>
   <g clipPath="url(#body-carrier-clip)" data-transition="shared-content-carrier"><g transform={`translate(${bodyX} ${-90-12*bodyOut}) translate(800 430) scale(${1-.045*bodyOut}) translate(-800 -430)`}>
    <g clipPath="url(#body-copy-exit-clip)" opacity={reveal}><Text x={80} y={300} size={32} color={muted}>{s.body}</Text></g>
    <g transform="translate(0 25)">
    {(scene===0||scene===2||scene===3)&&<g>
     <path d="M245 532H1350" stroke="#d6dfe9" strokeWidth="5"/>
     <Box x={80} y={495} title={scene===3?'First URL':'Request'} detail={scene===3?'Public source accepted':'GET / document'} color={blue}/>
     <Box x={595} y={495} title="URL policy" detail={scene===3?'Examine the new target':'Host + address rules'} color={scene===0?blue:red}/>
     <Box x={1110} y={495} w={410} title={scene===0?'Fetch source':'Rejected'} detail={scene===0?'Local response fixture':'No target dispatch'} color={scene===0?green:red}/>
     {scene===3&&<path d="M1260 661H785V632" fill="none" stroke={blue} strokeWidth="4" strokeDasharray="10 8" strokeDashoffset={-local*15}/>}
    </g>}
    {scene===1&&<g><Text x={110} y={650} size={230} color={green} weight={700}>27</Text><Text x={465} y={526} size={43} weight={700}>Specified results observed</Text><Text x={465} y={585} size={30} color={muted}>Zero real fetch attempts</Text><Text x={465} y={642} size={30} color={muted}>Zero conversion calls</Text></g>}
    {scene===4&&<g>
      <Box x={80} y={490} w={635} h={138} title="URL hostname" detail="Text examined by the policy" color={blue}/>
      <Box x={890} y={490} w={630} h={138} title="DNS + connection" detail="Different controls are necessary" color={red}/>
      <path d="M800 410V720" stroke="#cad4e0" strokeWidth="3" strokeDasharray="10 8"/>
      <Text x={385} y={715} size={28} color={green} anchor="middle" weight={700}>ACCEPTED BY URL POLICY</Text>
      <Text x={1200} y={715} size={28} color={muted} anchor="middle">NOT TESTED HERE</Text>
    </g>}
    {scene===5&&<g>
      <Box x={80} y={495} w={440} h={154} title="Ordinary fetch" detail="Runtime DNS + routing" color={blue}/>
      <Box x={580} y={495} w={440} h={154} title="VPC Service" detail="Configuration fixes target" color={green}/>
      <Box x={1080} y={495} w={440} h={154} title="VPC Network" detail="URL selects network target" color={red}/>
      <Text x={800} y={715} size={28} color={muted} anchor="middle">Documentation scope</Text><Text x={800} y={755} size={28} color={muted} anchor="middle">No VPC deployment tested</Text>
    </g>}
    {scene===6&&<g>
      <Box x={80} y={525} w={450} h={132} title="HTML input" detail="6 MiB conversion limit" color={blue}/>
      <path d="M555 585H995" stroke="#cbd6e3" strokeWidth="5"/>
      {[0,1,2,3].map(i=><rect key={i} x={565+((local*70+i*110)%405)} y="567" width="27" height="36" rx="6" fill={blue} opacity={.45+i*.13}/>)}
      <Box x={1040} y={525} w={480} h={132} title="Markdown body" detail="SDK limit is a different stage" color={green}/>
      <Text x={800} y={715} size={27} color={muted} anchor="middle">HTML input bytes ≠ response bytes</Text><Text x={800} y={755} size={27} color={muted} anchor="middle">Neither is a model-token count</Text>
    </g>}
    {scene===7&&<g>
      <Box x={80} y={495} w={655} h={168} title="8 bytes: accepted" detail="Configured maxBytes = 8" color={green}/>
      <Box x={865} y={495} w={655} h={168} title="9 bytes: rejected" detail="web_fetch_too_large" color={red}/>
      {Array.from({length:8},(_,i)=><rect key={i} x={115+i*66} y="612" width="48" height="23" rx="5" fill={green} opacity={ease((local-i*.08)/.4)}/>)}
      {Array.from({length:9},(_,i)=><rect key={i} x={900+i*61} y="612" width="45" height="23" rx="5" fill={i===8?red:blue} opacity={ease((local-i*.08)/.4)}/>)}
      <Text x={800} y={715} size={28} color={muted} anchor="middle">Both responses were local fixtures</Text><Text x={800} y={755} size={28} color={muted} anchor="middle">Neither included Content-Length</Text>
    </g>}
    {scene===8&&<g><Box x={80} y={495} w={655} h={155} title="1. Restrict the request" detail="Hosts + redirects + response limits" color={blue}/><Box x={860} y={495} w={660} h={155} title="2. Examine the network" detail="Test the actual deployment configuration" color={green}/></g>}
    <g data-shared="url-token" transform={`translate(${px} ${py})`}>
     <rect width="248" height="53" rx="26.5" fill={tokenColor}/><Text x={124} y={36} size={23} weight={700} color="white" anchor="middle">{tokenLabel}</Text>
    </g>
    </g>

   </g></g>

  </g>
  <defs><linearGradient id="video-progress-colors" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={blue}/><stop offset="50%" stopColor={green}/><stop offset="100%" stopColor={red}/></linearGradient><clipPath id="video-progress-reveal"><rect x="0" y="892.5" width={1600*clamp(frame/(timing.durationInFrames-1))} height="7.5"/></clipPath></defs>
  <g data-progress="whole-video" aria-label="Video progress"><rect x="0" y="892.5" width="1600" height="7.5" fill="#e2e8f0"/><rect x="0" y="892.5" width="1600" height="7.5" fill="url(#video-progress-colors)" clipPath="url(#video-progress-reveal)"/></g>
 </svg>;
}
export const Video=()=>{const frame=useCurrentFrame();return <AbsoluteFill style={{background:'#f7f9fc'}}><BrandCanvas time={frame/60}/><div style={{position:'absolute',width:1600,height:900,transform:'scale(.8)',transformOrigin:'top left'}}><Frame frame={frame}/></div><Audio src={staticFile('narration-sfx.wav')}/></AbsoluteFill>};
